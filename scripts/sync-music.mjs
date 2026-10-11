import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const config = JSON.parse(await fs.readFile(new URL('music.json', root), 'utf8'));
const output = new URL('public/music-playlist.json', root);
if (config.provider !== 'netease' || !/^\d+$/.test(config.playlistId)) process.exit(0);

async function readJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data.code !== 200) throw new Error(`NetEase code ${data.code}`);
  return data;
}

try {
  const { playlist } = await readJson(`https://music.163.com/api/v6/playlist/detail?id=${config.playlistId}&n=1000`);
  if (!Array.isArray(playlist?.trackIds)) throw new Error('Missing playlist track IDs');
  const ids = [...new Set(playlist.trackIds.map(track => String(track.id)))];
  if (ids.some(id => !/^\d+$/.test(id))) throw new Error('Invalid track ID');
  const songs = new Map();
  for (let offset = 0; offset < ids.length; offset += 50) {
    const batch = ids.slice(offset, offset + 50);
    const result = await readJson(`https://music.163.com/api/song/detail?ids=${encodeURIComponent(JSON.stringify(batch))}`);
    if (!Array.isArray(result.songs)) throw new Error('Missing song metadata');
    for (const song of result.songs) {
      songs.set(String(song.id), {
        id: String(song.id),
        title: song.name,
        artist: (song.artists || song.ar || []).map(artist => artist.name).join(' / '),
        duration: song.duration || song.dt || 0,
      });
    }
  }
  const tracks = ids.map(id => songs.get(id)).filter(Boolean);
  if (tracks.length !== ids.length) throw new Error(`Incomplete metadata: ${tracks.length}/${ids.length}`);
  const snapshot = { playlistId: config.playlistId, source: config.source, title: playlist.name, updatedAt: new Date().toISOString(), total: tracks.length, tracks };
  await fs.writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Synced NetEase playlist ${config.playlistId}: ${tracks.length} songs.`);
} catch (error) {
  // Keep the last complete snapshot if the upstream service is temporarily unavailable.
  const cache = JSON.parse(await fs.readFile(output, 'utf8').catch(() => 'null'));
  if (cache?.playlistId !== config.playlistId || !Array.isArray(cache.tracks)) throw error;
  console.warn(`NetEase sync unavailable (${error.message}); keeping ${cache.tracks.length} cached songs.`);
}
