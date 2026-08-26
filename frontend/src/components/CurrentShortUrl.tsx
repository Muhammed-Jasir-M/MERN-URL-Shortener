import { useState } from 'react';
import { Copy, ExternalLink, Check, Download, QrCode, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { CurrentShortUrlProps } from '../types/types';

const CurrentShortUrl = ({ currentShortUrl, handleCopy, copied }: CurrentShortUrlProps) => {
  const [showQr, setShowQr] = useState(false);

  const handleDownloadQr = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 300, 300);
        ctx.drawImage(img, 0, 0, 300, 300);
        const link = document.createElement('a');
        link.download = `qr-${currentShortUrl.shortCode}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-violet-50/90 via-indigo-50/50 to-white rounded-3xl border border-violet-200/80 shadow-lg shadow-violet-500/5 animate-in fade-in zoom-in-95 duration-300">
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 text-violet-900 font-bold text-xs sm:text-sm">
          <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span>Your Short URL is Ready!</span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100/80 text-emerald-700 rounded-full text-[11px] sm:text-xs font-bold border border-emerald-200/60 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {currentShortUrl.clicks} Clicks
        </span>
      </div>

      {/* Main Short URL Input (Full Width) */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          value={currentShortUrl.shortUrl}
          readOnly
          className="w-full px-3.5 sm:px-4 py-3 bg-white border-2 border-violet-200 rounded-2xl text-violet-700 font-extrabold text-sm sm:text-base shadow-sm focus:outline-none select-all break-all"
        />

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(currentShortUrl.shortUrl)}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25 active:scale-95'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <a
            href={currentShortUrl.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Visit</span>
          </a>
        </div>
      </div>

      {/* Original Long URL Details */}
      <div className="text-xs text-slate-600 mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200/60 flex items-start gap-2 min-w-0">
        <span className="font-bold text-slate-700 flex-shrink-0">Target:</span>
        <span className="break-all text-slate-500 min-w-0 font-medium">{currentShortUrl.longUrl}</span>
      </div>

      {/* QR Code Actions & Preview */}
      <div className="border-t border-violet-100 pt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <button
          onClick={() => setShowQr(!showQr)}
          className="flex items-center justify-center gap-2 text-xs font-bold text-violet-700 hover:text-violet-800 bg-white hover:bg-violet-50 px-4 py-2.5 rounded-xl border border-violet-200 transition-colors"
        >
          <QrCode className="w-4 h-4" />
          <span>{showQr ? 'Hide QR Code' : 'Show QR Code'}</span>
        </button>

        {showQr && (
          <button
            onClick={handleDownloadQr}
            className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        )}
      </div>

      {showQr && (
        <div className="mt-4 pt-4 border-t border-violet-100 flex justify-center animate-in fade-in duration-200">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col items-center gap-2">
            <QRCodeSVG
              id="qr-code-svg"
              value={currentShortUrl.shortUrl}
              size={150}
              bgColor="white"
              fgColor="#1e1b4b"
              level="M"
            />
            <span className="text-[10px] font-semibold text-slate-400">Scan with camera</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentShortUrl;
