import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

const settings = JSON.parse(readFileSync(new URL('./site.json', import.meta.url), 'utf8'));
const [owner, repository] = (process.env.GITHUB_REPOSITORY || `${settings.github}/${settings.repository}`).split('/');
export default defineConfig({
  site: `https://${owner}.github.io`,
  base: repository.toLowerCase() === `${owner}.github.io`.toLowerCase() ? '/' : `/${repository}`,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { theme: 'github-light' } },
  vite: { ssr: { external: ['yaml'] } },
});
