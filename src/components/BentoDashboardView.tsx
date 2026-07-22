import React from 'react';
import { TrackAsset, LegacyCatalogItem, CohortArtist, UserRole } from '../types';
import AnalyticsCharts from './AnalyticsCharts';
import {
  Coins,
  ShieldCheck,
  Users,
  Globe,
  Database,
  Search,
  ShoppingBag,
  Scale,
  GraduationCap,
  Network,
  Smartphone,
  Play,
  ArrowUpRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';

interface BentoDashboardViewProps {
  tracks: TrackAsset[];
  legacyItems: LegacyCatalogItem[];
  cohortArtists: CohortArtist[];
  currentRole: UserRole;
  onSelectTab: (tabId: string) => void;
  onPlayTrack: (trackId: string) => void;
  onAddLog: (log: string) => void;
}

export default function BentoDashboardView({
  tracks,
  legacyItems,
  cohortArtists,
  currentRole,
  onSelectTab,
  onPlayTrack,
  onAddLog,
}: BentoDashboardViewProps) {
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
    <div className="space-y-6" id="bento-command-center">
      {/* Visual Header Banner */}
      <div className="bg-sahel-ink text-sahel-sand rounded-2xl p-6 relative overflow-hidden shadow-lg border border-black/10">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-sahel-ochre/30 to-transparent opacity-50 pointer-events-none"></div>
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sahel-ochre bg-sahel-ochre/20 border border-sahel-ochre/30 px-2 py-0.5 rounded">
              Bento Executive View
            </span>
          </div>

          <h2 className="text-2xl font-serif font-black italic text-white">
            KnewAfrikaan Command Center
          </h2>

          <p className="text-xs text-sahel-sand/80 font-sans leading-relaxed">
            Centralized DRM & fintech operations dashboard bridging Arewa Sahelian catalog owners with MLC, SoundExchange, Songtrust, and MTN MoMo payment gateways.
          </p>
        </div>
      </div>

      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white/80 border border-black/5 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-sahel-ochre/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-sahel-ochre/10 text-sahel-ochre">
              <Coins className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-sahel-olive bg-sahel-olive/10 px-2 py-0.5 rounded">
              +18.4% YoY
            </span>
          </div>
          <p className="text-xs text-sahel-ink/60 font-semibold font-mono">Recovered Wealth</p>
          <p className="text-2xl font-serif font-bold text-sahel-ink mt-0.5">
            ${totalRecovered.toLocaleString()} <span className="text-xs font-sans text-sahel-olive font-bold">USD</span>
          </p>
          <p className="text-[10px] text-sahel-ink/50 font-mono mt-1">
            +${totalInFlight.toLocaleString()} USD in active claim recovery.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white/80 border border-black/5 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-sahel-clay/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-sahel-clay/10 text-sahel-clay">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-sahel-clay bg-sahel-clay/10 px-2 py-0.5 rounded">
              DDEX ERN 4.3
            </span>
          </div>
          <p className="text-xs text-sahel-ink/60 font-semibold font-mono">Catalog Identifiers</p>
          <p className="text-2xl font-serif font-bold text-sahel-ink mt-0.5">
            {registeredIsrcCount} <span className="text-xs font-sans text-sahel-olive font-bold">ISRCs</span>
            <span className="text-sahel-ink/30 mx-1">/</span>
            {registeredIswcCount} <span className="text-xs font-sans text-sahel-clay font-bold">ISWCs</span>
          </p>
          <p className="text-[10px] text-sahel-ink/50 font-mono mt-1">
            {tracks.length} active sound recordings in database.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white/80 border border-black/5 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-sahel-olive/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-sahel-olive/10 text-sahel-olive">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-sahel-ochre bg-sahel-ochre/10 px-2 py-0.5 rounded">
              Cohort Roster
            </span>
          </div>
          <p className="text-xs text-sahel-ink/60 font-semibold font-mono">Arewa Roster Acts</p>
          <p className="text-2xl font-serif font-bold text-sahel-ink mt-0.5">
            {cohortArtists.length} <span className="text-xs font-sans text-sahel-ink/60 font-normal">Active Acts</span>
          </p>
          <p className="text-[10px] text-sahel-ink/50 font-mono mt-1">
            Kano, Zaria, Niamey, N'Djamena, Jos.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white/80 border border-black/5 rounded-2xl p-4 shadow-xs relative overflow-hidden group hover:border-sahel-ink/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-sahel-earth/50 text-sahel-ink">
              <Globe className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-sahel-ink bg-sahel-earth/40 px-2 py-0.5 rounded">
              Active Sockets
            </span>
          </div>
          <p className="text-xs text-sahel-ink/60 font-semibold font-mono">Connected PROs</p>
          <p className="text-2xl font-serif font-bold text-sahel-ink mt-0.5">
            4 <span className="text-xs font-sans text-sahel-ink/60 font-normal">Live Pipelines</span>
          </p>
          <p className="text-[10px] text-sahel-ink/50 font-mono mt-1">
            MLC, SoundExchange, Songtrust, MCSN.
          </p>
        </div>
      </div>

      {/* Main Interactive Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bento Item 1: Interactive Royalty Chart (Spans 12 columns) */}
        <div className="md:col-span-12">
          <AnalyticsCharts tracks={tracks} legacyItems={legacyItems} cohortArtists={cohortArtists} />
        </div>

        {/* Bento Item 2: Ingestion Hub Quick Card (Spans 6 columns) */}
        <div className="md:col-span-6 bg-white/70 border border-black/5 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sahel-ochre/10 text-sahel-ochre">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-sahel-ink">Dual Ingestion Hub</h3>
                  <p className="text-[11px] font-mono text-sahel-ink/60">Dolby Atmos Masters & CWR Publishing</p>
                </div>
              </div>

              <button
                onClick={() => onSelectTab('ingestion')}
                className="p-1.5 hover:bg-sahel-earth/30 rounded-lg text-sahel-ink/70 hover:text-sahel-ink transition-all cursor-pointer"
                title="Open Full Ingestion Module"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            {/* Ingested Track List */}
            <div className="space-y-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="p-3 bg-white/80 border border-black/5 rounded-xl flex items-center justify-between gap-2 hover:border-sahel-ochre/30 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => onPlayTrack(track.id)}
                      className="p-2 bg-sahel-ink text-sahel-sand rounded-lg hover:bg-sahel-ochre hover:text-sahel-ink transition-colors shrink-0 cursor-pointer"
                      title="Play Preview"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </button>

                    <div className="min-w-0">
                      <p className="font-serif font-bold text-xs text-sahel-ink truncate">
                        {track.master.recordingTitle}
                      </p>
                      <p className="text-[10px] font-mono text-sahel-ink/60 truncate">
                        {track.master.primaryArtists.join(', ')} • ISRC: {track.master.isrc}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sahel-olive/15 text-sahel-olive shrink-0">
                    {track.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('ingestion')}
            className="w-full mt-3 py-2.5 px-4 bg-sahel-ink text-sahel-sand hover:bg-sahel-ochre hover:text-sahel-ink rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Ingest New Sound Recording</span>
          </button>
        </div>

        {/* Bento Item 3: Look-Back Recovery Engine (Spans 6 columns) */}
        <div className="md:col-span-6 bg-white/70 border border-black/5 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sahel-clay/10 text-sahel-clay">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-sahel-ink">Look-Back Recovery Engine</h3>
                  <p className="text-[11px] font-mono text-sahel-ink/60">Retroactive Black Box Unclaimed Scan</p>
                </div>
              </div>

              <button
                onClick={() => onSelectTab('lookback')}
                className="p-1.5 hover:bg-sahel-earth/30 rounded-lg text-sahel-ink/70 hover:text-sahel-ink transition-all cursor-pointer"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            {/* Legacy catalog claims */}
            <div className="space-y-2">
              {legacyItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white/80 border border-black/5 rounded-xl flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-serif font-bold text-xs text-sahel-ink">{item.legacyTitle}</p>
                    <p className="text-[10px] font-mono text-sahel-ink/60">
                      {item.originalArtist} ({item.releaseYear}) • Pool: ${item.estimatedUnclaimedRoyalty.toLocaleString()} USD
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                      item.claimStatus === 'Recovered'
                        ? 'bg-sahel-olive/20 text-sahel-olive'
                        : item.claimStatus === 'Scanning'
                        ? 'bg-sahel-ochre/20 text-sahel-ochre'
                        : 'bg-sahel-clay/20 text-sahel-clay'
                    }`}
                  >
                    {item.claimStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('lookback')}
            className="w-full mt-3 py-2.5 px-4 bg-sahel-clay text-white hover:bg-sahel-ink rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Search className="h-4 w-4" />
            <span>Open Black Box Scan Engine</span>
          </button>
        </div>

        {/* Bento Item 4: Micro-Licensing & Sync Portal (Spans 4 columns) */}
        <div className="md:col-span-4 bg-white/70 border border-black/5 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sahel-olive/10 text-sahel-olive">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-sahel-ink">Micro-Licensing</h3>
            </div>
            <button onClick={() => onSelectTab('licensing')} className="p-1 hover:bg-sahel-earth/30 rounded">
              <ArrowUpRight className="h-4 w-4 text-sahel-ink/60" />
            </button>
          </div>
          <p className="text-xs text-sahel-ink/70 leading-normal">
            Pre-cleared sync licensing catalog for gaming, film, podcasts, and global brand campaigns in the Hausa diaspora.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectTab('licensing')}
              className="w-full py-2 bg-sahel-earth/40 hover:bg-sahel-earth text-sahel-ink font-mono text-xs font-bold rounded-xl"
            >
              Explore Sync Licenses
            </button>
          </div>
        </div>

        {/* Bento Item 5: Shared Equity Lab (Spans 4 columns) */}
        <div className="md:col-span-4 bg-white/70 border border-black/5 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sahel-ochre/10 text-sahel-ochre">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-sahel-ink">Shared-Equity Lab</h3>
            </div>
            <button onClick={() => onSelectTab('equity')} className="p-1 hover:bg-sahel-earth/30 rounded">
              <ArrowUpRight className="h-4 w-4 text-sahel-ink/60" />
            </button>
          </div>
          <p className="text-xs text-sahel-ink/70 leading-normal">
            Recoupment split calculator & master ownership protection models tailored for independent Arewa producers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectTab('equity')}
              className="w-full py-2 bg-sahel-earth/40 hover:bg-sahel-earth text-sahel-ink font-mono text-xs font-bold rounded-xl"
            >
              Configure Equity Splits
            </button>
          </div>
        </div>

        {/* Bento Item 6: Fintech & Mobile Money (Spans 4 columns) */}
        <div className="md:col-span-4 bg-white/70 border border-black/5 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sahel-clay/10 text-sahel-clay">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-sahel-ink">Fintech Mobile Money</h3>
            </div>
            <button onClick={() => onSelectTab('fintech_sandbox')} className="p-1 hover:bg-sahel-earth/30 rounded">
              <ArrowUpRight className="h-4 w-4 text-sahel-ink/60" />
            </button>
          </div>
          <p className="text-xs text-sahel-ink/70 leading-normal">
            Direct instant micro-royalty payouts to MTN MoMo, Airtel Money, and eNaira wallets without standard bank friction.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectTab('fintech_sandbox')}
              className="w-full py-2 bg-sahel-clay text-white hover:bg-sahel-ink font-mono text-xs font-bold rounded-xl"
            >
              Launch Payout Console
            </button>
          </div>
        </div>

        {/* Bento Item 7: Sahel Incubator & API Sockets (Spans 12 columns) */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 border border-black/5 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-sahel-ochre" />
                <h3 className="font-serif font-bold text-sm text-sahel-ink">Sahel Incubator Roster</h3>
              </div>
              <button
                onClick={() => onSelectTab('incubator')}
                className="text-xs font-mono font-bold text-sahel-ochre hover:underline"
              >
                View Roster ({cohortArtists.length})
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cohortArtists.map((artist) => (
                <div key={artist.id} className="p-2.5 bg-white/80 border border-black/5 rounded-xl font-mono text-xs">
                  <p className="font-serif font-bold text-sahel-ink text-xs">{artist.stageName}</p>
                  <p className="text-[10px] text-sahel-ink/60">{artist.location}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sahel-ink text-sahel-sand rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-sahel-ochre" />
                <h3 className="font-serif font-bold text-sm text-white">PRO Socket Telemetry</h3>
              </div>
              <button
                onClick={() => onSelectTab('connections')}
                className="text-[10px] font-bold text-sahel-ochre hover:underline uppercase"
              >
                Console Logs
              </button>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between p-2 bg-white/5 rounded">
                <span>The MLC (Mechanical Ingest):</span>
                <span className="text-sahel-olive font-bold">CONNECTED (142ms)</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded">
                <span>SoundExchange DDEX SFTP:</span>
                <span className="text-sahel-olive font-bold">CONNECTED (210ms)</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded">
                <span>MTN MoMo Sandbox Gateway:</span>
                <span className="text-sahel-ochre font-bold">ACTIVE (98ms)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
