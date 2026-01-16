import news from '../mock-data/news.json' assert { type: 'json' };

export async function getLatestNews(limit = 6) {
  return news.slice(0, limit);
}

export async function getNewsBySlug(slug) {
  return news.find((n) => n.link.endsWith(slug));
}


