import React, { useState } from 'react';
import { BadgeDollarSign, ShieldCheck, Scale, Calculator, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';

interface SharedEquityLabProps {
  onAddLog: (log: string) => void;
}

export default function SharedEquityLab({ onAddLog }: SharedEquityLabProps) {
  // Simulator inputs
  const [recoupableCosts, setRecoupableCosts] = useState<number>(5000);
  const [totalRevenue, setTotalRevenue] = useState<number>(12000);
  const [producerPoints, setProducerPoints] = useState<number>(20); // 20% for Geekbeatz
  const [initialPercentage, setInitialPercentage] = useState<number>(20); // 20% initial platform share
  const [cappedDecliningPercentage, setCappedDecliningPercentage] = useState<number>(5); // 5% after recoupment

  // Calculate outputs
  const isRecouped = totalRevenue >= recoupableCosts;

  let platformPercent = initialPercentage;
  let artistPercentBeforeProducer = 100 - initialPercentage;

  if (isRecouped) {
    platformPercent = cappedDecliningPercentage;
    artistPercentBeforeProducer = 100 - cappedDecliningPercentage;
  }

  // Producer points are deducted from the master share at the source
  // Master share corresponds to the artist's share before this deduction
  const platformRevenue = (platformPercent / 100) * totalRevenue;
  
  // Producer share is calculated from the artist's master share
  const artistBaseShare = artistPercentBeforeProducer / 100 * totalRevenue;
  const producerShare = (producerPoints / 100) * artistBaseShare;
  const artistNetShare = artistBaseShare - producerShare;

  // Split percentages of the TOTAL dollar
  const platformTotalPercent = platformPercent;
  const producerTotalPercent = (producerPoints / 100) * (100 - platformPercent);
  const artistTotalPercent = 100 - platformTotalPercent - producerTotalPercent;

  const handleApplyPreset = (preset: string) => {
    if (preset === 'Low Cost Hit') {
      setRecoupableCosts(2000);
      setTotalRevenue(18000);
      setProducerPoints(25);
    } else if (preset === 'High Investment') {
      setRecoupableCosts(15000);
      setTotalRevenue(8000);
      setProducerPoints(20);
    } else {
      setRecoupableCosts(5000);
      setTotalRevenue(6000);
      setProducerPoints(15);
    }
    onAddLog(`Applied Shared-Equity Financial Preset: "${preset}"`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="shared-equity-lab-module">
      {/* Simulator Inputs Sidebar */}
      <div className="lg:col-span-5 bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-black/5 pb-2">
          <Calculator className="h-5 w-5 text-sahel-ochre" />
          <div>
            <h3 className="font-serif font-bold text-base text-sahel-ink italic">Shared-Equity Simulator</h3>
            <p className="text-xs text-sahel-ink/60">Recoupment-Based Declining Equity Splits</p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono font-bold text-sahel-ink/40 self-center uppercase mr-1">Presets:</span>
          {['Moderate Release', 'Low Cost Hit', 'High Investment'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-[10px] font-mono bg-white/40 hover:bg-sahel-ochre/10 border border-black/5 text-sahel-ink/80 px-2 py-1 rounded cursor-pointer transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Slider 1: Recoupable costs */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-sahel-ink/80">Recoupable Costs (Studio, Marketing, Distro)</span>
            <span className="font-mono text-sahel-clay font-bold">${recoupableCosts.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="25000"
            step="500"
            value={recoupableCosts}
            onChange={(e) => setRecoupableCosts(parseInt(e.target.value))}
            className="w-full accent-sahel-ochre h-1.5 bg-sahel-earth/30 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-sahel-ink/40 font-mono">
            <span>$1,000</span>
            <span>$25,000</span>
          </div>
        </div>

        {/* Slider 2: Total Revenue */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-sahel-ink/80">Gross Track Revenue (DSP + Licensing)</span>
            <span className="font-mono text-sahel-olive font-bold">${totalRevenue.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={totalRevenue}
            onChange={(e) => setTotalRevenue(parseInt(e.target.value))}
            className="w-full accent-sahel-olive h-1.5 bg-sahel-earth/30 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-sahel-ink/40 font-mono">
            <span>$0</span>
            <span>$50,000</span>
          </div>
        </div>

        {/* Slider 3: Pro-Producer Points */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-sahel-ink/80">Pro-Producer Points (Geekbeatz Share)</span>
            <span className="font-mono text-sahel-clay font-bold">{producerPoints}% of Master</span>
          </div>
          <input
            type="range"
            min="5"
            max="40"
            step="5"
            value={producerPoints}
            onChange={(e) => setProducerPoints(parseInt(e.target.value))}
            className="w-full accent-sahel-clay h-1.5 bg-sahel-earth/30 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-sahel-ink/40 font-mono">
            <span>5% (Base)</span>
            <span>40% (Elite Co-Writer)</span>
          </div>
          <p className="text-[10px] text-sahel-ink/50 leading-normal italic">
            *Deducted directly from Master composition share at source, ensuring proper songwriter/producer parity.
          </p>
        </div>

        {/* Configuration Constants */}
        <div className="bg-white/40 rounded-lg p-3 border border-black/5 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-sahel-ink/40 font-mono text-[9px] block uppercase">Initial Platform Share</span>
            <span className="font-bold text-sahel-ink">{initialPercentage}%</span>
            <span className="text-[9px] text-sahel-ink/40 block font-mono">Pre-Recoupment</span>
          </div>
          <div>
            <span className="text-sahel-ink/40 font-mono text-[9px] block uppercase">Declining Cap Share</span>
            <span className="font-bold text-sahel-olive">{cappedDecliningPercentage}%</span>
            <span className="text-[9px] text-sahel-ink/40 block font-mono">Post-Recoupment Reward</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics and Output Dashboard */}
      <div className="lg:col-span-7 bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-6 flex flex-col justify-between">
        {/* Recoupment Status Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-black/5 pb-4">
          <div>
            <h4 className="font-serif font-bold text-sm text-sahel-ink flex items-center gap-1 italic">
              <Scale className="h-4.5 w-4.5 text-sahel-ochre" /> Recoupment Split Ledger
            </h4>
            <p className="text-xs text-sahel-ink/60">Automatic platform equity step-down trigger</p>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
            isRecouped 
              ? 'bg-sahel-olive/10 text-sahel-olive border border-sahel-olive/20 animate-pulse'
              : 'bg-sahel-ochre/10 text-sahel-ochre border border-sahel-ochre/20'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isRecouped ? 'bg-sahel-olive' : 'bg-sahel-ochre'}`}></span>
            {isRecouped ? 'RECOUPED: 5% PLATFORM CAP ACTIVE' : 'IN RECOUPMENT: 20% STANDARD SPLIT'}
          </div>
        </div>

        {/* Mathematical Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Platform share dollar */}
          <div className="bg-white/40 border border-black/5 rounded-lg p-3 text-center">
            <span className="text-[10px] font-mono text-sahel-ink/50 uppercase tracking-wider block">KnewAfrikaan Share</span>
            <p className="text-2xl font-mono font-black text-sahel-ink mt-1">${platformRevenue.toLocaleString()}</p>
            <span className="text-xs font-mono bg-sahel-earth text-sahel-ink/80 px-2 py-0.5 rounded font-bold mt-1 inline-block">
              {platformPercent}% Split
            </span>
          </div>

          {/* Producer points dollar */}
          <div className="bg-sahel-clay/5 border border-sahel-clay/15 rounded-lg p-3 text-center">
            <span className="text-[10px] font-mono text-sahel-ink/50 uppercase tracking-wider block">Producer points (Geekbeatz)</span>
            <p className="text-2xl font-mono font-black text-sahel-clay mt-1">${producerShare.toLocaleString()}</p>
            <span className="text-xs font-mono bg-sahel-clay/10 text-sahel-clay px-2 py-0.5 rounded font-bold mt-1 inline-block">
              {producerPoints}% Master
            </span>
          </div>

          {/* Net Artist share dollar */}
          <div className="bg-sahel-olive/5 border border-sahel-olive/15 rounded-lg p-3 text-center">
            <span className="text-[10px] font-mono text-sahel-ink/50 uppercase tracking-wider block">Artist Net payout</span>
            <p className="text-2xl font-mono font-black text-sahel-olive mt-1">${artistNetShare.toLocaleString()}</p>
            <span className="text-xs font-mono bg-sahel-olive/10 text-sahel-olive px-2 py-0.5 rounded font-bold mt-1 inline-block">
              {artistTotalPercent.toFixed(1)}% of Total
            </span>
          </div>
        </div>

        {/* Visual Multi-Color Split Progress Bar */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-sahel-ink/80 block">Total Revenue Allocation Structure</span>
          <div className="w-full h-8 rounded-lg overflow-hidden flex font-mono text-[10px] text-white font-bold">
            <div 
              className="bg-sahel-ink flex items-center justify-center transition-all"
              style={{ width: `${platformTotalPercent}%` }}
              title={`Platform Share: ${platformTotalPercent}%`}
            >
              {platformTotalPercent > 8 && `SaaS: ${platformTotalPercent}%`}
            </div>
            <div 
              className="bg-sahel-clay flex items-center justify-center transition-all"
              style={{ width: `${producerTotalPercent}%` }}
              title={`Producer Share: ${producerTotalPercent.toFixed(1)}%`}
            >
              {producerTotalPercent > 8 && `Geekbeatz: ${producerTotalPercent.toFixed(0)}%`}
            </div>
            <div 
              className="bg-sahel-olive flex items-center justify-center transition-all"
              style={{ width: `${artistTotalPercent}%` }}
              title={`Artist Share: ${artistTotalPercent.toFixed(1)}%`}
            >
              {artistTotalPercent > 8 && `Artist: ${artistTotalPercent.toFixed(0)}%`}
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-sahel-ink/50">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-sahel-ink rounded-sm"></span> KnewAfrikaan SaaS</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-sahel-clay rounded-sm"></span> Geekbeatz (Producer)</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-sahel-olive rounded-sm"></span> Net Lead Artist</span>
          </div>
        </div>

        {/* Recoupment Breakdown details */}
        <div className="bg-white/40 border border-black/5 rounded-xl p-4 space-y-2.5 text-xs">
          <p className="font-bold text-sahel-clay font-serif flex items-center gap-1 italic">
            <TrendingUp className="h-4 w-4" /> Shared-Equity Economics Audit
          </p>
          <p className="text-sahel-ink/70 leading-relaxed font-sans">
            By shifting from rigid 360 predatory contracts to our dynamic algorithm, the artist retains full long-term intellectual property rights. 
            {isRecouped ? (
              <span className="text-sahel-olive font-semibold block mt-1">
                ✔ SUCCESS: Recoupment threshold of ${recoupableCosts.toLocaleString()} exceeded. The platform's split automatically collapsed from 20% to 5% to reward the artist's commercial success, maximizing direct payouts.
              </span>
            ) : (
              <span className="text-sahel-ochre font-semibold block mt-1">
                ⚠ RECOUPMENT IN PROGRESS: Currently ${totalRevenue.toLocaleString()} of ${recoupableCosts.toLocaleString()} costs recovered. Standard 20% platform share applies to support and fund local regional hubs.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
