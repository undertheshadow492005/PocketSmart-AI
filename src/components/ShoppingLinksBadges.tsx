import React from 'react';
import { ShoppingLinks } from '../types';
import { ExternalLink, ShoppingBag, Utensils, Hotel, Ticket, Sparkles } from 'lucide-react';

interface ShoppingLinksBadgesProps {
  links?: ShoppingLinks;
}

export const ShoppingLinksBadges: React.FC<ShoppingLinksBadgesProps> = ({ links }) => {
  if (!links || Object.keys(links).length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mr-1 flex items-center gap-1">
        <ShoppingBag className="w-3 h-3" /> Shop:
      </span>

      {links.ikea && (
        <a
          href={links.ikea}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
        >
          <span>IKEA</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.amazon && (
        <a
          href={links.amazon}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
        >
          <span>Amazon</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.flipkart && (
        <a
          href={links.flipkart}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
        >
          <span>Flipkart</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.tanishq && (
        <a
          href={links.tanishq}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-600/15 text-amber-200 border border-amber-600/30 hover:bg-amber-600/25 transition-colors"
        >
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>Tanishq</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.caratlane && (
        <a
          href={links.caratlane}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
        >
          <span>Caratlane</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.bluestone && (
        <a
          href={links.bluestone}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
        >
          <span>Bluestone</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.swiggy && (
        <a
          href={links.swiggy}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-600/10 text-orange-400 border border-orange-600/20 hover:bg-orange-600/20 transition-colors"
        >
          <Utensils className="w-2.5 h-2.5" />
          <span>Swiggy</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.zomato && (
        <a
          href={links.zomato}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 transition-colors"
        >
          <Utensils className="w-2.5 h-2.5" />
          <span>Zomato</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.oyorooms && (
        <a
          href={links.oyorooms}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
        >
          <Hotel className="w-2.5 h-2.5" />
          <span>OYO</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.makemytrip && (
        <a
          href={links.makemytrip}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 transition-colors"
        >
          <span>MakeMyTrip</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.bookmyshow && (
        <a
          href={links.bookmyshow}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/20 hover:bg-pink-500/20 transition-colors"
        >
          <Ticket className="w-2.5 h-2.5" />
          <span>BookMyShow</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.myntra && (
        <a
          href={links.myntra}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 hover:bg-fuchsia-500/20 transition-colors"
        >
          <span>Myntra</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}

      {links.ajio && (
        <a
          href={links.ajio}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700 transition-colors"
        >
          <span>Ajio</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      )}
    </div>
  );
};
