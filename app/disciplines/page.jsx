import DisciplinesList from '../../components/disciplines/DisciplinesList';

export const metadata = {
  title: 'Expertise | Alrabie Real Estate',
  description: 'Mastering the art of architecture, interior design, and sustainable urban living.',
};

export default function DisciplinesPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-x mb-20 text-center">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">Expertise</h4>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gradient leading-[0.9]">
          BEYOND<br />
          BROKERAGE.
        </h1>
        <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mt-8">
          We offer a multi-disciplinary approach to real estate, integrating design, sustainability, and strategy.
        </p>
      </div>

      <section className="container-x">
        <DisciplinesList />
      </section>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] glow-mesh -z-10 opacity-10 pointer-events-none" />
    </div>
  );
}
