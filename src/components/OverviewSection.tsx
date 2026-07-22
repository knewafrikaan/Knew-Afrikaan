import React from 'react';
import { TrackAsset, LegacyCatalogItem, CohortArtist } from '../types';
import AnalyticsCharts from './AnalyticsCharts';
import { ShieldCheck, Coins, Users, Globe, Flame, Milestone } from 'lucide-react';

interface OverviewSectionProps {
  tracks: TrackAsset[];
  legacyItems: LegacyCatalogItem[];
  cohortArtists: CohortArtist[];
}

export default function OverviewSection({ tracks, legacyItems, cohortArtists }: OverviewSectionProps) {
  // Financial metrics
  const totalRecovered = legacyItems
    .filter((item) => item.claimStatus === 'Recovered')
    .reduce((sum, item) => sum + item.estimatedUnclaimedRoyalty, 0);

  const totalInFlight = legacyItems
    .filter((item) => ['Scanning', 'LOD_Signed', 'Submitted'].includes(item.claimStatus))
    .reduce((sum, item) => sum + item.estimatedUnclaimedRoyalty, 0);

  const registeredIsrcCount = tracks.filter((t) => t.master.isrc).length;
  const registeredIswcCount = tracks.filter((t) => t.publishing.iswc && t.publishing.iswc !== 'Pending Callback').length;

  return (
    <div className="space-y-6" id="overview-section-dashboard">
      {/* Visual Analytics Graphic Chart */}
      <AnalyticsCharts tracks={tracks} legacyItems={legacyItems} cohortArtists={cohortArtists} />

      {/* Visual Banners / Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Wealth Leak Plugged */}
        <div className="bg-white/60 border border-black/5 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
            <Coins className="h-32 w-32 -mr-4 -mb-4 text-sahel-ochre" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-sahel-ochre/10 text-sahel-ochre">
              <Coins className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono uppercase bg-sahel-ochre/20 text-sahel-ochre px-2 py-0.5 rounded font-bold">
              Goal: Mitigate 50% Leak
            </span>
          </div>
          <p className="text-xs text-sahel-ink/70 font-semibold">Retroactive Wealth Recovered</p>
          <p className="text-2xl font-serif font-bold text-sahel-ink mt-1">
            ${totalRecovered.toLocaleString()} <span className="text-xs font-sans text-sahel-olive font-bold">USD</span>
          </p>
          <p className="text-[10px] text-sahel-ink/60 font-mono mt-1">
            + ${totalInFlight.toLocaleString()} in active lookup scan.
          </p>
        </div>

        {/* Metric 2: Market Formalization */}
        <div className="bg-white/60 border border-black/5 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
            <Users className="h-32 w-32 -mr-4 -mb-4 text-sahel-clay" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-sahel-clay/10 text-sahel-clay">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono uppercase bg-sahel-clay/20 text-sahel-clay px-2 py-0.5 rounded font-bold">
              70M+ Demographics
            </span>
          </div>
          <p className="text-xs text-sahel-ink/70 font-semibold">Cohort Artists Managed</p>
          <p className="text-2xl font-serif font-bold text-sahel-ink mt-1">
            {cohortArtists.length} <span className="text-xs font-sans text-sahel-ink/60 font-normal">Active Arewa Acts</span>
          </p>
          <p className="text-[10px] text-sahel-ink/60 font-mono mt-1">
            Targeting Nigeria, Niger, Chad, Cameroon, Ghana.
          </p>
        </div>

        {/* Metric 3: Digital Metadata Registry */}
        <div className="bg-white/60 border border-black/5 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
            <ShieldCheck className="h-32 w-32 -mr-4 -mb-4 text-sahel-olive" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-sahel-olive/10 text-sahel-olive">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono uppercase bg-sahel-olive/20 text-sahel-olive px-2 py-0.5 rounded font-bold">
              DDEX / CWR Ingest
            </span>
          </div>
          <p className="text-xs text-sahel-ink/70 font-semibold">Registered Identifiers</p>
          <p className="text-2xl font-serif font-bold text-sahel-ink mt-1">
            {registeredIsrcCount} <span className="text-xs font-sans text-sahel-olive font-bold">ISRCs</span>
            <span className="text-sahel-ink/30 mx-1">/</span>
            {registeredIswcCount} <span className="text-xs font-sans text-sahel-clay font-bold">ISWCs</span>
          </p>
          <p className="text-[10px] text-sahel-ink/60 font-mono mt-1">
            Fully standard-compliant publishing sheets.
          </p>
        </div>

        {/* Metric 4: Global Distribution Interfaces */}
        <div className="bg-white/60 border border-black/5 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
            <Globe className="h-32 w-32 -mr-4 -mb-4 text-sahel-ink" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-sahel-earth/50 text-sahel-ink">
              <Globe className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono uppercase bg-sahel-earth/50 text-sahel-ink px-2 py-0.5 rounded font-bold">
              Global Bridges
            </span>
          </div>
          <p className="text-xs text-sahel-ink/70 font-semibold">Connected Royalty PROs</p>
          <p className="text-2xl font-serif font-bold text-sahel-ink mt-1">
            4 <span className="text-xs font-sans text-sahel-ink/60 font-normal">Active Pipelines</span>
          </p>
          <p className="text-[10px] text-sahel-ink/60 font-mono mt-1">
            MLC, SoundExchange, Songtrust, MCSN.
          </p>
        </div>
      </div>

      {/* Strategic Platform Narrative Card */}
      <div className="bg-sahel-ink text-sahel-sand rounded-xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-sahel-earth/20 to-transparent opacity-40 pointer-events-none"></div>
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono font-bold text-sahel-ochre uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 fill-current" /> Northern Frontier Creative Backbone
          </span>
          <h2 className="text-2xl font-serif font-bold italic leading-tight text-white">
            Formalizing Arewa IP and Closing the Global Compensation Gap
          </h2>
          <p className="text-sm text-sahel-sand/80 leading-relaxed">
            While major global music corporations focus extensively on Lagos-centric Afrobeats, the 
            <strong> 70-million-strong Hausa-speaking demographic</strong> across Niger, Chad, Cameroon, Ghana, and Nigeria 
            remains an untapped goldmine. KnewAfrikaan establishes the critical rights management infrastructure to prevent 
            historical "black box" unclaimed revenues and distribute direct, recoupment-based split shares to independent Sahelian composers and master producers.
          </p>
          <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-sahel-ochre">
              <Milestone className="h-4 w-4" />
              <span>Dolby Atmos Digital Studio Ingestion</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-sahel-olive">
              <ShieldCheck className="h-4 w-4" />
              <span>DDEX & CWR Universal Metadata Alignment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
