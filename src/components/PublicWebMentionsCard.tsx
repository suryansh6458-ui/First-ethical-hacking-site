import React, { useState } from 'react';
import { ExternalLink, Search, Globe, Filter } from 'lucide-react';
import { WebReferenceFinding } from '../types.ts';

interface PublicWebMentionsCardProps {
  findings: WebReferenceFinding[];
}

export const PublicWebMentionsCard: React.FC<PublicWebMentionsCardProps> = ({ findings }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All References' },
    { id: 'business_directory', label: 'Directories' },
    { id: 'corporate_site', label: 'Corporate' },
    { id: 'data_broker', label: 'Data Brokers' },
    { id: 'public_registry', label: 'Registries' },
    { id: 'social_network', label: 'Social' },
  ];

  const filtered = findings.filter((f) => {
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesQuery =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-7">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Public Web Search Index Mentions</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-emerald-400 font-bold">{findings.length} Indexed Results</span>
          </div>
          <p className="text-xs text-slate-400">
            Publicly accessible web pages that mention or index this phone number, deduplicated with direct source links.
          </p>
        </div>

        {/* Search Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by title/domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-44 rounded-lg border border-slate-700 bg-slate-800/80 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Category Segmented Tabs (Interactive Filter Buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-4 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results List */}
      {filtered.length > 0 ? (
        <div className="divide-y divide-slate-800/60">
          {filtered.map((item) => (
            <div key={item.id} className="py-4 first:pt-2 last:pb-2 group">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-medium text-emerald-400">{item.domain}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{item.category.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px] text-slate-500">{item.matchType} match</span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs leading-relaxed text-slate-400 line-clamp-2">
                    {item.snippet}
                  </p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 shrink-0 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                  title="Open verified public source"
                >
                  <span className="hidden sm:inline">Source</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
          <Globe className="mx-auto h-8 w-8 text-slate-600 mb-2" />
          <h4 className="text-sm font-medium text-slate-300">
            {findings.length === 0
              ? 'No publicly indexed web references discovered'
              : 'No references match current filter criteria'}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {findings.length === 0
              ? 'This phone number does not appear in public internet search engine results or indexed web listings.'
              : 'Try clearing your filter keyword or switching back to "All References".'}
          </p>
        </div>
      )}
    </div>
  );
};
