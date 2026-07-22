import React, { useState, useMemo } from 'react';
import { Network, Wifi, ShieldCheck, Database, RefreshCw, Send, Radio, Terminal, AlertCircle, Smartphone, Globe, Disc, Key, Search, Trash2, Play, CheckCircle2, XCircle, Download, Activity, FileText } from 'lucide-react';

interface ApiConnection {
  id: string;
  name: string;
  type: 'Inbound' | 'Outbound' | 'Financial';
  protocol: 'REST / JSON' | 'SFTP / DDEX XML' | 'CWR / Flatfile' | 'ISO 20022 / Webhook';
  endpoint: string;
  status: 'Connected' | 'Degraded' | 'Offline';
  latencyMs: number;
  lastSync: string;
  description: string;
}

interface ApiLog {
  timestamp: string;
  api: string;
  direction: 'IN' | 'OUT';
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  message: string;
  payload: string;
}

interface ApiConnectionsDashboardProps {
  onAddLog: (log: string) => void;
}

export default function ApiConnectionsDashboard({ onAddLog }: ApiConnectionsDashboardProps) {
  const [connections, setConnections] = useState<ApiConnection[]>([
    {
      id: 'mlc',
      name: 'The Mechanical Licensing Collective (The MLC)',
      type: 'Outbound',
      protocol: 'CWR / Flatfile',
      endpoint: 'https://api.themlc.com/v2/works/cwr-ingest',
      status: 'Connected',
      latencyMs: 142,
      lastSync: new Date(Date.now() - 4 * 60000).toISOString().replace('T', ' ').substring(0, 19),
      description: 'CWR registrations sync for publishing mechanical copyright collections.'
    },
    {
      id: 'sx',
      name: 'SoundExchange Digital Performance',
      type: 'Outbound',
      protocol: 'SFTP / DDEX XML',
      endpoint: 'sftp://ingest.soundexchange.com/ddex/ern',
      status: 'Connected',
      latencyMs: 210,
      lastSync: new Date(Date.now() - 15 * 60000).toISOString().replace('T', ' ').substring(0, 19),
      description: 'DDEX ERN audio metadata delivery for US digital satellite/non-interactive streams.'
    },
    {
      id: 'momo',
      name: 'MTN Mobile Money Open API',
      type: 'Financial',
      protocol: 'REST / JSON',
      endpoint: 'https://sandbox.momodeveloper.mtn.com/collection/v1_0',
      status: 'Connected',
      latencyMs: 98,
      lastSync: new Date(Date.now() - 2 * 60000).toISOString().replace('T', ' ').substring(0, 19),
      description: 'Disburses instant micro-royalties directly to creative digital wallets in Nigeria & Ghana.'
    },
    {
      id: 'airtel',
      name: 'Airtel Money Disbursement Socket',
      type: 'Financial',
      protocol: 'REST / JSON',
      endpoint: 'https://api.airtel.com/merchant/v1/payments',
      status: 'Connected',
      latencyMs: 112,
      lastSync: new Date(Date.now() - 18 * 60000).toISOString().replace('T', ' ').substring(0, 19),
      description: 'Fintech settlement link for Niger and Chad mobile wallets.'
    },
    {
      id: 'mcsn',
      name: 'Musical Copyright Society of Nigeria',
      type: 'Outbound',
      protocol: 'REST / JSON',
      endpoint: 'https://registry.mcsn.org.ng/api/v1/works',
      status: 'Connected',
      latencyMs: 185,
      lastSync: new Date(Date.now() - 45 * 60000).toISOString().replace('T', ' ').substring(0, 19),
      description: 'Local mechanical and public performance rights registrations.'
    },
    {
      id: 'songtrust',
      name: 'Songtrust Global Pub Administration',
      type: 'Outbound',
      protocol: 'REST / JSON',
      endpoint: 'https://api.songtrust.com/v1/registration',
      status: 'Connected',
      latencyMs: 155,
      lastSync: new Date(Date.now() - 32 * 60000).toISOString().replace('T', ' ').substring(0, 19),
      description: 'Triggers publishing administration claims globally across 60+ territories.'
    },
    {
      id: 'ingestion_webhook',
      name: 'KnewAfrikaan Regional Client Inbound',
      type: 'Inbound',
      protocol: 'ISO 20022 / Webhook',
      endpoint: 'https://gateway.knewafrikaan.com/api/v1/ingest',
      status: 'Connected',
      latencyMs: 45,
      lastSync: new Date(Date.now() - 1 * 60000).toISOString().replace('T', ' ').substring(0, 19),
      description: 'Inbound ingestion endpoint receiving metadata, split-sheets, and lossless audio.'
    }
  ]);

  const [logs, setLogs] = useState<ApiLog[]>([
    {
      timestamp: new Date(Date.now() - 30 * 1000).toISOString().replace('T', ' ').substring(11, 19),
      api: 'MTN Mobile Money Open API',
      direction: 'OUT',
      status: 'SUCCESS',
      message: 'Split disbursement successful to +234-803-xxxx.',
      payload: '{"amount": "45000.00", "currency": "NGN", "transactionId": "MOMO-94182103", "status": "COMPLETED"}'
    },
    {
      timestamp: new Date(Date.now() - 2 * 60000).toISOString().replace('T', ' ').substring(11, 19),
      api: 'KnewAfrikaan Regional Client Inbound',
      direction: 'IN',
      status: 'SUCCESS',
      message: 'Validated incoming metadata payload. Language: Yoruba.',
      payload: '{"title": "Eko Dun", "artist": "Adekunle", "language": "Yoruba", "dialect": "Egba"}'
    },
    {
      timestamp: new Date(Date.now() - 5 * 60000).toISOString().replace('T', ' ').substring(11, 19),
      api: 'The Mechanical Licensing Collective (The MLC)',
      direction: 'OUT',
      status: 'SUCCESS',
      message: 'CWR registration chunk #402 delivery accepted.',
      payload: '{"fileId": "CWR-KNEW-20260719-03.txt", "records": 12, "status": "RECEIVED"}'
    }
  ]);

  // Fintech Payout sandbox input
  const [payoutAmount, setPayoutAmount] = useState<string>('75');
  const [selectedGateway, setSelectedGateway] = useState<string>('momo');
  const [recipientNumber, setRecipientNumber] = useState<string>('+234-803-555-1282');
  const [payoutStatusMessage, setPayoutStatusMessage] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  // Filter State
  const [activeSubset, setActiveSubset] = useState<'All' | 'Inbound' | 'Outbound' | 'Financial'>('All');
  const [viewMode, setViewMode] = useState<'Grid' | 'List'>('List');

  // Trigger interactive connectivity checks
  const [isPingingAll, setIsPingingAll] = useState<boolean>(false);

  // Traffic log search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'ERROR'>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const handleSimulateWebhook = () => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(11, 19);
    const apis = [
      { name: 'KnewAfrikaan Regional Client Inbound', dir: 'IN' as const, msg: 'Received micro-chunk streaming telemetry metadata.' },
      { name: 'The Mechanical Licensing Collective (The MLC)', dir: 'OUT' as const, msg: 'Dispatched dynamic work copyright amendment.' },
      { name: 'SAMRO Portal Webhook Listener', dir: 'IN' as const, msg: 'Incoming performance credit event reported.' },
      { name: 'COSON Settlement Dispatch', dir: 'OUT' as const, msg: 'Automated royalty disbursement triggered.' }
    ];
    const picked = apis[Math.floor(Math.random() * apis.length)];
    const isSuccess = Math.random() > 0.15;
    
    const newLog: ApiLog = {
      timestamp,
      api: picked.name,
      direction: picked.dir,
      status: isSuccess ? 'SUCCESS' : 'ERROR',
      message: isSuccess 
        ? picked.msg 
        : `Network handshake failure during connection to ${picked.name}. Retrying in 15 seconds.`,
      payload: JSON.stringify({
        event_id: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
        simulated: true,
        endpoint_ping_latency_ms: Math.floor(12 + Math.random() * 200),
        status_code: isSuccess ? 200 : 504,
        payload_data_hash: '0x' + Math.floor(Math.random() * 10000000).toString(16),
        metadata: {
          client_id: "KNEW-AFR-APP-99",
          environment: "sandbox-sahel-v1"
        }
      }, null, 2)
    };

    setLogs(l => [newLog, ...l]);
    onAddLog(`API LOG SIMULATION: New payload generated for ${picked.name}.`);
  };

  const handleClearLogs = () => {
    setLogs([]);
    onAddLog('API ENGINE: Handshake & traffic logs cleared.');
  };

  const handleExportLogs = () => {
    const text = JSON.stringify(logs, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knewafrikaan-api-traffic-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onAddLog('API ENGINE: Exported traffic logs to JSON file.');
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.api.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            log.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDir = directionFilter === 'ALL' || log.direction === directionFilter;
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
      return matchesSearch && matchesDir && matchesStatus;
    });
  }, [logs, searchQuery, directionFilter, statusFilter]);

  const filteredConnections = activeSubset === 'All' 
    ? connections 
    : connections.filter(c => c.type === activeSubset);

  const inboundConnections = connections.filter(c => c.type === 'Inbound');
  const outboundConnections = connections.filter(c => c.type === 'Outbound');
  const financialConnections = connections.filter(c => c.type === 'Financial');

  const handlePing = (id: string) => {
    // Simulate ping latency modification and log output
    setConnections(prev => prev.map(conn => {
      if (conn.id === id) {
        const newLatency = Math.floor(40 + Math.random() * 220);
        const timestamp = new Date().toISOString().replace('T', ' ').substring(11, 19);
        
        // Add API log line
        const newLog: ApiLog = {
          timestamp,
          api: conn.name,
          direction: 'OUT',
          status: 'SUCCESS',
          message: `Manual ping verification resolved successfully. Latency: ${newLatency}ms.`,
          payload: `{"ping_latency_ms": ${newLatency}, "heartbeat_status": "OK", "ssl_verified": true}`
        };
        setLogs(l => [newLog, ...l]);
        onAddLog(`API INTEGRATION DIAL: Handshaked with ${conn.name}. Latency ${newLatency}ms [SECURE].`);
        
        return {
          ...conn,
          latencyMs: newLatency,
          lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }
      return conn;
    }));
  };

  const handlePingAll = () => {
    setIsPingingAll(true);
    onAddLog('API INTEGRATION: Initializing recursive ping checklist of all 7 critical inbound & outbound pipelines...');
    
    setTimeout(() => {
      setConnections(prev => prev.map(conn => {
        const newLatency = Math.floor(40 + Math.random() * 200);
        return {
          ...conn,
          latencyMs: newLatency,
          lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }));

      const timestamp = new Date().toISOString().replace('T', ' ').substring(11, 19);
      const summaryLog: ApiLog = {
        timestamp,
        api: 'GLOBAL INGEST & REGISTRY API',
        direction: 'OUT',
        status: 'SUCCESS',
        message: 'All endpoints verified. High SSL compliance active.',
        payload: '{"active_gateways": 7, "system_load": "0.14", "average_latency": "135ms"}'
      };
      setLogs(l => [summaryLog, ...l]);
      setIsPingingAll(false);
      onAddLog('API INTEGRATION: 7/7 gateways healthy. Secure SSL handshake established for global CWR/DDEX deliveries.');
    }, 1500);
  };

  const handleExecutePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      setPayoutStatusMessage('Please enter a valid payout amount.');
      return;
    }

    setIsPaying(true);
    setPayoutStatusMessage(null);
    const targetGateway = connections.find(c => c.id === selectedGateway);
    onAddLog(`FINTECH SANDBOX: Initiating direct micro-royalty payout of $${payoutAmount} USD via ${targetGateway?.name} to ${recipientNumber}...`);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.05; // 95% success rate
      const timestamp = new Date().toISOString().replace('T', ' ').substring(11, 19);
      const convertedAmountNgn = (parseFloat(payoutAmount) * 1550).toFixed(2);

      if (isSuccess) {
        const successLog: ApiLog = {
          timestamp,
          api: targetGateway?.name || 'Mobile Money API',
          direction: 'OUT',
          status: 'SUCCESS',
          message: `Direct micro-royalty settlement of $${payoutAmount} USD (~₦${parseFloat(convertedAmountNgn).toLocaleString()} NGN) successfully paid to wallet ${recipientNumber}.`,
          payload: JSON.stringify({
            disbursed_usd: payoutAmount,
            converted_local: `${convertedAmountNgn} NGN`,
            recipient: recipientNumber,
            gateway_id: `MOMO-TX-${Math.floor(100000 + Math.random() * 900000)}`,
            settlement_speed: 'Instant (Mobile-First)',
            cleared_status: 'PAID'
          }, null, 2)
        };
        setLogs(l => [successLog, ...l]);
        setPayoutStatusMessage(`✔ Payout Successful! Sent $${payoutAmount} USD (~₦${parseFloat(convertedAmountNgn).toLocaleString()} NGN) to ${recipientNumber} instantly.`);
        onAddLog(`FINTECH DISBURSEMENT SECURED: Cleared payment via ${targetGateway?.name}. Transaction fully logged on digital ledger.`);
      } else {
        const errorLog: ApiLog = {
          timestamp,
          api: targetGateway?.name || 'Mobile Money API',
          direction: 'OUT',
          status: 'ERROR',
          message: `Carrier timeout during settlement to wallet ${recipientNumber}. Autoretry scheduled.`,
          payload: JSON.stringify({
            error_code: 'GATEWAY_TIMEOUT',
            carrier_reason: 'Mobile network provider socket failure',
            recipient: recipientNumber
          })
        };
        setLogs(l => [errorLog, ...l]);
        setPayoutStatusMessage('❌ Payout failed. Carrier timeout detected. Autoretry protocol queued.');
      }
      setIsPaying(false);
    }, 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="api-dashboard-module">
      {/* Top Banner Overview */}
      <div className="col-span-12 bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-serif font-bold text-base text-sahel-ink flex items-center gap-2 italic">
              <Network className="h-5 w-5 text-sahel-ochre animate-pulse" /> API connections & Integrations Engine
            </h3>
            <p className="text-xs text-sahel-ink/60 mt-0.5">
              Live simulation of the real-world inbound metadata gateways and outbound rights society pipelines that power KnewAfrikaan's sovereign creative infrastructure.
            </p>
          </div>
          <button
            onClick={handlePingAll}
            disabled={isPingingAll}
            className="flex items-center gap-1.5 text-xs font-mono font-bold py-2 px-4 rounded-md transition-all cursor-pointer bg-sahel-ink text-sahel-sand hover:bg-sahel-ochre hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPingingAll ? 'animate-spin' : ''}`} />
            Ping All Connections
          </button>
        </div>
      </div>

      {/* Main Connection Status Section (Full-Width) */}
      <div className="col-span-12 space-y-6">
        <div className="bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-5">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-4">
            <div>
              <h4 className="font-serif font-bold text-sm text-sahel-ink italic flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-sahel-olive" /> API Integration Subsets
              </h4>
              <p className="text-[11px] text-sahel-ink/50 mt-0.5">Sovereign pipelines separated by ingress, egress, and fintech settlement rules.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-sahel-ink/40 mr-1">VIEW:</span>
              <div className="bg-sahel-earth/20 p-1 rounded-lg flex gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('List')}
                  className={`text-[10px] font-mono font-bold py-1 px-2.5 rounded transition-all cursor-pointer ${
                    viewMode === 'List' ? 'bg-white text-sahel-ink shadow-sm' : 'text-sahel-ink/60 hover:text-sahel-ink'
                  }`}
                >
                  Separated Subsets
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('Grid')}
                  className={`text-[10px] font-mono font-bold py-1 px-2.5 rounded transition-all cursor-pointer ${
                    viewMode === 'Grid' ? 'bg-white text-sahel-ink shadow-sm' : 'text-sahel-ink/60 hover:text-sahel-ink'
                  }`}
                >
                  Unified Filter
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'List' ? (
            /* Separated subsets rendering as separate distinct cards */
            <div className="space-y-6">
              {/* Subset 1: Inbound Client Gateways */}
              <div className="space-y-3 bg-white/35 border border-black/5 rounded-xl p-4">
                <div className="flex items-center justify-between border-b border-black/5 pb-1.5">
                  <span className="text-xs font-serif font-bold italic text-sahel-ink flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    1. Inbound Ingestion Gateways
                  </span>
                  <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase font-bold border border-blue-100">
                    {inboundConnections.length} Connection Active
                  </span>
                </div>
                <div className="space-y-3">
                  {inboundConnections.map((conn) => (
                    <div key={conn.id} className="bg-white/50 border border-black/5 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-sahel-earth/40 transition-colors">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-sahel-ink">{conn.name}</span>
                          <span className="text-[9px] font-mono bg-sahel-earth/20 text-sahel-ink/60 px-1.5 py-0.5 rounded">
                            {conn.protocol}
                          </span>
                        </div>
                        <p className="text-[11px] text-sahel-ink/75 leading-normal">{conn.description}</p>
                        <p className="text-[10px] text-sahel-ink/40 font-mono shrink truncate max-w-md">
                          Endpoint: <code className="bg-sahel-earth/10 px-1 py-0.5 rounded text-sahel-clay font-mono">{conn.endpoint}</code>
                        </p>
                      </div>
                      <div className="flex sm:flex-col items-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-sahel-ink/70">{conn.latencyMs}ms</span>
                          <span className="h-2 w-2 rounded-full bg-sahel-olive animate-pulse"></span>
                          <span className="text-[10px] font-mono text-sahel-olive font-bold">Connected</span>
                        </div>
                        <button
                          onClick={() => handlePing(conn.id)}
                          className="text-[10px] font-mono font-bold bg-sahel-earth/40 hover:bg-sahel-ochre hover:text-white py-0.5 px-2 rounded transition-all cursor-pointer"
                        >
                          Test Gateway
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subset 2: Outbound Rights Registries */}
              <div className="space-y-3 bg-white/35 border border-black/5 rounded-xl p-4">
                <div className="flex items-center justify-between border-b border-black/5 pb-1.5">
                  <span className="text-xs font-serif font-bold italic text-sahel-ink flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sahel-ochre"></span>
                    2. Outbound Rights Registries & Societies
                  </span>
                  <span className="text-[10px] font-mono text-sahel-ochre bg-sahel-ochre/10 px-1.5 py-0.5 rounded uppercase font-bold border border-sahel-ochre/20">
                    {outboundConnections.length} Connections Active
                  </span>
                </div>
                <div className="space-y-3">
                  {outboundConnections.map((conn) => (
                    <div key={conn.id} className="bg-white/50 border border-black/5 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-sahel-earth/40 transition-colors">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-sahel-ink">{conn.name}</span>
                          <span className="text-[9px] font-mono bg-sahel-earth/20 text-sahel-ink/60 px-1.5 py-0.5 rounded">
                            {conn.protocol}
                          </span>
                        </div>
                        <p className="text-[11px] text-sahel-ink/75 leading-normal">{conn.description}</p>
                        <p className="text-[10px] text-sahel-ink/40 font-mono shrink truncate max-w-md">
                          Endpoint: <code className="bg-sahel-earth/10 px-1 py-0.5 rounded text-sahel-clay font-mono">{conn.endpoint}</code>
                        </p>
                      </div>
                      <div className="flex sm:flex-col items-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-sahel-ink/70">{conn.latencyMs}ms</span>
                          <span className="h-2 w-2 rounded-full bg-sahel-olive animate-pulse"></span>
                          <span className="text-[10px] font-mono text-sahel-olive font-bold">Connected</span>
                        </div>
                        <button
                          onClick={() => handlePing(conn.id)}
                          className="text-[10px] font-mono font-bold bg-sahel-earth/40 hover:bg-sahel-ochre hover:text-white py-0.5 px-2 rounded transition-all cursor-pointer"
                        >
                          Test Socket
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subset 3: Fintech Payment Rail Settlements */}
              <div className="space-y-3 bg-white/35 border border-black/5 rounded-xl p-4">
                <div className="flex items-center justify-between border-b border-black/5 pb-1.5">
                  <span className="text-xs font-serif font-bold italic text-sahel-ink flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sahel-olive"></span>
                    3. Fintech Payment Rail Settlements (Disbursements)
                  </span>
                  <span className="text-[10px] font-mono text-sahel-olive bg-sahel-olive/10 px-1.5 py-0.5 rounded uppercase font-bold border border-sahel-olive/20">
                    {financialConnections.length} Channels Active
                  </span>
                </div>
                <div className="space-y-3">
                  {financialConnections.map((conn) => (
                    <div key={conn.id} className="bg-white/50 border border-black/5 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-sahel-earth/40 transition-colors">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-sahel-ink">{conn.name}</span>
                          <span className="text-[9px] font-mono bg-sahel-earth/20 text-sahel-ink/60 px-1.5 py-0.5 rounded">
                            {conn.protocol}
                          </span>
                        </div>
                        <p className="text-[11px] text-sahel-ink/75 leading-normal">{conn.description}</p>
                        <p className="text-[10px] text-sahel-ink/40 font-mono shrink truncate max-w-md">
                          Endpoint: <code className="bg-sahel-earth/10 px-1 py-0.5 rounded text-sahel-clay font-mono">{conn.endpoint}</code>
                        </p>
                      </div>
                      <div className="flex sm:flex-col items-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-sahel-ink/70">{conn.latencyMs}ms</span>
                          <span className="h-2 w-2 rounded-full bg-sahel-olive animate-pulse"></span>
                          <span className="text-[10px] font-mono text-sahel-olive font-bold">Connected</span>
                        </div>
                        <button
                          onClick={() => handlePing(conn.id)}
                          className="text-[10px] font-mono font-bold bg-sahel-earth/40 hover:bg-sahel-ochre hover:text-white py-0.5 px-2 rounded transition-all cursor-pointer"
                        >
                          Test Payment Rail
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Unified state tab layout */
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 border-b border-black/5 pb-3">
                {(['All', 'Inbound', 'Outbound', 'Financial'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveSubset(type)}
                    className={`text-xs font-mono font-bold py-1 px-3 rounded-full cursor-pointer transition-all ${
                      activeSubset === type 
                        ? 'bg-sahel-ochre text-white' 
                        : 'bg-sahel-earth/20 text-sahel-ink/70 hover:bg-sahel-earth/30'
                    }`}
                  >
                    {type === 'All' ? 'All (7)' : type === 'Inbound' ? 'Inbound (1)' : type === 'Outbound' ? 'Outbound (4)' : 'Fintech (2)'}
                  </button>
                ))}
              </div>

              <div className="space-y-3.5">
                {filteredConnections.map((conn) => (
                  <div key={conn.id} className="bg-white/40 border border-black/5 rounded-lg p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-sahel-earth/40 transition-colors">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-sahel-ink">{conn.name}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border ${
                          conn.type === 'Inbound' 
                            ? 'bg-blue-50 border-blue-200 text-blue-600' 
                            : conn.type === 'Financial' 
                            ? 'bg-sahel-olive/10 border-sahel-olive/20 text-sahel-olive' 
                            : 'bg-sahel-ochre/10 border-sahel-ochre/20 text-sahel-ochre'
                        }`}>
                          {conn.type}
                        </span>
                        <span className="text-[9px] font-mono bg-sahel-earth/20 text-sahel-ink/60 px-1.5 py-0.5 rounded">
                          {conn.protocol}
                        </span>
                      </div>
                      <p className="text-[11px] text-sahel-ink/70 leading-normal">{conn.description}</p>
                      <p className="text-[10px] text-sahel-ink/40 font-mono shrink truncate max-w-md">
                        Endpoint: <code className="bg-sahel-earth/10 px-1 py-0.5 rounded text-sahel-clay font-mono">{conn.endpoint}</code>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end gap-3 sm:gap-1.5 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-sahel-ink/70">{conn.latencyMs}ms</span>
                        <span className="h-2 w-2 rounded-full bg-sahel-olive animate-pulse"></span>
                        <span className="text-[10px] font-mono uppercase text-sahel-olive font-bold">Connected</span>
                      </div>
                      <div className="flex justify-between items-center w-full sm:justify-end gap-2">
                        <span className="text-[9px] text-sahel-ink/50 font-mono">Synced: {conn.lastSync.substring(11, 19)}</span>
                        <button
                          onClick={() => handlePing(conn.id)}
                          className="text-[10px] font-mono font-bold bg-sahel-earth/40 hover:bg-sahel-ochre hover:text-white py-1 px-2 rounded transition-all cursor-pointer"
                        >
                          Test Connection
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live API Traffic & Handshake Monitor Section */}
      <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        {/* Webhook Senders / Simulator Panel */}
        <div className="lg:col-span-4 bg-white/60 border border-black/5 rounded-xl p-5 shadow-sm space-y-5">
          <div className="border-b border-black/5 pb-2">
            <h4 className="font-serif font-bold text-sm text-sahel-ink italic flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-sahel-ochre animate-pulse" /> Live Telemetry Senders
            </h4>
            <p className="text-[11px] text-sahel-ink/60">Generate simulated inbound & outbound API packet webhooks to test filters and inspection pipelines.</p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSimulateWebhook}
              className="w-full text-xs font-mono font-bold py-2.5 px-4 bg-sahel-ochre hover:bg-sahel-earth text-white rounded transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="h-3.5 w-3.5" />
              Simulate Live Webhook Packet
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportLogs}
                className="flex-1 text-[11px] font-mono font-bold py-2 px-3 border border-sahel-earth hover:bg-sahel-earth/10 text-sahel-ink rounded transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Download className="h-3 w-3" />
                Export JSON
              </button>
              <button
                type="button"
                onClick={handleClearLogs}
                className="flex-1 text-[11px] font-mono font-bold py-2 px-3 border border-sahel-clay/30 hover:bg-sahel-clay/10 text-sahel-clay rounded transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Clear Console
              </button>
            </div>
          </div>

          {/* API Specs Checklist */}
          <div className="pt-2 border-t border-black/5 space-y-2">
            <span className="block text-[10px] font-mono text-sahel-ink/50 uppercase tracking-wide">Supported Specifications:</span>
            <div className="space-y-1.5 text-[11px] text-sahel-ink/80 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                <span>DDEX ERN XML / JSON stream</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sahel-ochre"></span>
                <span>CWR v2.1 / v3.0 Society format</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sahel-olive"></span>
                <span>ISO 20022 Fintech messages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Console logs viewport Panel */}
        <div className="lg:col-span-8 bg-sahel-ink text-sahel-sand/90 rounded-xl p-5 border border-black/15 shadow-sm space-y-4 flex flex-col min-h-[480px]">
          {/* Filter controls bar inside console */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h4 className="font-mono text-xs font-bold text-sahel-ochre uppercase flex items-center gap-1.5 tracking-wider">
                <Terminal className="h-4.5 w-4.5 text-sahel-ochre animate-pulse" /> Live API Handshake & Traffic Monitor
              </h4>
              <p className="text-[10px] text-sahel-sand/50 font-sans">Filtered output: {filteredLogs.length} metadata packets matched</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value as any)}
                className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 rounded px-2 py-1 text-sahel-sand/90 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sahel-ochre"
              >
                <option value="ALL" className="bg-sahel-ink">DIR: ALL</option>
                <option value="IN" className="bg-sahel-ink">DIR: INBOUND</option>
                <option value="OUT" className="bg-sahel-ink">DIR: OUTBOUND</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 rounded px-2 py-1 text-sahel-sand/90 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sahel-ochre"
              >
                <option value="ALL" className="bg-sahel-ink">STATUS: ALL</option>
                <option value="SUCCESS" className="bg-sahel-ink">STATUS: OK</option>
                <option value="ERROR" className="bg-sahel-ink">STATUS: ERR</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-sahel-sand/40" />
            <input
              type="text"
              placeholder="Search packet logs by society name, API endpoint or response text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-mono bg-white/5 border border-white/10 rounded pl-9 pr-3 py-2 text-sahel-sand/95 focus:outline-none focus:ring-1 focus:ring-sahel-ochre placeholder-sahel-sand/30"
            />
          </div>

          {/* Console logs viewport */}
          <div className="space-y-3.5 overflow-y-auto flex-1 max-h-[380px] pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-sahel-sand/30 font-mono py-12 text-center space-y-2">
                <Radio className="h-8 w-8 text-sahel-sand/20 animate-pulse" />
                <p className="text-xs">No matching API telemetry traffic found.</p>
              </div>
            ) : (
              filteredLogs.map((log, index) => {
                const logKey = log.timestamp + '-' + index;
                const isExpanded = expandedLogId === logKey;
                return (
                  <div 
                    key={logKey} 
                    className={`text-[11px] font-mono border-b border-white/5 pb-3 last:border-b-0 last:pb-0 transition-all ${
                      isExpanded ? 'bg-white/[0.02] -mx-2 px-2 py-2 rounded border border-white/10 border-b' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sahel-ochre font-bold">[{log.timestamp}]</span>
                        <span className="text-white font-semibold">{log.api}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`px-1.5 py-0.2 rounded font-black text-[9px] uppercase ${
                          log.direction === 'IN' ? 'bg-blue-900/60 text-blue-200 border border-blue-800' : 'bg-amber-900/60 text-amber-200 border border-amber-800'
                        }`}>
                          {log.direction}
                        </span>
                        <span className={`flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          log.status === 'SUCCESS' ? 'bg-sahel-olive/20 text-sahel-olive' : 'bg-sahel-clay/20 text-sahel-clay'
                        }`}>
                          {log.status === 'SUCCESS' ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                          {log.status === 'SUCCESS' ? 'OK' : 'ERR'}
                        </span>
                      </div>
                    </div>

                    <p className="text-sahel-sand/85 font-sans leading-relaxed mt-0.5">{log.message}</p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] text-sahel-sand/40 font-mono select-none">
                        Payload size: ~{new Blob([log.payload]).size} bytes
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedLogId(isExpanded ? null : logKey)}
                        className="text-[9.5px] font-mono hover:text-sahel-ochre text-sahel-sand/60 transition-all underline cursor-pointer flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        {isExpanded ? 'Hide Payload Hex' : 'Inspect JSON Payload'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-2.5 bg-black/60 rounded p-3 text-[10px] text-teal-300 font-mono select-all overflow-x-auto whitespace-pre-wrap border border-white/5 max-h-[180px] shadow-inner">
                        {log.payload}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
