import React, { useState } from 'react';
import { TrackAsset, LearningModule, CohortArtist } from '../types';
import { GraduationCap, Award, ShieldAlert, CheckCircle2, ListFilter, Users, Banknote, Landmark, BookOpen, Layers } from 'lucide-react';

interface IncubatorPortalProps {
  tracks: TrackAsset[];
  learningModules: LearningModule[];
  cohortArtists: CohortArtist[];
  currentRole: string;
  onUpdateCohortArtist: (artist: CohortArtist) => void;
  onAddLog: (log: string) => void;
}

export default function IncubatorPortal({
  tracks,
  learningModules,
  cohortArtists,
  currentRole,
  onUpdateCohortArtist,
  onAddLog,
}: IncubatorPortalProps) {
  const [activeTab, setActiveTab] = useState<'learning' | 'assets' | 'admin'>('learning');
  const [modules, setModules] = useState<LearningModule[]>(learningModules);

  // Toggle module completion to show interactive progress
  const handleToggleModule = (modId: string) => {
    const updated = modules.map((m) => {
      if (m.id === modId) {
        const nextCompleted = !m.completed;
        const score = nextCompleted ? Math.floor(80 + Math.random() * 20) : undefined;
        onAddLog(`Learning milestone update: "${m.title}" marked as ${nextCompleted ? 'Completed' : 'Pending'}.`);
        return { ...m, completed: nextCompleted, score };
      }
      return m;
    });
    setModules(updated);
  };

  const handleApprovePayout = (artistId: string) => {
    const artist = cohortArtists.find((a) => a.id === artistId);
    if (!artist) return;

    const updated: CohortArtist = {
      ...artist,
      payoutStatus: 'Up-to-Date',
      totalRoyaltiesRecovered: artist.totalRoyaltiesRecovered + artist.pendingPayoutAmount,
      pendingPayoutAmount: 0,
    };
    onUpdateCohortArtist(updated);
    onAddLog(`ADMIN ACTION: Bello Idris approved payout of $${artist.pendingPayoutAmount.toLocaleString()} to ${artist.stageName} (${artist.name}). Funds released.`);
  };

  const completedCount = modules.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);

  return (
    <div className="bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-5" id="incubator-portal-module">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-black/5 pb-4">
        <div>
          <h3 className="font-serif font-bold text-base text-sahel-ink flex items-center gap-1.5 italic">
            <GraduationCap className="h-5 w-5 text-sahel-ochre" /> Sahel Beats Incubator Program
          </h3>
          <p className="text-xs text-sahel-ink/60">Professionalizing the sub-Sahelian creative workforce (Annual Cohort of 50+)</p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex bg-sahel-earth/30 p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('learning')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'learning' ? 'bg-sahel-ink text-sahel-sand' : 'text-sahel-ink/60 hover:text-sahel-ink'
            }`}
          >
            Learning Track
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'assets' ? 'bg-sahel-ink text-sahel-sand' : 'text-sahel-ink/60 hover:text-sahel-ink'
            }`}
          >
            IP Assets
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'admin' ? 'bg-sahel-ink text-sahel-sand' : 'text-sahel-ink/60 hover:text-sahel-ink'
            }`}
          >
            Admin Panel (Bello Idris)
          </button>
        </div>
      </div>

      {/* 1. Creative Professional Learning Dashboard Tab */}
      {activeTab === 'learning' && (
        <div className="space-y-4">
          <div className="bg-sahel-ochre/5 border border-sahel-ochre/15 rounded-lg p-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono text-sahel-ink/50 uppercase">Interactive Digital Literacy</span>
              <h4 className="font-serif font-bold text-sahel-ink text-sm italic">Creative Professional Educational Progress</h4>
              <p className="text-xs text-sahel-ink/60">Curriculum for Artists, Producers, Managers, Writers & Audio Engineers in Intellectual Property, Metadata, Digital Mastering, & Recoupment Finance</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-black text-sahel-ochre">{progressPercent}%</span>
              <span className="block text-[10px] text-sahel-ink/50 font-mono">Completed ({completedCount}/{modules.length})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod) => (
              <div
                key={mod.id}
                id={`module-item-${mod.id.toLowerCase()}`}
                className={`border rounded-lg p-4 space-y-2 transition-all ${
                  mod.completed ? 'border-sahel-olive/20 bg-sahel-olive/5' : 'border-black/5 bg-white/40 hover:border-sahel-earth'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono bg-sahel-ochre/10 text-sahel-ochre px-1.5 py-0.5 rounded font-bold uppercase">
                      {mod.category}
                    </span>
                    <h5 className="font-serif font-semibold text-xs text-sahel-ink mt-1.5 leading-tight">{mod.title}</h5>
                  </div>
                  <input
                    type="checkbox"
                    checked={mod.completed}
                    onChange={() => handleToggleModule(mod.id)}
                    className="rounded border-sahel-earth/60 text-sahel-olive focus:ring-sahel-olive h-4.5 w-4.5 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-sahel-ink/70 leading-normal">{mod.description}</p>
                <div className="pt-2 border-t border-dashed border-black/5 flex justify-between text-[10px] font-mono text-sahel-ink/50">
                  <span>Duration: {mod.durationMinutes} mins</span>
                  {mod.completed && mod.score && (
                    <span className="text-sahel-olive font-semibold flex items-center gap-0.5">
                      <Award className="h-3 w-3" /> Score: {mod.score}% (Passed)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Simplified IP Asset Portfolio View */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="bg-white/40 border border-black/5 rounded-lg p-4">
            <h4 className="font-serif font-bold text-sm text-sahel-ink italic">Current IP Portfolio Ledger</h4>
            <p className="text-xs text-sahel-ink/60 mt-0.5">Summary of assigned codes ready for global Society (PRO) claiming</p>
          </div>

          <div className="border border-black/5 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sahel-earth/20 border-b border-black/5 font-mono text-sahel-ink/60 text-[10px] uppercase">
                  <th className="p-3">Track Name</th>
                  <th className="p-3">ISRC Code</th>
                  <th className="p-3">ISWC Code</th>
                  <th className="p-3">Linguistic Nuance</th>
                  <th className="p-3">Society Pipeline Status</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track) => (
                  <tr key={track.id} className="border-b border-black/5 last:border-b-0 hover:bg-white/35">
                    <td className="p-3 font-semibold text-sahel-ink">{track.master.recordingTitle}</td>
                    <td className="p-3 font-mono text-sahel-ink/70">{track.master.isrc}</td>
                    <td className="p-3 font-mono">
                      <span className={track.publishing.iswc === 'Pending Callback' ? 'text-sahel-ochre animate-pulse font-bold' : 'text-sahel-ink font-medium'}>
                        {track.publishing.iswc}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-sahel-olive/10 text-sahel-olive border border-sahel-olive/20 px-2 py-0.5 rounded font-mono text-[10px]">
                        {track.regionalTags.language} ({track.regionalTags.dialect})
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 font-mono text-[10px] font-semibold ${
                        track.status === 'Fully Registered' ? 'text-sahel-olive' : 'text-sahel-ochre'
                      }`}>
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        {track.status === 'Fully Registered' ? 'Registered with PROs' : 'Ingestion Sync Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Administrator Oversight Panel Tab (Bello Idris) */}
      {activeTab === 'admin' && (
        <div className="space-y-4">
          <div className="bg-sahel-clay/5 border border-sahel-clay/20 text-sahel-ink/90 rounded-lg p-4 space-y-2">
            <h4 className="font-serif font-bold text-sm text-sahel-clay flex items-center gap-1.5 italic">
              <Landmark className="h-4.5 w-4.5" /> Rights Administrator Dashboard
            </h4>
            <p className="text-xs text-sahel-ink/75 leading-normal">
              Logged in as <strong>Bello Idris</strong>. You have administrative access to track cohort learning milestones, approve royalty distribution payouts, and monitor regional catalog uploads.
            </p>
          </div>

          <div className="border border-black/5 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sahel-earth/20 border-b border-black/5 font-mono text-sahel-ink/60 text-[10px] uppercase">
                  <th className="p-3">Creative Name / Role</th>
                  <th className="p-3">Location</th>
                  <th className="p-3 text-center">Milestones</th>
                  <th className="p-3 text-center">Ingested Tracks</th>
                  <th className="p-3 text-right">Recovered Royalty</th>
                  <th className="p-3 text-right">Pending Payout</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cohortArtists.map((artist) => (
                  <tr key={artist.id} className="border-b border-black/5 last:border-b-0 hover:bg-white/35">
                    <td className="p-3">
                      <div className="font-bold text-sahel-ink">{artist.stageName}</div>
                      <div className="text-[10px] text-sahel-ink/50 font-mono">{artist.name}</div>
                    </td>
                    <td className="p-3 font-mono text-sahel-ink/70">{artist.location}</td>
                    <td className="p-3 text-center font-semibold text-sahel-ink/80">
                      <span className="bg-sahel-ochre/10 border border-sahel-ochre/20 px-2 py-0.5 rounded font-mono text-[11px]">
                        {artist.milestonesCompleted} / 4
                      </span>
                    </td>
                    <td className="p-3 text-center font-semibold text-sahel-ink/80 font-mono">{artist.totalRegisteredTracks}</td>
                    <td className="p-3 text-right font-mono font-bold text-sahel-olive">${artist.totalRoyaltiesRecovered.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-bold text-sahel-ochre">
                      {artist.pendingPayoutAmount > 0 ? `$${artist.pendingPayoutAmount.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-3 text-center">
                      {artist.pendingPayoutAmount > 0 ? (
                        <button
                          onClick={() => handleApprovePayout(artist.id)}
                          className="bg-sahel-clay text-white hover:bg-sahel-olive transition-colors font-mono font-bold text-[10px] py-1 px-2.5 rounded cursor-pointer"
                        >
                          Approve Payout
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-sahel-ink/50 flex items-center justify-center gap-0.5">
                          <CheckCircle2 className="h-3 w-3 text-sahel-olive" /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
