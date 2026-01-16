import NewsList from '../../components/news/NewsList';

export const metadata = {
  title: 'News & Perspectives | Alrabie Real Estate',
  description: 'Stay informed with our latest insights, project updates, and industry perspectives.',
};

export default function NewsPage() {
  return (
    <div className="pt-16">
      <div className="container-x py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Perspectives</h1>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
            Stay informed with our latest insights, project updates, and industry perspectives
          </p>
        </div>
        <NewsList />
      </div>
    </div>
  );
}
