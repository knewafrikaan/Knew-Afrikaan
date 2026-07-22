import React, { useState } from 'react';
import { LegacyCatalogItem } from '../types';
import { Search, Loader2, Sparkles, Check, FileCheck, ShieldAlert, FileText, UserCheck, CheckCircle2, Signature, HelpCircle, Download } from 'lucide-react';

interface LookBackEngineProps {
  legacyItems: LegacyCatalogItem[];
  onUpdateLegacyItem: (item: LegacyCatalogItem) => void;
  onAddLog: (log: string) => void;
}

export default function LookBackEngine({ legacyItems, onUpdateLegacyItem, onAddLog }: LookBackEngineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<LegacyCatalogItem[]>(legacyItems);
  const [activeItemForLod, setActiveItemForLod] = useState<LegacyCatalogItem | null>(null);
  
  // Digitally sign states
  const [signName, setSignName] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [lodSignedResult, setLodSignedResult] = useState<string | null>(null);

  // Scan function simulates querying Black Box databases
  const handleDatabaseScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    onAddLog(`Starting look-back search for "${searchQuery}" in SoundExchange, The MLC, and MCSN registries...`);

    setTimeout(() => {
      setIsScanning(false);
      // Filter based on search query
      const filtered = legacyItems.filter(item => 
        item.legacyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originalArtist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setScanResults(filtered);
      onAddLog(`Scan complete. Found ${filtered.length} legacy assets with potential orphaned black-box royalties.`);
    }, 1500);
  };

  const handleRetrofitIsrc = (itemId: string) => {
    const item = legacyItems.find(i => i.id === itemId);
    if (!item) return;

    const retrofittedIsrc = `NG-K3A-26-R${Math.floor(10000 + Math.random() * 90000)}`;
    const updated: LegacyCatalogItem = {
      ...item,
      legacyIsrc: retrofittedIsrc,
      claimStatus: item.claimStatus === 'Unclaimed' ? 'LOD_Required' : item.claimStatus,
    };
    onUpdateLegacyItem(updated);
    
    // Update local state too
    setScanResults(prev => prev.map(i => i.id === itemId ? updated : i));
    onAddLog(`Metadata Retrofitted: Assigned brand new ISRC ${retrofittedIsrc} to legacy work "${item.legacyTitle}".`);
  };

  const handleTriggerClaim = (item: LegacyCatalogItem) => {
    setActiveItemForLod(item);
    setSignName('');
    setLodSignedResult(null);
  };

  const handleSignLod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItemForLod || !signName) return;

    setIsSigning(true);
    onAddLog(`Generating legally automated Letter of Direction (LOD) for "${activeItemForLod.legacyTitle}"...`);

    setTimeout(() => {
      setIsSigning(false);
      const updated: LegacyCatalogItem = {
        ...activeItemForLod,
        claimStatus: 'LOD_Signed',
        lodDocumentUrl: `LOD-${activeItemForLod.id}-SIGNED`,
      };
      
      onUpdateLegacyItem(updated);
      setScanResults(prev => prev.map(i => i.id === activeItemForLod.id ? updated : i));
      setLodSignedResult(`LOD Successfully Signed! Document generated: LOD-${activeItemForLod.id}-SIGNED.pdf`);
      onAddLog(`Letter of Direction signed by ${signName}. Initiating claim push to The MLC & SoundExchange.`);

      // Simulated auto-submission of claim
      setTimeout(() => {
        const fullyClaimed: LegacyCatalogItem = {
          ...updated,
          claimStatus: 'Submitted',
        };
        onUpdateLegacyItem(fullyClaimed);
        setScanResults(prev => prev.map(i => i.id === activeItemForLod.id ? fullyClaimed : i));
        onAddLog(`CLAIM SUCCESS: Verified metadata for "${activeItemForLod.legacyTitle}" has been transmitted to MLC, SoundExchange, and Songtrust. Claim status: Submitted.`);
      }, 3000);

    }, 2000);
  };

  const handleApproveContributorSplit = (itemId: string, contributorName: string) => {
    const item = legacyItems.find(i => i.id === itemId);
    if (!item) return;

    const updatedContributors = item.contributors.map(c => 
      c.name === contributorName ? { ...c, approved: true } : c
    );

    // If all contributors are approved, fix conflicts
    const allApproved = updatedContributors.every(c => c.approved);
    const updatedStatus = allApproved ? 'LOD_Required' : item.claimStatus;

    const updated: LegacyCatalogItem = {
      ...item,
      contributors: updatedContributors,
      claimStatus: updatedStatus as any
    };

    onUpdateLegacyItem(updated);
    setScanResults(prev => prev.map(i => i.id === itemId ? updated : i));
    onAddLog(`Contributor split approved by ${contributorName} on legacy track "${item.legacyTitle}".`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="look-back-engine-module">
      {/* Scanning and Ingestion Panel */}
      <div className="lg:col-span-8 space-y-4">
        {/* Search Engine Header */}
        <div className="bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-sahel-ochre" />
            <h3 className="font-serif font-bold text-base text-sahel-ink italic">Orphaned Black-Box Scanning Engine</h3>
          </div>
          <p className="text-xs text-sahel-ink/70 mb-4 leading-relaxed">
            Unlogged regional releases enter the global digital economy without embedded ISRC/ISWC codes, creating orphaned funds in SoundExchange, MLC, and Songtrust "Black Box" accounts. Scan by keyword (Hausa titles, artist aliases) to audit unclaimed wealth.
          </p>

          <form onSubmit={handleDatabaseScan} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-sahel-ink/40" />
              <input
                type="text"
                placeholder="Search legacy Arewa titles or artists (e.g. ClassiQ, Zauna, Gombe)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-white/40 border border-sahel-earth/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-sahel-ochre"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              id="start-blackbox-scan"
              className="bg-sahel-clay text-white hover:bg-sahel-ochre transition-colors font-mono font-bold text-xs py-2 px-4 rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {isScanning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              {isScanning ? 'Querying PRO Databases...' : 'Scan Black Box'}
            </button>
          </form>
        </div>

        {/* Scan Results Ledger */}
        <div className="bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5">
            <div>
              <h4 className="font-serif font-bold text-sm text-sahel-ink">Historical Catalog Audits</h4>
              <p className="text-[11px] text-sahel-ink/60 font-mono">Claims matching regional keyword indices</p>
            </div>
            <span className="text-[10px] font-mono bg-sahel-ochre/10 text-sahel-ochre border border-sahel-ochre/20 px-2 py-0.5 rounded font-bold">
              Verification Engine
            </span>
          </div>

          <div className="space-y-4">
            {scanResults.length === 0 ? (
              <div className="text-center py-8 text-sahel-ink/50 text-xs">
                No matching legacy items found. Try scanning "ClassiQ" or "Ba Damuwa" to audit historical records.
              </div>
            ) : (
              scanResults.map((item) => {
                const needsIsrc = !item.legacyIsrc;
                const hasConflict = item.claimStatus === 'Conflict';
                const isClaimable = item.legacyIsrc && !hasConflict && ['Unclaimed', 'LOD_Required'].includes(item.claimStatus);

                return (
                  <div
                    key={item.id}
                    id={`legacy-item-${item.id.toLowerCase()}`}
                    className="border border-sahel-earth/30 bg-white/40 rounded-lg p-4 space-y-3 hover:shadow-sm transition-all"
                  >
                    {/* Item header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-2">
                      <div>
                        <span className="text-[9px] font-mono text-sahel-ink/50 uppercase tracking-widest">{item.id} • Released {item.releaseYear}</span>
                        <h5 className="font-serif font-bold text-sm text-sahel-ink">{item.legacyTitle}</h5>
                        <p className="text-xs font-semibold text-sahel-ochre">{item.originalArtist}</p>
                      </div>

                      {/* Financial values */}
                      <div className="text-right">
                        <span className="text-[10px] text-sahel-ink/50 block font-mono">Est. Black Box Royalties</span>
                        <span className="text-base font-mono font-black text-sahel-ochre">${item.estimatedUnclaimedRoyalty.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Metadata status & retrofitting */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-sahel-ink/50 font-mono text-[9px] block uppercase">Metadata Identifier</span>
                        {needsIsrc ? (
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-sahel-clay font-mono font-semibold">Missing ISRC/ISWC</span>
                            <button
                              onClick={() => handleRetrofitIsrc(item.id)}
                              className="text-[10px] font-mono bg-sahel-ochre/10 hover:bg-sahel-ochre/20 text-sahel-ochre font-bold px-2 py-0.5 rounded cursor-pointer transition-colors"
                            >
                              Retrofit ISRC Code
                            </button>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center gap-1.5 text-sahel-ink/80">
                            <span className="font-mono font-bold bg-white/60 border border-sahel-earth/60 px-2 py-0.5 rounded text-sahel-ink">
                              {item.legacyIsrc}
                            </span>
                            <span className="text-[10px] text-sahel-olive font-mono flex items-center gap-0.5">
                              <FileCheck className="h-3.5 w-3.5" /> Claim-Ready
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Databases scan targets */}
                      <div>
                        <span className="text-sahel-ink/50 font-mono text-[9px] block uppercase">Detected Databases</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.unclaimedSources.map((src, i) => (
                            <span key={i} className="text-[9px] font-mono bg-sahel-olive/10 text-sahel-olive border border-sahel-olive/20 px-1.5 py-0.5 rounded font-medium">
                              {src}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contributor Verification workflow */}
                    <div className="bg-white/40 border border-black/5 rounded-lg p-3 space-y-1.5">
                      <span className="text-[10px] font-mono text-sahel-ink/50 uppercase tracking-wider block">Contributor Chain of Title Splits</span>
                      <div className="space-y-1.5">
                        {item.contributors.map((c, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-sahel-ink/80">{c.name}</span>
                              <span className="text-[10px] text-sahel-ink/50">({c.role} - {c.split}%)</span>
                            </div>

                            {c.approved ? (
                              <span className="text-[10px] font-mono text-sahel-olive font-semibold flex items-center gap-0.5">
                                <UserCheck className="h-3 w-3" /> Signed off
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-sahel-ochre font-mono font-medium flex items-center gap-0.5">
                                  <ShieldAlert className="h-3 w-3" /> Pending Signoff
                                </span>
                                <button
                                  onClick={() => handleApproveContributorSplit(item.id, c.name)}
                                  className="text-[9px] font-mono bg-sahel-olive/10 hover:bg-sahel-olive/20 text-sahel-olive font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors"
                                >
                                  Approve
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Claim action button / status indicator */}
                    <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-sahel-ink/70 font-medium">Claim Status: </span>
                        <span className={`text-xs font-mono font-bold ${
                          item.claimStatus === 'Recovered'
                            ? 'text-sahel-olive'
                            : item.claimStatus === 'Submitted'
                            ? 'text-sahel-ochre'
                            : item.claimStatus === 'Conflict'
                            ? 'text-sahel-clay'
                            : 'text-sahel-ochre'
                        }`}>
                          {item.claimStatus === 'LOD_Required' ? 'Letter of Direction Required' : item.claimStatus}
                        </span>
                      </div>

                      {hasConflict && (
                        <div className="text-xs text-sahel-clay font-mono font-semibold flex items-center gap-1">
                          <ShieldAlert className="h-4 w-4" /> Resolve splits to claim
                        </div>
                      )}

                      {isClaimable && (
                        <button
                          onClick={() => handleTriggerClaim(item)}
                          className="bg-sahel-clay text-white hover:bg-sahel-ochre transition-colors font-mono font-semibold text-[11px] py-1.5 px-3 rounded cursor-pointer flex items-center gap-1"
                        >
                          <Signature className="h-3.5 w-3.5" />
                          Execute Letter of Direction
                        </button>
                      )}

                      {item.claimStatus === 'Submitted' && (
                        <span className="text-xs text-sahel-ochre font-mono font-semibold flex items-center gap-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Claim Inflight (MLC Pipeline)
                        </span>
                      )}

                      {item.claimStatus === 'Recovered' && (
                        <div className="flex items-center gap-1.5 text-xs text-sahel-olive font-mono font-semibold">
                          <CheckCircle2 className="h-4 w-4" /> Recovered & Distributed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Digital LOD Generator Sidebar */}
      <div className="lg:col-span-4 bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2 border-b border-black/5 pb-2">
            <FileText className="h-5 w-5 text-sahel-clay" />
            <h3 className="font-serif font-bold text-sm text-sahel-ink italic">LOD Automator Portal</h3>
          </div>

          {!activeItemForLod ? (
            <div className="text-center py-12 text-sahel-ink/50 text-xs">
              <HelpCircle className="h-8 w-8 mx-auto mb-2 text-sahel-ink/30" />
              Select a retrofitted legacy item to generate and sign an automated Letter of Direction (LOD) for taking over Black-Box royalties.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/40 border border-sahel-earth rounded-lg p-3 text-xs space-y-1">
                <span className="font-mono text-[9px] uppercase text-sahel-ink/40">Target Legacy Work</span>
                <p className="font-serif font-bold text-sahel-ink text-sm">{activeItemForLod.legacyTitle}</p>
                <p className="font-mono text-sahel-clay">Artist: {activeItemForLod.originalArtist}</p>
                <p className="font-mono text-sahel-ink/60">Claim ISRC: {activeItemForLod.legacyIsrc}</p>
                <p className="font-mono text-sahel-ochre font-bold mt-1">Total Claim Estimate: ${activeItemForLod.estimatedUnclaimedRoyalty.toLocaleString()} USD</p>
              </div>

              {/* Legal Text */}
              <div className="border border-black/5 rounded p-3 text-[10px] text-sahel-ink/70 font-mono bg-sahel-earth/20 leading-relaxed max-h-48 overflow-y-auto">
                <p className="font-bold text-sahel-ink uppercase mb-1">Letter of Direction (LOD) Terms</p>
                To: SoundExchange, The MLC, and Songtrust Administration Boards.<br />
                I, the undersigned Artist / Rights-Holder, hereby direct and authorize <strong>KnewAfrikaan Creative Infrastructure SaaS</strong> to takeover administrative administration and royalty collections for the Sound Recording and Composition referenced above.
                This directive supersedes any previous distribution orders. Retrospective royalties shall be disbursed directly to KnewAfrikaan escrow nodes for Shared-Equity accounting and subsequent contributor distribution.
              </div>

              {lodSignedResult ? (
                <div className="bg-sahel-olive/10 border border-sahel-olive/20 rounded-lg p-3 text-xs text-sahel-olive space-y-2">
                  <p className="font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> LOD Active!
                  </p>
                  <p className="text-[11px] leading-relaxed">{lodSignedResult}</p>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert('LOD Document download triggered. Contains signed SHA256 watermarked metadata.'); }}
                    className="flex items-center gap-1 text-[10px] font-mono text-sahel-olive underline font-semibold mt-1"
                  >
                    <Download className="h-3.5 w-3.5" /> Download signed PDF contract
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSignLod} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-sahel-ink/80 mb-1">Enter Full Name to Sign (Digital Certificate)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Buba Barnabas ClassiQ"
                      value={signName}
                      onChange={(e) => setSignName(e.target.value)}
                      className="w-full text-xs border border-sahel-earth/60 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sahel-clay bg-white/50"
                    />
                  </div>

                  <button
                    type="submit"
                    id="sign-lod-btn"
                    disabled={isSigning || !signName}
                    className="w-full bg-sahel-clay text-white hover:bg-sahel-ochre font-mono font-bold text-xs py-2 px-4 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Signature className="h-4 w-4" />}
                    {isSigning ? 'Watermarking Certificate...' : 'Sign Letter of Direction'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/40 rounded-lg p-3.5 text-xs text-sahel-ink/70 leading-normal font-mono border border-black/5">
          <span className="font-bold text-sahel-ink">Scan Pipeline:</span> Direct registry links push claim packages instantly to:
          <ul className="list-disc list-inside mt-1 space-y-0.5 text-[10px] pl-1 text-sahel-ink/60">
            <li><strong>The MLC</strong> (U.S. Mechanicals)</li>
            <li><strong>SoundExchange</strong> (Global Digital Perf.)</li>
            <li><strong>Songtrust</strong> (Global Publishing)</li>
            <li><strong>MCSN Nigeria</strong> (Local Collective Society)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
