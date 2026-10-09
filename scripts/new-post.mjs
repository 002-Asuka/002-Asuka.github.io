import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const [title, slug] = process.argv.slice(2);
if (!title || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('用法：pnpm new "随笔标题" english-file-name\n文件名只能包含小写英文字母、数字和连字符。');
  process.exit(1);
}
const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
const get = type => parts.find(p => p.type === type).value;
const date = `${get('year')}-${get('month')}-${get('day')}`;
const root = fileURLToPath(new URL('../', import.meta.url));
const folder = path.join(root, 'src', 'content', 'posts');
await mkdir(folder, { recursive: true });
const target = path.join(folder, `${date}-${slug}.md`);
try {
  await writeFile(target, `---\ntitle: ${JSON.stringify(title)}\ndescription: ""\ndate: ${date}\ntags: [日常]\ndraft: true\n---\n\n从这里开始写正文。\n`, { encoding: 'utf8', flag: 'wx' });
  console.log(`已创建草稿：${target}\n写好后把 draft 改为 false，再提交到 GitHub 即可发布。`);
} catch (error) {
  if (error.code === 'EEXIST') { console.error('这个文件已存在，请换一个文件名。'); process.exit(1); }
  throw error;
}
