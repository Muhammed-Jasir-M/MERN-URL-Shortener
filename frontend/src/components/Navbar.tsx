import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link2, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Shortener', icon: Link2 },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-violet-500/20 group-hover:shadow-lg group-hover:shadow-violet-500/30 transition-all duration-300">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
              <Link2 className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-violet-950 to-indigo-900 bg-clip-text text-transparent">
              Sniplink
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 -mt-1">
              URL Shortener
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-violet-700 shadow-sm shadow-slate-200 border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 border border-violet-100'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
