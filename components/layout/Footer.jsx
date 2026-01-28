import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-white/5 bg-black py-20">
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-sm">
          <div className="lg:col-span-1">
            <Link href="/" className="font-bold tracking-tighter text-xl text-white mb-6 block">
              Alrabie <span className="text-accent">Real Estate</span>
            </Link>
            <p className="text-white/40 leading-relaxed max-w-xs">
              Designing the future of living in UAE with architectural excellence and sustainable solutions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Discovery</div>
            <ul className="space-y-4 font-medium">
              <li><Link className="text-white/60 hover:text-white transition-colors" href="/properties">Properties</Link></li>
              <li><Link className="text-white/60 hover:text-white transition-colors" href="/news">News & Insights</Link></li>
              <li><Link className="text-white/60 hover:text-white transition-colors" href="/about">Our Story</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Services</div>
            <ul className="space-y-4 font-medium">
              <li><Link className="text-white/60 hover:text-white transition-colors" href="/disciplines">Disciplines</Link></li>
              <li><Link className="text-white/60 hover:text-white transition-colors" href="/broker/add-property">Brokers Portal</Link></li>
              <li><Link className="text-white/60 hover:text-white transition-colors" href="/contact">Support</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Legal</div>
            <ul className="space-y-4 font-medium">
              <li><Link className="text-white/60 hover:text-white transition-colors" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-white/60 hover:text-white transition-colors" href="/terms">Terms of Service</Link></li>
              <li><button className="text-white/60 hover:text-white transition-colors">Cookie Settings</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
            © {new Date().getFullYear()} Alrabie Real Estate. All rights reserved.
          </div>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="text-white/40 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
