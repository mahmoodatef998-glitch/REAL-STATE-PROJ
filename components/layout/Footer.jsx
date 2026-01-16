import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-neutral-950">
      <div className="container-x py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-neutral-300">
        <div>
          <div className="font-semibold mb-3 text-white">Who</div>
          <ul className="space-y-2">
            <li><Link className="hover:text-accent" href="/about">About</Link></li>
            <li><Link className="hover:text-accent" href="/careers">Careers</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-white">What</div>
          <ul className="space-y-2">
            <li><Link className="hover:text-accent" href="/projects">Projects</Link></li>
            <li><Link className="hover:text-accent" href="/disciplines">Disciplines</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-white">Impact</div>
          <ul className="space-y-2">
            <li><Link className="hover:text-accent" href="/sustainability">Sustainability</Link></li>
            <li><Link className="hover:text-accent" href="/news">News</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-white">Legal</div>
          <ul className="space-y-2">
            <li><button className="hover:text-accent">Manage Cookies</button></li>
            <li><Link className="hover:text-accent" href="/privacy">Privacy</Link></li>
            <li><Link className="hover:text-accent" href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-6 text-xs text-neutral-500 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Alrabie Real Estate</div>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="hover:text-accent">Twitter</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-accent">LinkedIn</a>
            <a href="#" aria-label="Instagram" className="hover:text-accent">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


