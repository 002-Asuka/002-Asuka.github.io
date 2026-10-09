import { getCollection, type CollectionEntry } from 'astro:content';
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const dateLabel = (date: Date) => new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(date).replaceAll('/', '.');
export const postUrl = (post: CollectionEntry<'posts'>) => url(`posts/${post.id}/`);
export const readingTime = (body = '') => Math.max(1, Math.ceil(body.length / 500));
export const publishedPosts = async () => (await getCollection('posts', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
