import React, { useState } from 'react';
import { TrackAsset, LegacyCatalogItem } from '../types';
import {
  Activity,
  Terminal,
  Network,
  Cpu,
  FileCode,
  Download,
  Copy,
  Check,
  RefreshCw,
  Radio,
  Server,
  Zap
} from 'lucide-react';

interface TelemetryViewProps {
  tracks: TrackAsset[];
  legacyItems: LegacyCatalogItem[];
  terminalLogs: string[];
  onAddLog: (log: string) => void;
}

export default function TelemetryView({ tracks, legacyItems, terminalLogs, onAddLog }: TelemetryViewProps) {
  const [selectedFormat, setSelectedFormat] = useState<'ddex' | 'cwr' | 'iso20022'>('ddex');
  const [copied, setCopied] = useState<boolean>(false);

  const sampleTrack = tracks[0] || {
    id: 'TRK-001',
    master: { recordingTitle: 'Sarki (The King)', isrc: 'NG-K3A-26-00104' },
    publishing: { iswc: 'T-302.948.109-2' }
  };

  const ddexSample = `<?xml version="1.0" encoding="UTF-8"?>
<ernm:NewReleaseMessage xmlns:ernm="http://ddex.net/xml/ern/43" LanguageAndScriptCode="en-US">
  <MessageHeader>
    <MessageThreadId>KNEW-AFRIKAAN-THREAD-${Date.now()}</MessageThreadId>
    <MessageSender><PartyId>ISNI:0000000123456789</PartyId><PartyName>KnewAfrikaan Creative Infrastructure</PartyName></MessageSender>
    <MessageRecipient><PartyName>The MLC / SoundExchange DDEX Socket</PartyName></MessageRecipient>
    <MessageCreatedDateTime>${new Date().toISOString()}</MessageCreatedDateTime>
  </MessageHeader>
  <ResourceList>
    <SoundRecording>
      <ResourceReference>A1</ResourceReference>
      <Type>Audio</Type>
      <SoundRecordingId><ISRC>${sampleTrack.master.isrc}</ISRC></SoundRecordingId>
      <ReferenceTitle><TitleText>${sampleTrack.master.recordingTitle}</TitleText></ReferenceTitle>
      <Language>ha-NG (Kano Hausa)</Language>
    </SoundRecording>
  </ResourceList>
</ernm:NewReleaseMessage>`;

  const cwrSample = `HDR000000000KNEWAFRIKAAN PUBLISHING      01.1020260722143000N
NWR0000000100000000${sampleTrack.publishing.iswc.replace(/[^A-Z0-9]/g, '')}00000000000${sampleTrack.master.recordingTitle.padEnd(30, ' ')}00000
SPU0000000100000001003482910BUBA BARNABAS (CLASSIQ)         E 050000000000N
SWR0000000100000002009841203GEEKBEATZ                       E 030000000000N
SWR0000000100000003004128954FXNGZ JAHKIM                    E 020000000000N
TRL000000010000000500000001`;

  const isoSample = `{
  "GrpHdr": {
    "MsgId": "MOMO-SETTLE-${Date.now()}",
    "CreDtTm": "${new Date().toISOString()}",
    "NbOfTxs": "1",
    "SttlmInf": { "SttlmMtd": "CLRG", "ClrSys": "MTN_MOMO_NG" }
  },
  "CdtTrfTxInf": {
    "PmtId": { "EndToEndId": "ROYALTY-DISBURSE-001" },
    "Amt": { "InstdAmt": { "Ccy": "NGN", "Value": "186000.00" } },
    "Cdtr": { "Nm": "ClassiQ (Buba Barnabas)" }
  }
}`;

  const currentCode = selectedFormat === 'ddex' ? ddexSample : selectedFormat === 'cwr' ? cwrSample : isoSample;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    onAddLog(`TELEMETRY EXPORT: Copied ${selectedFormat.toUpperCase()} string to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="telemetry-operations-board">
      {/* Visual Header */}
      <div className="bg-[#121110] text-[#F2E9DE] rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#C68B59]/20 text-[#C68B59] rounded">
                <Activity className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-[#C68B59] tracking-widest">
                Operations & Socket Telemetry
              </span>
            </div>
            <h2 className="text-xl font-serif font-black text-white mt-1">
              Live Protocol Inspector & Payload Parser
            </h2>
            <p className="text-xs text-white/60 font-mono mt-0.5">
              Direct verification of DDEX ERN 4.3 XML, CWR 2.1 Flatfile, and ISO 20022 Mobile Money webhooks.
            </p>
          </div>

          <button
            onClick={() => onAddLog('TELEMETRY REFRESH: Re-pinging socket channels...')}
            className="px-3.5 py-2 bg-[#C68B59] text-[#2D2926] hover:bg-[#A65D50] hover:text-white rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Ping Socket Sockets</span>
          </button>
        </div>
      </div>

      {/* Socket Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'The MLC (CWR Ingest)', status: 'ONLINE', ping: '142ms', protocol: 'CWR 2.1', color: 'border-green-500/30 text-green-400' },
          { name: 'SoundExchange SFTP', status: 'ONLINE', ping: '210ms', protocol: 'DDEX ERN', color: 'border-green-500/30 text-green-400' },
          { name: 'MTN MoMo Sandbox', status: 'ACTIVE', ping: '98ms', protocol: 'REST / ISO', color: 'border-[#C68B59]/40 text-[#C68B59]' },
          { name: 'Songtrust Webhook', status: 'STANDBY', ping: '180ms', protocol: 'JSON API', color: 'border-blue-500/30 text-blue-400' },
        ].map((s) => (
          <div key={s.name} className="p-4 bg-[#1e1c1a] border border-white/10 rounded-2xl text-white font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50 uppercase font-bold">{s.protocol}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 ${s.color}`}>
                {s.status}
              </span>
            </div>
            <p className="font-serif font-bold text-sm text-white">{s.name}</p>
            <p className="text-[11px] text-white/60">Socket Latency: {s.ping}</p>
          </div>
        ))}
      </div>

      {/* Interactive Payload Inspector */}
      <div className="bg-[#181615] border border-white/10 rounded-2xl overflow-hidden shadow-xl text-white">
        {/* Format Selector Bar */}
        <div className="p-4 border-b border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold">
            <button
              onClick={() => setSelectedFormat('ddex')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedFormat === 'ddex' ? 'bg-[#C68B59] text-[#2D2926]' : 'text-white/60 hover:text-white'
              }`}
            >
              DDEX ERN 4.3 XML
            </button>
            <button
              onClick={() => setSelectedFormat('cwr')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedFormat === 'cwr' ? 'bg-[#C68B59] text-[#2D2926]' : 'text-white/60 hover:text-white'
              }`}
            >
              CWR 2.1 Publishing
            </button>
            <button
              onClick={() => setSelectedFormat('iso20022')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedFormat === 'iso20022' ? 'bg-[#C68B59] text-[#2D2926]' : 'text-white/60 hover:text-white'
              }`}
            >
              ISO 20022 Fintech
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied Payload!' : 'Copy Raw String'}</span>
          </button>
        </div>

        {/* Code Editor Preview Box */}
        <div className="p-4 bg-black/80 font-mono text-xs text-amber-200/90 leading-relaxed overflow-x-auto max-h-96">
          <pre>{currentCode}</pre>
        </div>
      </div>

      {/* Terminal Registry Log Console */}
      <div className="bg-[#121110] border border-white/10 rounded-2xl p-5 text-white font-mono text-xs space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#C68B59] animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-white">Live Platform Terminal Ledger</span>
          </div>
          <span className="text-[10px] text-white/40">{terminalLogs.length} Total Audit Entries</span>
        </div>

        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2">
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="flex gap-2 text-[11px] leading-relaxed">
              <span className="text-[#C68B59] shrink-0">❯</span>
              <span className="text-white/80">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
