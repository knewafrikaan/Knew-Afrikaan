import React, { useState } from 'react';
import { TrackAsset, ContributorSplit, RegionalTags } from '../types';
import { Plus, Trash, Disc, FileText, CheckCircle, Clock, AlertTriangle, Languages, Radio, FileCheck, Sparkles } from 'lucide-react';

interface IngestionHubProps {
  tracks: TrackAsset[];
  onAddTrack: (track: TrackAsset) => void;
}

export default function IngestionHub({ tracks, onAddTrack }: IngestionHubProps) {
  // Form States
  const [recordingTitle, setRecordingTitle] = useState('');
  const [primaryArtists, setPrimaryArtists] = useState('');
  const [masterProducer, setMasterProducer] = useState('Geekbeatz');
  const [labelOwner, setLabelOwner] = useState('Arewa Frontier Ltd');
  const [format, setFormat] = useState<'Dolby Atmos' | 'Stereo WAV' | 'Stems'>('Dolby Atmos');
  const [fileSizeMb, setFileSizeMb] = useState('420');

  // Publishing Composition States
  const [compositionTitle, setCompositionTitle] = useState('');
  const [publisher, setPublisher] = useState('KnewAfrikaan Administration');

  // Regional/Dialect Indexing
  const [language, setLanguage] = useState('Hausa');
  const [dialect, setDialect] = useState('Arewa');
  const [region, setRegion] = useState('Jos');

  // Share Splits
  const [contributors, setContributors] = useState<ContributorSplit[]>([
    { name: 'Buba Barnabas (ClassiQ)', shareSplit: 60, role: 'Songwriter', ipi: '003482910', verified: true },
    { name: 'Geekbeatz', shareSplit: 40, role: 'Producer', ipi: '009841203', verified: true }
  ]);

  const [newContribName, setNewContribName] = useState('');
  const [newContribSplit, setNewContribSplit] = useState<number>(0);
  const [newContribRole, setNewContribRole] = useState<'Songwriter' | 'Composer' | 'Producer' | 'Arranger'>('Songwriter');
  const [newContribIpi, setNewContribIpi] = useState('');

  // Active expanded track ID
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>('TRK-001');

  // Notifications or errors
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Split management helpers
  const handleAddContributor = () => {
    if (!newContribName) {
      setFormError('Please enter a contributor name');
      return;
    }
    if (newContribSplit <= 0 || newContribSplit > 100) {
      setFormError('Split share must be between 1% and 100%');
      return;
    }

    const currentTotal = contributors.reduce((sum, c) => sum + c.shareSplit, 0);
    if (currentTotal + newContribSplit > 100) {
      setFormError(`Cannot exceed 100%. Remaining split available: ${100 - currentTotal}%`);
      return;
    }

    const newContrib: ContributorSplit = {
      name: newContribName,
      shareSplit: newContribSplit,
      role: newContribRole,
      ipi: newContribIpi || undefined,
      verified: true
    };

    setContributors([...contributors, newContrib]);
    setNewContribName('');
    setNewContribSplit(0);
    setNewContribIpi('');
    setFormError(null);
  };

  const handleRemoveContributor = (index: number) => {
    const updated = [...contributors];
    updated.splice(index, 1);
    setContributors(updated);
  };

  const totalSplit = contributors.reduce((sum, c) => sum + c.shareSplit, 0);

  // Generate randomized ISRC locally (following standard NG-K3A-26-XXXXX format)
  const generateLocalIsrc = () => {
    const randomSerial = Math.floor(10000 + Math.random() * 90000);
    return `NG-K3A-26-${randomSerial}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recordingTitle) {
      setFormError('Recording Title is required.');
      return;
    }
    if (!primaryArtists) {
      setFormError('At least one primary artist is required.');
      return;
    }
    if (totalSplit !== 100) {
      setFormError(`Publishing splits must equal exactly 100% (Current total: ${totalSplit}%)`);
      return;
    }

    const trackId = `TRK-${Math.floor(100 + Math.random() * 900)}`;
    const isrcCode = generateLocalIsrc();

    // Determine sync capability
    const status = 'Synced';
    const syncTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newTrack: TrackAsset = {
      id: trackId,
      status: status,
      master: {
        recordingTitle: recordingTitle,
        primaryArtists: primaryArtists.split(',').map(s => s.trim()),
        masterProducer: masterProducer,
        isrc: isrcCode,
        labelOwner: labelOwner,
        format: format,
        fileSize: `${fileSizeMb} MB`,
        ingestionDate: new Date().toISOString().split('T')[0],
      },
      publishing: {
        compositionTitle: compositionTitle || `${recordingTitle} Composition`,
        songwriters: contributors,
        publisher: publisher,
        iswc: 'Pending Callback',
        registrationStatus: 'Pending',
        shareSplitsApproved: true,
      },
      regionalTags: {
        language,
        dialect: dialect || undefined,
        region,
      },
      solarSync: {
        synced: true,
        syncTimestamp: syncTimestamp,
        cachedLocally: false,
        queuePriority: 'High',
      }
    };

    onAddTrack(newTrack);
    setExpandedTrackId(trackId);

    // Reset Form
    setRecordingTitle('');
    setCompositionTitle('');
    setPrimaryArtists('');
    setFormError(null);
    setNotification(`Successfully registered master! Local ISRC generated: ${isrcCode}.`);

    // Trigger an asynchronous CWR-based PRO callback to assign ISWC!
    setTimeout(() => {
      // Find track and update ISWC
      const randomIswcSerial = Math.floor(100000000 + Math.random() * 900000000);
      const iswcCode = `T-${randomIswcSerial.toString().substring(0, 3)}.${randomIswcSerial.toString().substring(3, 6)}.${randomIswcSerial.toString().substring(6, 9)}-${Math.floor(Math.random() * 9)}`;
      
      // We mutate the state through the parent trigger
      newTrack.publishing.iswc = iswcCode;
      newTrack.publishing.registrationStatus = 'Registered';
      newTrack.status = 'Fully Registered';

      setNotification(`ASYNCHRONOUS CALLBACK RECEIVED: ISWC registry confirmed for "${newTrack.master.recordingTitle}" with code ${iswcCode}.`);
    }, 4500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ingestion-hub-module">
      {/* Form Section */}
      <div className="lg:col-span-5 bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/5">
          <div>
            <h3 className="font-serif font-bold text-base text-sahel-ink flex items-center gap-1.5 italic">
              <Plus className="h-5 w-5 text-sahel-clay" /> Ingest New Asset
            </h3>
            <p className="text-xs text-sahel-ink/60">Bifurcated Master & Publishing Registrations</p>
          </div>
          <span className="text-[10px] font-mono uppercase bg-sahel-ochre/10 text-sahel-ochre border border-sahel-ochre/20 px-2 py-0.5 rounded font-bold">
            DDEX / CWR Ready
          </span>
        </div>

        {formError && (
          <div className="mb-4 bg-sahel-clay/10 border border-sahel-clay/20 text-sahel-clay text-xs rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-sahel-clay" />
            <p className="font-medium">{formError}</p>
          </div>
        )}

        {notification && (
          <div className="mb-4 bg-sahel-olive/10 border border-sahel-olive/20 text-sahel-olive text-xs rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-sahel-olive animate-bounce" />
            <p className="font-medium leading-normal">{notification}</p>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Master Layer */}
          <div className="space-y-3">
            <div className="bg-white/40 border border-black/5 rounded-lg p-3.5 space-y-3">
              <h4 className="text-xs font-mono font-bold text-sahel-ochre uppercase flex items-center gap-1">
                <Disc className="h-3.5 w-3.5 text-sahel-ochre" /> Sound Recording (Master)
              </h4>

              <div>
                <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Recording Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Arewa Pride"
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  className="w-full text-xs border border-sahel-earth/60 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Primary Artist(s)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., ClassiQ, FXNGZ"
                    value={primaryArtists}
                    onChange={(e) => setPrimaryArtists(e.target.value)}
                    className="w-full text-xs border border-sahel-earth/60 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
                  />
                  <span className="text-[9px] text-sahel-ink/50 font-mono">Comma separated</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Master Producer</label>
                  <input
                    type="text"
                    required
                    value={masterProducer}
                    onChange={(e) => setMasterProducer(e.target.value)}
                    className="w-full text-xs border border-sahel-earth/60 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
                  />
                  <span className="text-[9px] text-sahel-ink/50 font-mono">Defaults to Geekbeatz</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Label / Owner</label>
                  <input
                    type="text"
                    required
                    value={labelOwner}
                    onChange={(e) => setLabelOwner(e.target.value)}
                    className="w-full text-xs border border-sahel-earth/60 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full text-xs border border-sahel-earth/60 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
                  >
                    <option value="Dolby Atmos">Dolby Atmos</option>
                    <option value="Stereo WAV">Stereo WAV</option>
                    <option value="Stems">Stems</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-black/5">
                <div>
                  <label className="block text-[11px] font-semibold text-sahel-ink/60 mb-0.5">Atmos File Size</label>
                  <input
                    type="number"
                    value={fileSizeMb}
                    onChange={(e) => setFileSizeMb(e.target.value)}
                    className="w-full text-xs border border-sahel-earth/60 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
                  />
                  <span className="text-[9px] text-sahel-ink/50 font-mono">MB (Dolby Atmos format)</span>
                </div>
                <div className="bg-sahel-earth/30 rounded p-2 flex flex-col justify-center">
                  <span className="text-[10px] font-mono text-sahel-ink/60 leading-none">ISRC GENERATED:</span>
                  <span className="text-xs font-mono font-bold text-sahel-ink tracking-wider mt-1">NG-K3A-26-XXXXX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Nuance Tags */}
          <div className="bg-sahel-olive/5 border border-sahel-olive/10 rounded-lg p-3.5 space-y-2">
            <h4 className="text-xs font-mono font-bold text-sahel-olive uppercase flex items-center gap-1">
              <Languages className="h-3.5 w-3.5 text-sahel-olive" /> Regional Indexing (Linguistic Nuances)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-sahel-ink/70 mb-1">Language Tag</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-xs border border-sahel-earth/60 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-sahel-olive bg-white/50"
                >
                  <option value="Hausa">Hausa</option>
                  <option value="Yoruba">Yoruba</option>
                  <option value="Pidgin">Pidgin</option>
                  <option value="Igbo">Igbo</option>
                  <option value="Fulfulde">Fulfulde</option>
                  <option value="Kanuri">Kanuri</option>
                  <option value="Tamasheq">Tamasheq</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-sahel-ink/70 mb-1">Linguistic Dialect</label>
                <input
                  type="text"
                  placeholder="e.g., Kano / Sokoto"
                  value={dialect}
                  onChange={(e) => setDialect(e.target.value)}
                  className="w-full text-xs border border-sahel-earth/60 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-sahel-olive bg-white/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-sahel-ink/70 mb-1">State / Province</label>
                <input
                  type="text"
                  placeholder="e.g., Jos / Kano"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full text-xs border border-sahel-earth/60 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-sahel-olive bg-white/50"
                />
              </div>
            </div>
            <p className="text-[9px] text-sahel-ink/50 font-mono italic">
              *Enables voice-search & discovery optimization in Sahelian region, mitigating orphan index catalog loss.
            </p>
          </div>

          {/* Publishing Layer */}
          <div className="bg-white/40 border border-black/5 rounded-lg p-3.5 space-y-3">
            <h4 className="text-xs font-mono font-bold text-sahel-clay uppercase flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-sahel-clay" /> Musical Work (Publishing Composition)
            </h4>

            <div>
              <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Composition/Lyrics Title</label>
              <input
                type="text"
                placeholder="Composition (Leave blank to match track)"
                value={compositionTitle}
                onChange={(e) => setCompositionTitle(e.target.value)}
                className="w-full text-xs border border-sahel-earth/60 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-clay bg-white/50"
              />
            </div>

            {/* Split Sheets list */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-sahel-ink/80">Contributor Share Splits</label>
              <div className="border border-black/5 rounded bg-white/40 p-2 space-y-1 max-h-32 overflow-y-auto">
                {contributors.map((contrib, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-black/5 last:border-b-0">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sahel-ink">{contrib.name}</span>
                      <span className="text-[9px] text-sahel-ink/50 font-mono">{contrib.role} {contrib.ipi ? `| IPI: ${contrib.ipi}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-sahel-clay/10 text-sahel-clay font-bold px-1.5 py-0.5 rounded text-[11px]">
                        {contrib.shareSplit}%
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveContributor(idx)}
                        className="text-sahel-clay hover:text-sahel-ink cursor-pointer transition-colors"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add contributor line */}
              <div className="grid grid-cols-12 gap-1 bg-sahel-earth/30 p-2 rounded">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContribName}
                  onChange={(e) => setNewContribName(e.target.value)}
                  className="col-span-5 text-[10px] border border-sahel-earth/60 rounded bg-white/80 px-1.5 py-1"
                />
                <input
                  type="number"
                  placeholder="%"
                  value={newContribSplit || ''}
                  onChange={(e) => setNewContribSplit(parseInt(e.target.value) || 0)}
                  className="col-span-2 text-[10px] border border-sahel-earth/60 rounded bg-white/80 px-1 py-1 font-mono text-center"
                />
                <select
                  value={newContribRole}
                  onChange={(e) => setNewContribRole(e.target.value as any)}
                  className="col-span-3 text-[9px] border border-sahel-earth/60 rounded bg-white/80 p-1"
                >
                  <option value="Songwriter">Lyricist</option>
                  <option value="Composer">Composer</option>
                  <option value="Producer">Producer</option>
                  <option value="Arranger">Arranger</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddContributor}
                  className="col-span-2 bg-sahel-ink text-sahel-sand rounded text-[10px] font-bold flex items-center justify-center cursor-pointer hover:bg-sahel-clay transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Share split progress / visual helper */}
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span>Total Allocated Split:</span>
                <span className={`font-bold ${totalSplit === 100 ? 'text-sahel-olive' : 'text-sahel-clay'}`}>
                  {totalSplit}% / 100%
                </span>
              </div>
              <div className="w-full bg-sahel-earth/40 h-1.5 rounded overflow-hidden">
                <div
                  className={`h-full ${totalSplit === 100 ? 'bg-sahel-olive' : 'bg-sahel-clay animate-pulse'}`}
                  style={{ width: `${totalSplit}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            id="register-metadata-submit"
            className="w-full bg-sahel-clay text-white py-2.5 rounded-lg text-xs font-serif font-bold hover:bg-sahel-ochre transition-colors cursor-pointer flex items-center justify-center gap-1.5 italic"
          >
            <Radio className="h-4 w-4" />
            Finalize Metadata & Ingest
          </button>
        </form>
      </div>

      {/* Catalog & Ingestion Buffer View */}
      <div className="lg:col-span-7 bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-4 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between border-b border-black/5 pb-2">
          <div>
            <h3 className="font-serif font-bold text-base text-sahel-ink italic">Ingested Catalog Ledger</h3>
            <p className="text-xs text-sahel-ink/60">Verifiable Sound Recordings and Associated Split composition registers</p>
          </div>
          <span className="text-xs font-mono bg-sahel-earth/50 text-sahel-ink px-2.5 py-1 rounded-full font-bold">
            {tracks.length} Ingested
          </span>
        </div>

        {/* Tracks List */}
        <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1 flex-1">
          {tracks.map((track) => {
            const isExpanded = expandedTrackId === track.id;

            return (
              <div
                key={track.id}
                id={`track-item-${track.id.toLowerCase()}`}
                className={`border rounded-xl transition-all ${
                  isExpanded
                    ? 'border-sahel-earth bg-white/50 shadow-sm'
                    : 'border-black/5 hover:border-sahel-earth/60 hover:bg-white/30'
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedTrackId(isExpanded ? null : track.id)}
                  className="w-full text-left p-4 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sahel-ochre/10 rounded-lg text-sahel-ochre border border-sahel-ochre/20">
                      <Disc className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-sahel-ink">{track.master.recordingTitle}</h4>
                      <p className="text-xs text-sahel-ink/70">
                        {track.master.primaryArtists.join(', ')} <span className="text-[10px] text-sahel-ink/50 font-mono">• Produced by {track.master.masterProducer}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Dialect tag badge */}
                    <span className="text-[10px] font-mono bg-sahel-olive/10 text-sahel-olive border border-sahel-olive/20 px-2 py-0.5 rounded font-semibold">
                      {track.regionalTags.language} ({track.regionalTags.dialect})
                    </span>

                    {/* Registry Status Badge */}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                      track.status === 'Fully Registered'
                        ? 'bg-sahel-olive/10 text-sahel-olive border-sahel-olive/20'
                        : track.status === 'Synced'
                        ? 'bg-sahel-ochre/10 text-sahel-ochre border-sahel-ochre/20'
                        : track.status === 'CWR Generated'
                        ? 'bg-sahel-clay/10 text-sahel-clay border-sahel-clay/20'
                        : 'bg-sahel-earth text-sahel-ink/80 border-black/10 animate-pulse'
                    }`}>
                      {track.status === 'Fully Registered' ? 'Fully Registered' : track.status}
                    </span>
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="p-4 border-t border-black/5 bg-white/40 rounded-b-xl space-y-4">
                    {/* Ingestion Specs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs border-b border-black/5 pb-3">
                      <div>
                        <span className="text-sahel-ink/50 block font-mono text-[9px] uppercase">Registered ID</span>
                        <span className="font-mono font-bold text-sahel-ink">{track.id}</span>
                      </div>
                      <div>
                        <span className="text-sahel-ink/50 block font-mono text-[9px] uppercase">File Type/Size</span>
                        <span className="font-mono font-bold text-sahel-ink/80">{track.master.format} ({track.master.fileSize})</span>
                      </div>
                      <div>
                        <span className="text-sahel-ink/50 block font-mono text-[9px] uppercase">Ingestion Hub</span>
                        <span className="font-sans font-bold text-sahel-ink/80">{track.regionalTags.region} Studio Hub</span>
                      </div>
                      <div>
                        <span className="text-sahel-ink/50 block font-mono text-[9px] uppercase">Date Ingested</span>
                        <span className="font-mono text-sahel-ink/70">{track.master.ingestionDate}</span>
                      </div>
                    </div>

                    {/* Master vs. Publishing Bifurcated View */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Master Recording Box */}
                      <div className="bg-sahel-ochre/5 border border-sahel-ochre/15 rounded-lg p-3">
                        <span className="text-[10px] font-mono font-bold text-sahel-ochre block border-b border-sahel-ochre/10 pb-1.5 mb-2 uppercase flex items-center gap-1.5">
                          <FileCheck className="h-3.5 w-3.5 text-sahel-ochre" /> DDEX Master Rights Layer
                        </span>
                        <ul className="space-y-1 text-xs">
                          <li className="flex justify-between">
                            <span className="text-sahel-ink/50">ISRC Code:</span>
                            <span className="font-mono font-bold text-sahel-ink">{track.master.isrc}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sahel-ink/50">Owner Label:</span>
                            <span className="font-medium text-sahel-ink">{track.master.labelOwner}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sahel-ink/50">Linguistic Tag:</span>
                            <span className="font-mono text-sahel-ink/80">{track.regionalTags.language} - Dialect: {track.regionalTags.dialect || 'None'}</span>
                          </li>
                        </ul>
                      </div>

                      {/* Publishing Composition Box */}
                      <div className="bg-sahel-clay/5 border border-sahel-clay/15 rounded-lg p-3">
                        <span className="text-[10px] font-mono font-bold text-sahel-clay block border-b border-sahel-clay/10 pb-1.5 mb-2 uppercase flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-sahel-clay" /> CWR Publishing Rights Layer
                        </span>
                        <ul className="space-y-1 text-xs">
                          <li className="flex justify-between">
                            <span className="text-sahel-ink/50">Composition:</span>
                            <span className="font-semibold text-sahel-ink truncate max-w-[120px]">{track.publishing.compositionTitle}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sahel-ink/50">ISWC Code:</span>
                            <span className={`font-mono font-bold ${track.publishing.iswc === 'Pending Callback' ? 'text-sahel-ochre animate-pulse' : 'text-sahel-ink'}`}>
                              {track.publishing.iswc}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sahel-ink/50">PRO Publisher:</span>
                            <span className="font-medium text-sahel-ink text-[11px] truncate max-w-[140px]">{track.publishing.publisher}</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Contributor Splits Breakdown visual panel */}
                    <div className="bg-white/40 border border-black/5 rounded-lg p-3">
                      <span className="text-[10px] font-mono font-bold text-sahel-clay block mb-2 uppercase">
                        Composer / Songwriter Split Shares (%)
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {track.publishing.songwriters.map((songwriter, index) => (
                          <div key={index} className="bg-white/80 border border-black/5 rounded p-2 text-center">
                            <p className="text-[11px] font-bold text-sahel-ink truncate">{songwriter.name}</p>
                            <p className="text-[9px] text-sahel-ink/50 font-mono">{songwriter.role}</p>
                            <p className="text-base font-mono font-black text-sahel-ochre mt-1">{songwriter.shareSplit}%</p>
                            <div className="mt-1 flex items-center justify-center gap-1 text-[9px] font-mono text-sahel-ink/50">
                              <span className={`h-1.5 w-1.5 rounded-full ${songwriter.verified ? 'bg-sahel-olive' : 'bg-sahel-earth'}`}></span>
                              {songwriter.ipi ? `IPI: ${songwriter.ipi}` : 'No IPI'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sync telemetry prompt */}
        <div className="bg-white/40 border border-black/5 rounded-xl p-3 flex items-center gap-3">
          <Clock className="h-5 w-5 text-sahel-earth shrink-0" />
          <p className="text-xs text-sahel-ink/70 leading-normal">
            <strong>PRO Registration Notice</strong>: Generating metadata conforms to <strong>DDEX XML</strong> standards for delivery directly to regional digital service providers (DSPs) in West and Sahelian Africa, and outputs standard <strong>CWR</strong> registers.
          </p>
        </div>
      </div>
    </div>
  );
}
