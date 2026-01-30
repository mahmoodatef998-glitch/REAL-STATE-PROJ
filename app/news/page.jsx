import NewsList from '../../components/news/NewsList';

export const metadata = {
  title: 'Insights | Alrabie Real Estate',
  description: 'Exploring the future of real estate, architecture, and living in the UAE.',
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-x mb-20">
        <div className="max-w-4xl">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">Journal</h4>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gradient mb-8">
            NEWS &<br />
            PERSPECTIVES.
          </h1>
          <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            Stay informed with our latest insights, project updates, and expert opinions on the evolving landscape of Emirati real estate.
          </p>
        </div>
      </div>

      <section className="container-x">
        <NewsList />
      </section>

      <div className="fixed bottom-0 left-0 h-[600px] w-[600px] glow-mesh -z-10 opacity-10 pointer-events-none" />
    </div>
  );
}
