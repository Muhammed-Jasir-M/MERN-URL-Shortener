import { Zap, BarChart3, QrCode, Link2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  badge: string;
  color: string;
}

const features: FeatureItem[] = [
  {
    icon: Zap,
    title: 'Instant Shortening',
    desc: 'Create compact links instantly with nano-ID generation algorithm.',
    badge: 'Fast',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Track click performance live with precise aggregate metrics.',
    badge: 'Insights',
    color: 'from-violet-500 to-indigo-500',
  },
  {
    icon: QrCode,
    title: 'QR Code Generator',
    desc: 'Auto-generate high-res downloadable QR codes for print & web.',
    badge: 'Visual',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Link2,
    title: 'Custom Aliases',
    desc: 'Customize link paths with branded keywords for higher CTR.',
    badge: 'Branded',
    color: 'from-rose-500 to-pink-500',
  },
];

export default function FeatureGrid() {
  return (
    <div className="mt-24">
      <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Everything You Need</h2>
        <p className="text-sm font-medium text-slate-500">
          Powerful link management features built for individuals and developers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-violet-200 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-violet-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                  {feature.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
