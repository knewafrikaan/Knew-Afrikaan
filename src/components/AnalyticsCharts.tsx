import React, { useState } from 'react';
import { TrackAsset, LegacyCatalogItem, CohortArtist } from '../types';
import { BarChart3, PieChart, ShieldCheck, TrendingUp, MapPin, Layers, Coins, Globe } from 'lucide-react';

interface AnalyticsChartsProps {
  tracks: TrackAsset[];
  legacyItems: LegacyCatalogItem[];
  cohortArtists: CohortArtist[];
}

export default function AnalyticsCharts({ tracks, legacyItems, cohortArtists }: AnalyticsChartsProps) {
  const [activeTab, setActiveTab] = useState<'sources' | 'pipeline' | 'demographics'>('sources');

  // Royalty source aggregation
  const sourceTotals: Record<string, number> = {
    'The MLC (Mechanical)': 24500,
    'SoundExchange (Digital Performance)': 18900,
    'MCSN (Public Performance)': 12300,
    'Songtrust (Global Publishing)': 11200,
  };

  const totalSources = Object.values(sourceTotals).reduce((a, b) => a + b, 0);

  // Status breakdown
  const statusCounts = {
    Recovered: legacyItems.filter((i) => i.claimStatus === 'Recovered').length,
    LOD_Signed: legacyItems.filter((i) => i.claimStatus === 'LOD_Signed').length,
    Scanning: legacyItems.filter((i) => i.claimStatus === 'Scanning').length,
    Conflict: legacyItems.filter((i) => i.claimStatus === 'Conflict').length,
    LOD_Required: legacyItems.filter((i) => i.claimStatus === 'LOD_Required').length,
  };

  return (
    <div className="bg-white/70 border border-black/5 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Visual Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sahel-ochre/10 text-sahel-ochre">
              <BarChart3 className="h-4 w-4" />
            </span>
            <h3 className="font-serif font-bold text-base text-sahel-ink">
              Arewa IP Royalty Analytics & Health Index
            </h3>
          </div>
          <p className="text-xs text-sahel-ink/60 mt-0.5 font-mono">
            Real-time visualization of recovered black-box royalties, PRO pipeline allocations, and regional demographics.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-sahel-earth/30 p-1 rounded-xl font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'sources'
                ? 'bg-sahel-ink text-sahel-sand shadow-sm'
                : 'text-sahel-ink/70 hover:text-sahel-ink'
            }`}
          >
            PRO Sources
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-sahel-ink text-sahel-sand shadow-sm'
                : 'text-sahel-ink/70 hover:text-sahel-ink'
            }`}
          >
            Claim Pipeline
          </button>
          <button
            onClick={() => setActiveTab('demographics')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'demographics'
                ? 'bg-sahel-ink text-sahel-sand shadow-sm'
                : 'text-sahel-ink/70 hover:text-sahel-ink'
            }`}
          >
            Regional Map
          </button>
        </div>
      </div>

      {/* Tab 1: PRO Royalty Sources Breakdown */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
          {/* Visual Stacked Bar / Distribution Graphic */}
          <div className="md:col-span-7 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase text-sahel-ink/50 tracking-wider">
              Royalty Capital Allocation Breakdown (${totalSources.toLocaleString()} USD Total)
            </h4>

            {/* Custom SVG Bar Chart */}
            <div className="space-y-3">
              {Object.entries(sourceTotals).map(([source, amount], idx) => {
                const percentage = Math.round((amount / totalSources) * 100);
                const colors = ['bg-sahel-ochre', 'bg-sahel-olive', 'bg-sahel-clay', 'bg-sahel-ink'];
                const textColor = ['text-sahel-ochre', 'text-sahel-olive', 'text-sahel-clay', 'text-sahel-ink'][idx];

                return (
                  <div key={source} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-semibold text-sahel-ink">{source}</span>
                      <span className={`font-bold ${textColor}`}>
                        ${amount.toLocaleString()} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-sahel-earth/30 rounded-full h-3.5 p-0.5 overflow-hidden">
                      <div
                        className={`${colors[idx]} h-full rounded-full transition-all duration-700`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Health Index Ring Widget */}
          <div className="md:col-span-5 bg-sahel-earth/20 rounded-xl p-4 border border-black/5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-sahel-ink/60">
                Catalog Metadata Health Score
              </span>
              <span className="px-2 py-0.5 rounded bg-sahel-olive/20 text-sahel-olive font-mono text-[10px] font-bold">
                GRADE A
              </span>
            </div>

            <div className="my-4 text-center">
              <div className="inline-flex items-center justify-center relative w-28 h-28">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#D9C5B2"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#7D7C44"
                    strokeWidth="8"
                    strokeDasharray="289"
                    strokeDashoffset="35"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-serif font-black text-sahel-ink">88%</span>
                  <span className="text-[9px] font-mono text-sahel-ink/60">Verified CWR</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-sahel-ink/70 text-center leading-normal">
              88% of registered catalog items contain complete ISWC, ISRC, and IPI split verification tags for immediate automated clearing.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Claim Pipeline Flow */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase text-sahel-ink/50 tracking-wider">
            Retroactive Black Box Recoveries - Lifecycle Stage Distribution
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Scanning', count: statusCounts.Scanning, color: 'bg-sahel-earth/40 text-sahel-ink border-black/10' },
              { label: 'LOD Required', count: statusCounts.LOD_Required, color: 'bg-sahel-ochre/20 text-sahel-ochre border-sahel-ochre/30' },
              { label: 'LOD Signed', count: statusCounts.LOD_Signed, color: 'bg-sahel-clay/20 text-sahel-clay border-sahel-clay/30' },
              { label: 'Split Conflict', count: statusCounts.Conflict, color: 'bg-red-500/10 text-red-700 border-red-500/20' },
              { label: 'Recovered', count: statusCounts.Recovered, color: 'bg-sahel-olive/20 text-sahel-olive border-sahel-olive/30' },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-3 rounded-xl border ${item.color} text-center flex flex-col items-center justify-center shadow-xs`}
              >
                <span className="text-2xl font-serif font-black">{item.count}</span>
                <span className="text-[10px] font-mono font-bold uppercase mt-1 opacity-80">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-sahel-ink text-sahel-sand rounded-xl font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-sahel-ochre" />
              <span>Estimated Unclaimed Pool Identified:</span>
            </div>
            <span className="font-bold text-sahel-ochre text-sm">$77,000 USD</span>
          </div>
        </div>
      )}

      {/* Tab 3: Regional Map Cards */}
      {activeTab === 'demographics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {[
            { city: 'Kano, Nigeria', dialect: 'Kano Hausa', artists: 18, share: '38%', tag: 'Core Hub' },
            { city: 'Zaria, Nigeria', dialect: 'Arewa Hausa', artists: 12, share: '25%', tag: 'Production Center' },
            { city: 'Niamey, Niger', dialect: 'Fulfulde (Sahelian)', artists: 8, share: '18%', tag: 'Cross-Border' },
            { city: 'Jos, Nigeria', dialect: 'Middle Belt Hausa', artists: 11, share: '19%', tag: 'Live Acoustic' },
          ].map((loc) => (
            <div key={loc.city} className="p-3.5 bg-white/80 border border-black/5 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sahel-ochre/15 text-sahel-ochre">
                  {loc.tag}
                </span>
                <span className="text-xs font-mono font-bold text-sahel-olive">{loc.share}</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-sahel-clay shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-serif font-bold text-sm text-sahel-ink">{loc.city}</h5>
                  <p className="text-[11px] font-mono text-sahel-ink/60">{loc.dialect}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-black/5 flex justify-between items-center text-[11px] font-mono text-sahel-ink/70">
                <span>Roster Acts:</span>
                <span className="font-bold text-sahel-ink">{loc.artists} Cohort Members</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
