import GetInTouch from '../../components/home/GetInTouch';

export const metadata = {
  title: 'Connect | Alrabie Real Estate',
  description: 'Connect with our specialists for a private consultation on UAE real estate.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-x mb-20 text-center">
        <h1 className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-6">Contact Us</h1>
        <p className="text-4xl md:text-6xl font-black tracking-tighter text-white">READY TO FIND YOUR<br />DREAM SPACE?</p>
      </div>

      <GetInTouch />

      <div className="container-x mt-32 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bento-card">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Location</h4>
          <p className="text-white/60 font-medium">Business Bay, Tower A<br />Office 1204, Dubai, UAE</p>
        </div>
        <div className="bento-card">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Inquiries</h4>
          <p className="text-white/60 font-medium">info@alrabie.ae<br />+971 4 800-AL-RABIE</p>
        </div>
        <div className="bento-card">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Support</h4>
          <p className="text-white/60 font-medium">support@alrabie.ae<br />24/7 Concierge Service</p>
        </div>
      </div>
    </div>
  );
}
