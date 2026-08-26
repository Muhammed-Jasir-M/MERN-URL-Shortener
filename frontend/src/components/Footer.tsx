import { Link2, Github, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
      {/* Brand & Author */}
      <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
          <Link2 className="w-4 h-4" />
        </div>
        <span className="font-extrabold text-slate-800 tracking-tight text-base">Sniplink</span>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline flex-shrink-0" /> by{' '}
          <strong className="text-slate-800 font-bold whitespace-nowrap">Muhammed Jasir</strong>
        </span>
      </div>

      {/* Copyright & Links */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} Sniplink</span>
        <span className="text-slate-300">•</span>
        <a
          href="https://github.com/Muhammed-Jasir-M/MERN-URL-Shortener"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-violet-600 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>GitHub Repository</span>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
