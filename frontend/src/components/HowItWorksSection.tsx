import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Paste Long Link',
    desc: 'Insert any web link into the URL input field above.',
  },
  {
    num: '02',
    title: 'Customize (Optional)',
    desc: 'Type a custom slug alias to personalize your brand URL.',
  },
  {
    num: '03',
    title: 'Share & Track',
    desc: 'Copy your mini link or download QR code and measure clicks.',
  },
];

export default function HowItWorksSection() {
  const navigate = useNavigate();

  return (
    <div className="mt-24 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
      <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How Sniplink Works</h2>
        <p className="text-sm font-medium text-slate-500">Shorten links in three simple steps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className="relative space-y-3">
            <span className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {step.num}
            </span>
            <h3 className="font-bold text-slate-900 text-base">{step.title}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Banner */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>Ready to view all your shortened links and click analytics?</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Go To Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
