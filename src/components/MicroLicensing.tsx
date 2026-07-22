import React, { useState } from 'react';
import { TrackAsset } from '../types';
import { ShoppingBag, ShieldCheck, FileText, BadgeDollarSign, Download, Sparkles, Languages, Check, ArrowRight, Video } from 'lucide-react';

interface MicroLicensingProps {
  tracks: TrackAsset[];
  onAddLog: (log: string) => void;
}

export default function MicroLicensing({ tracks, onAddLog }: MicroLicensingProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0]?.id || '');
  const [useCase, setUseCase] = useState<'YouTube' | 'Indie Film' | 'TikTok' | 'Commercial Ad'>('YouTube');
  const [territory, setTerritory] = useState<'Regional West-Africa' | 'Sub-Sahelian' | 'Global'>('Regional West-Africa');
  const [exclusivity, setExclusivity] = useState<'Non-Exclusive' | 'Exclusive Limit (1 Year)'>('Non-Exclusive');
  
  const [isLicensed, setIsLicensed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [generatedLicenseId, setGeneratedLicenseId] = useState<string | null>(null);

  const selectedTrack = tracks.find(t => t.id === selectedTrackId);

  // Dynamic fee calculator
  const calculateLicenseFee = () => {
    let base = 50; // YouTube base fee
    if (useCase === 'Indie Film') base = 250;
    if (useCase === 'TikTok') base = 25;
    if (useCase === 'Commercial Ad') base = 800;

    if (territory === 'Sub-Sahelian') base *= 1.2;
    if (territory === 'Global') base *= 2.0;

    if (exclusivity === 'Exclusive Limit (1 Year)') base *= 3.5;

    return Math.floor(base);
  };

  const handleProcessPaymentAndLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrack) return;

    setIsProcessingPayment(true);
    onAddLog(`Initiating B2B micro-license transaction for track "${selectedTrack.master.recordingTitle}"...`);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsLicensed(true);
      const licId = `LIC-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedLicenseId(licId);
      onAddLog(`PAYMENT CAPTURED: Micro-license ${licId} issued. Standard 30% producer points split applied directly to Geekbeatz escrow ledger.`);
    }, 1500);
  };

  const handleResetLicense = () => {
    setIsLicensed(false);
    setGeneratedLicenseId(null);
  };

  const licenseFee = calculateLicenseFee();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="micro-licensing-module">
      {/* Configuration Form */}
      <div className="lg:col-span-7 bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-black/5 pb-2 mb-2">
          <ShoppingBag className="h-5 w-5 text-sahel-ochre" />
          <div>
            <h3 className="font-serif font-bold text-base text-sahel-ink italic">B2B Micro-Licensing Portal</h3>
            <p className="text-xs text-sahel-ink/60">Instant synchronized rights and pricing for global content creators</p>
          </div>
        </div>

        {isLicensed ? (
          <div className="bg-sahel-olive/10 border border-sahel-olive/20 rounded-lg p-5 text-center space-y-4">
            <div className="mx-auto h-12 w-12 bg-sahel-olive/20 text-sahel-olive rounded-full flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-sahel-olive italic">Micro-License Issued Successfully</h4>
              <p className="text-xs text-sahel-olive mt-1 font-mono">License ID: {generatedLicenseId}</p>
            </div>
            <p className="text-xs text-sahel-ink/70 max-w-md mx-auto leading-relaxed">
              Your royalty-free, synchronized synchronization license has been compiled with encrypted watermarked audio metadata tagging. Producer points and splits have been hard-routed to contributor accounts at source.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`Downloading License PDF file watermarked with Metadata JSON:\nTrack: ${selectedTrack?.master.recordingTitle}\nISRC: ${selectedTrack?.master.isrc}\nLicenseID: ${generatedLicenseId}\nTerritory: ${territory}`);
                }}
                className="bg-sahel-olive hover:bg-sahel-olive/85 text-white font-mono font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="h-4 w-4" /> Download Signed PDF License
              </button>
              <button
                onClick={handleResetLicense}
                className="bg-white border border-sahel-earth/60 text-sahel-ink hover:bg-sahel-sand/30 font-mono font-bold text-xs py-2 px-4 rounded-lg cursor-pointer transition-colors"
              >
                Configure New License
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProcessPaymentAndLicense} className="space-y-4">
            {/* Track Selector */}
            <div>
              <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Select Track Asset</label>
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="w-full text-xs border border-sahel-earth/60 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
              >
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.master.recordingTitle} — {track.master.primaryArtists.join(', ')} ({track.regionalTags.language})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Use Case */}
              <div>
                <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Project Use-Case</label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value as any)}
                  className="w-full text-xs border border-sahel-earth/60 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
                >
                  <option value="YouTube">YouTube Sync / Podcast</option>
                  <option value="TikTok">TikTok / IG Reels loop</option>
                  <option value="Indie Film">Independent Film Sync</option>
                  <option value="Commercial Ad">Commercial Ad Spot</option>
                </select>
              </div>

              {/* Territory */}
              <div>
                <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Territory / Scope</label>
                <select
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value as any)}
                  className="w-full text-xs border border-sahel-earth/60 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
                >
                  <option value="Regional West-Africa">West Africa</option>
                  <option value="Sub-Sahelian">Sub-Sahelian Zone</option>
                  <option value="Global">Global / Universal</option>
                </select>
              </div>

              {/* Exclusivity */}
              <div>
                <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Exclusivity Clause</label>
                <select
                  value={exclusivity}
                  onChange={(e) => setExclusivity(e.target.value as any)}
                  className="w-full text-xs border border-sahel-earth/60 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50"
                >
                  <option value="Non-Exclusive">Non-Exclusive Sync</option>
                  <option value="Exclusive Limit (1 Year)">Exclusive Limit (1 Year)</option>
                </select>
              </div>
            </div>

            {/* Price Preview Panel */}
            {selectedTrack && (
              <div className="bg-sahel-ochre/5 border border-sahel-ochre/15 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] font-mono text-sahel-ink/50 uppercase">License Quote</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-mono font-black text-sahel-ochre">${licenseFee}</span>
                    <span className="text-xs font-sans text-sahel-ink/70 font-semibold uppercase">USD / Flat Fee</span>
                  </div>
                  <p className="text-[10px] text-sahel-ink/50 font-mono leading-none mt-1">
                    *30% routed to Master Producer ({selectedTrack.master.masterProducer}) splits.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  id="checkout-license-btn"
                  className="w-full sm:w-auto bg-sahel-clay hover:bg-sahel-ochre text-white font-mono font-bold text-xs py-2.5 px-6 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isProcessingPayment ? 'Processing Safe Pay...' : 'Authorize Escrow Pay'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </form>
        )}

        <div className="bg-sahel-olive/5 border border-sahel-olive/10 rounded-lg p-3 text-xs text-sahel-olive leading-normal flex items-start gap-2">
          <Languages className="h-4 w-4 text-sahel-olive shrink-0 mt-0.5" />
          <p>
            <strong>Arewa Dialect Preservation</strong>: By securing regional sync licenses, KnewAfrikaan guarantees that Hausa/Fulfulde audio files retain their authentic metadata headers across regional networks and sub-Sahelian streaming pipelines.
          </p>
        </div>
      </div>

      {/* Contract Terms Draft Preview */}
      <div className="lg:col-span-5 bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 border-b border-black/5 pb-2 mb-3">
            <FileText className="h-5 w-5 text-sahel-clay" />
            <h3 className="font-serif font-bold text-sm text-sahel-ink italic">Digital Smart Contract Terms</h3>
          </div>

          {selectedTrack ? (
            <div className="space-y-4">
              <div className="bg-white/40 border border-black/5 rounded p-3 space-y-1.5 text-xs font-mono text-sahel-ink/70">
                <p className="font-bold text-sahel-ink text-[10px] uppercase border-b border-black/5 pb-1 flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" /> Synchronized Assets Specifications
                </p>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div>
                    <span className="text-sahel-ink/50">Track:</span>{' '}
                    <span className="font-bold text-sahel-ink">{selectedTrack.master.recordingTitle}</span>
                  </div>
                  <div>
                    <span className="text-sahel-ink/50">Artist:</span>{' '}
                    <span className="font-bold text-sahel-ink">{selectedTrack.master.primaryArtists.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-sahel-ink/50">ISRC:</span>{' '}
                    <span className="font-bold text-sahel-ink">{selectedTrack.master.isrc}</span>
                  </div>
                  <div>
                    <span className="text-sahel-ink/50">ISWC:</span>{' '}
                    <span className="font-bold text-sahel-ink">{selectedTrack.publishing.iswc}</span>
                  </div>
                  <div>
                    <span className="text-sahel-ink/50">Language:</span>{' '}
                    <span className="font-bold text-sahel-olive">{selectedTrack.regionalTags.language} ({selectedTrack.regionalTags.dialect})</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Contract terms display */}
              <div className="border border-black/5 rounded p-3 text-[10px] text-sahel-ink/70 font-mono bg-white/40 leading-relaxed max-h-56 overflow-y-auto space-y-2">
                <p className="font-semibold text-sahel-ink/95 uppercase">Standard Licensing Agreement</p>
                <p>
                  This synchronization license grants the licensee a non-transferable, {exclusivity.toLowerCase()} right to synchronize the audio recording entitled <strong>"{selectedTrack.master.recordingTitle}"</strong> within the scope of a <strong>{useCase}</strong> project.
                </p>
                <p>
                  <strong>Licensed Territory</strong>: {territory}.<br />
                  <strong>Usage Limits</strong>: Authorized for worldwide synchronized playback on digital video hubs.
                </p>
                <p>
                  <strong>Fintech Split Clause</strong>: This contract enforces the <strong>"Shared-Equity"</strong> payout sequence, directing {100 - selectedTrack.publishing.songwriters[1]?.shareSplit}% of master/sync payouts to performing creators and {selectedTrack.publishing.songwriters[1]?.shareSplit}% directly to the designated producer ({selectedTrack.master.masterProducer}) at source.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-sahel-ink/50 text-xs">
              Select a track to compile legal terms.
            </div>
          )}
        </div>

        {/* Encrypted watermark preview */}
        <div className="bg-sahel-earth/20 rounded-lg p-3 text-[10px] font-mono text-sahel-ink/70 border border-black/5">
          <span className="font-semibold text-sahel-ink/90 uppercase block mb-1">Embedded Metadata JSON Watermark:</span>
          <pre className="text-[9px] text-sahel-ink/50 truncate">
            {`{ "isrc": "${selectedTrack?.master.isrc || 'NG-K3A-... '}", "lic": "${generatedLicenseId || 'Pending'}", "ver": "KNEWAFRIKAAN-DRM-v2" }`}
          </pre>
        </div>
      </div>
    </div>
  );
}
