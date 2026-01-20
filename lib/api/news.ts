import news from '../mock-data/news.json';

export interface NewsItem {
    id: number | string;
    title: string;
    description: string;
    link: string;
    image: string;
    date: string;
}

// Since news.json is imported, we can treat it as any[] or defined interface if we strictly type the json
// For now, assuming standard import behavior with resolveJsonModule: true

export async function getLatestNews(limit: number = 6): Promise<NewsItem[]> {
    return (news as unknown as NewsItem[]).slice(0, limit);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
    return (news as unknown as NewsItem[]).find((n) => n.link.endsWith(slug));
}
