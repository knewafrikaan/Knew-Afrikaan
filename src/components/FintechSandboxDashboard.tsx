import React, { useState } from 'react';
import { 
  Smartphone, 
  Send, 
  Wallet, 
  ArrowUpRight
} from 'lucide-react';

interface FintechSandboxDashboardProps {
  onAddLog: (log: string) => void;
}

export default function FintechSandboxDashboard({ onAddLog }: FintechSandboxDashboardProps) {
  // Fintech Payout sandbox inputs
  const [payoutAmount, setPayoutAmount] = useState<string>('75');
  const [selectedGateway, setSelectedGateway] = useState<string>('momo');
  const [recipientNumber, setRecipientNumber] = useState<string>('+234-803-555-1282');
  const [payoutStatusMessage, setPayoutStatusMessage] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  // History of sandbox payouts during current session
  const [pastPayments, setPastPayments] = useState<Array<{
    id: string;
    gateway: string;
    phone: string;
    usdAmount: number;
    localAmount: string;
    timestamp: string;
    status: 'PAID' | 'FAILED';
  }>>([
    {
      id: 'TXN-48201',
      gateway: 'MTN Mobile Money',
      phone: '+234-803-555-1282',
      usdAmount: 120,
      localAmount: '₦186,000 NGN',
      timestamp: '09:12:45',
      status: 'PAID'
    },
    {
      id: 'TXN-48194',
      gateway: 'Airtel Money',
      phone: '+227-90-1123-48',
      usdAmount: 45,
      localAmount: '27,000 XOF',
      timestamp: '08:44:21',
      status: 'PAID'
    }
  ]);

  const handleExecutePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      setPayoutStatusMessage('Please enter a valid payout amount.');
      return;
    }

    setIsPaying(true);
    setPayoutStatusMessage(null);
    const gatewayName = selectedGateway === 'momo' ? 'MTN Mobile Money' : 'Airtel Money';
    onAddLog(`FINTECH SANDBOX: Initiating direct micro-royalty payout of $${payoutAmount} USD via ${gatewayName} to ${recipientNumber}...`);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.08; // 92% success rate
      const timestamp = new Date().toISOString().replace('T', ' ').substring(11, 19);
      
      const rate = selectedGateway === 'momo' ? 1550 : 600;
      const currency = selectedGateway === 'momo' ? 'NGN' : 'XOF';
      const symbol = selectedGateway === 'momo' ? '₦' : '';
      const localAmountFormatted = `${symbol}${(parseFloat(payoutAmount) * rate).toLocaleString()} ${currency}`;

      if (isSuccess) {
        const txId = `MOMO-TX-${Math.floor(100000 + Math.random() * 900000)}`;
        setPastPayments(prev => [
          {
            id: `TXN-${Math.floor(40000 + Math.random() * 9000)}`,
            gateway: gatewayName,
            phone: recipientNumber,
            usdAmount: parseFloat(payoutAmount),
            localAmount: localAmountFormatted,
            timestamp,
            status: 'PAID'
          },
          ...prev
        ]);
        setPayoutStatusMessage(`✔ Settlement Disbursed! Transferred $${payoutAmount} USD (~${localAmountFormatted}) to ${recipientNumber} via ${gatewayName}.`);
        onAddLog(`FINTECH DISBURSEMENT SECURED: Cleared payment via ${gatewayName} [TX: ${txId}].`);
      } else {
        const txId = `TXN-${Math.floor(40000 + Math.random() * 9000)}`;
        setPastPayments(prev => [
          {
            id: txId,
            gateway: gatewayName,
            phone: recipientNumber,
            usdAmount: parseFloat(payoutAmount),
            localAmount: localAmountFormatted,
            timestamp,
            status: 'FAILED'
          },
          ...prev
        ]);
        setPayoutStatusMessage('❌ Payout failed. Carrier timeout detected. Autoretry protocol queued.');
      }
      setIsPaying(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="fintech-sandbox-dashboard">
      
      {/* Persistant Control Title */}
      <div className="bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-sahel-clay/10 text-sahel-clay rounded-lg">
            <Smartphone className="h-6 w-6 animate-pulse" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-base text-sahel-ink italic tracking-tight">
              Fintech Micro-Disbursement Sandbox
            </h3>
            <p className="text-xs text-sahel-ink/60 mt-0.5">
              Simulate direct mobile money split payment settlements to creative professionals across regional African gateways.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Disbursement Simulator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-black/5 pb-3">
              <div>
                <h4 className="font-serif font-bold text-sm text-sahel-ink italic flex items-center gap-1.5">
                  <Wallet className="h-4.5 w-4.5 text-sahel-clay" /> Disbursement Gateway
                </h4>
                <p className="text-[11px] text-sahel-ink/60">Convert USD royalty collections into instant local currency mobile payouts.</p>
              </div>
              <span className="text-[10px] font-mono text-sahel-olive bg-sahel-olive/10 px-2 py-0.5 rounded border border-sahel-olive/20 font-bold uppercase">
                SANDBOX ACTIVE
              </span>
            </div>

            <form onSubmit={handleExecutePayout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-sahel-ink/80 mb-1">Target Regional Gateway</label>
                  <select
                    value={selectedGateway}
                    onChange={(e) => {
                      setSelectedGateway(e.target.value);
                      if (e.target.value === 'momo') setRecipientNumber('+234-803-555-1282');
                      else setRecipientNumber('+227-90-1123-48');
                    }}
                    className="w-full text-xs border border-sahel-earth/60 rounded px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50 cursor-pointer"
                  >
                    <option value="momo">MTN Mobile Money Open API (Nigeria / Ghana)</option>
                    <option value="airtel">Airtel Money Disbursement Socket (Niger / Chad)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-sahel-ink/80 mb-1">Recipient Mobile Phone (Wallet)</label>
                  <input
                    type="text"
                    required
                    value={recipientNumber}
                    onChange={(e) => setRecipientNumber(e.target.value)}
                    placeholder="+234-803-xxx-xxxx"
                    className="w-full text-xs border border-sahel-earth/60 rounded px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-sahel-ink/80 mb-1">Disbursement Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-sahel-ink/50 font-semibold">$</span>
                    <input
                      type="number"
                      required
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="w-full text-xs border border-sahel-earth/60 rounded pl-6 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-sahel-ochre bg-white/50 font-mono font-bold text-sahel-ink"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-full text-xs font-mono font-bold py-2 px-4 rounded-md transition-all cursor-pointer bg-sahel-clay hover:bg-sahel-ochre text-white disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isPaying ? 'Settling...' : 'Release Payout'}
                  </button>
                </div>
              </div>
            </form>

            {payoutStatusMessage && (
              <div className={`text-xs p-3.5 rounded-lg border flex items-start gap-2.5 ${
                payoutStatusMessage.startsWith('✔') 
                  ? 'bg-sahel-olive/10 border-sahel-olive/20 text-sahel-olive' 
                  : 'bg-sahel-clay/10 border-sahel-clay/20 text-sahel-clay'
              }`}>
                <span className="text-sm shrink-0">
                  {payoutStatusMessage.startsWith('✔') ? '✓' : '⚠'}
                </span>
                <p className="font-medium">{payoutStatusMessage}</p>
              </div>
            )}
          </div>

          {/* Live Conversion Factors */}
          <div className="bg-white/40 border border-black/5 rounded-xl p-5 shadow-sm space-y-3">
            <h5 className="font-serif font-bold text-xs text-sahel-ink italic">Live Settlement Exchange Rates</h5>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-sahel-ink/75 font-mono">
              <div className="bg-white/40 p-2.5 rounded border border-black/5">
                <span className="block font-bold text-sahel-clay">MTN MoMo Rate</span>
                <span className="text-xs font-bold text-sahel-ink">1 USD = 1,550 NGN</span>
              </div>
              <div className="bg-white/40 p-2.5 rounded border border-black/5">
                <span className="block font-bold text-sahel-clay">Airtel Money Rate</span>
                <span className="text-xs font-bold text-sahel-ink">1 USD = 600 XOF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Recent Settlements Ledger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-black/5 pb-2">
              <h4 className="font-serif font-bold text-xs text-sahel-ink uppercase flex items-center gap-1.5 tracking-wider">
                <ArrowUpRight className="h-4 w-4 text-sahel-olive" /> Recent Disbursements Ledger
              </h4>
              <p className="text-[11px] text-sahel-ink/60">Real-time local currency payout logs audit checklist.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-sahel-earth/25 border-b border-black/5 font-mono text-sahel-ink/60 text-[10px] uppercase">
                    <th className="p-2">TXID</th>
                    <th className="p-2">Recipient</th>
                    <th className="p-2">Amt (USD)</th>
                    <th className="p-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {pastPayments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-sahel-ink/40 font-mono text-xs">
                        Ledger empty. No payments cleared in this session.
                      </td>
                    </tr>
                  ) : (
                    pastPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-white/30 text-[11px]">
                        <td className="p-2 font-mono text-[10px] text-sahel-clay font-bold">{p.id}</td>
                        <td className="p-2">
                          <span className="block font-mono text-[9px] text-sahel-ink/80">{p.phone}</span>
                          <span className="block text-[8px] text-sahel-ink/40">{p.gateway}</span>
                        </td>
                        <td className="p-2">
                          <span className="block font-bold font-mono">${p.usdAmount}</span>
                          <span className="block font-mono text-sahel-olive font-bold text-[9px]">{p.localAmount}</span>
                        </td>
                        <td className="p-2 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            p.status === 'PAID' ? 'bg-sahel-olive/10 text-sahel-olive' : 'bg-sahel-clay/10 text-sahel-clay'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
