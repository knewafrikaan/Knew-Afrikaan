import React, { useState, useEffect, useRef } from 'react';
import { UserRole, TrackAsset, LegacyCatalogItem, LearningModule, CohortArtist } from './types';
import {
  INITIAL_TRACKS,
  INITIAL_LEGACY_CATALOG,
  LEARNING_MODULES,
  COHORT_ARTISTS
} from './data/mockData';

// Subcomponents
import ThemeAndLayoutBar, { LayoutMode, ThemeMode } from './components/ThemeAndLayoutBar';
import BentoDashboardView from './components/BentoDashboardView';
import TelemetryView from './components/TelemetryView';
import OverviewSection from './components/OverviewSection';
import IngestionHub from './components/IngestionHub';
import LookBackEngine from './components/LookBackEngine';
import MicroLicensing from './components/MicroLicensing';
import SharedEquityLab from './components/SharedEquityLab';
import IncubatorPortal from './components/IncubatorPortal';
import ApiConnectionsDashboard from './components/ApiConnectionsDashboard';
import FintechSandboxDashboard from './components/FintechSandboxDashboard';
import AudioPlayerDock from './components/AudioPlayerDock';

// Icons
import {
  LayoutDashboard,
  Database,
  Search,
  ShoppingBag,
  Scale,
  GraduationCap,
  Terminal,
  Cpu,
  Flame,
  Globe,
  Clock,
  Network,
  Smartphone,
  ShieldCheck,
  Coins,
  Layers,
  ChevronRight
} from 'lucide-react';

const MODULE_SUITES = [
  {
    suiteName: 'Rights & Catalog Engine',
    items: [
      { id: 'overview', name: 'Overview & Metrics', icon: LayoutDashboard },
      { id: 'ingestion', name: 'Dual Ingestion Hub', icon: Database },
      { id: 'lookback', name: 'Look-Back Recovery', icon: Search },
    ],
  },
  {
    suiteName: 'Monetization & Royalty',
    items: [
      { id: 'licensing', name: 'Micro-Licensing Portal', icon: ShoppingBag },
      { id: 'equity', name: 'Shared-Equity Lab', icon: Scale },
      { id: 'fintech_sandbox', name: 'Fintech Mobile Money', icon: Smartphone },
    ],
  },
  {
    suiteName: 'Ecosystem & Developer',
    items: [
      { id: 'incubator', name: 'Sahel Incubator Hub', icon: GraduationCap },
      { id: 'connections', name: 'API Sockets & Traffic', icon: Network },
    ],
  },
];

export default function App() {
  // Centralized Stateful Stores
  const [currentRole, setCurrentRole] = useState<UserRole>('Independent Artist');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('bento');
  const [themeMode, setThemeMode] = useState<ThemeMode>('obsidian');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTrackId, setActiveTrackId] = useState<string | null>('TRK-001');

  const [tracks, setTracks] = useState<TrackAsset[]>(INITIAL_TRACKS);
  const [legacyItems, setLegacyItems] = useState<LegacyCatalogItem[]>(INITIAL_LEGACY_CATALOG);
  const [cohortArtists, setCohortArtists] = useState<CohortArtist[]>(COHORT_ARTISTS);

  // Terminal log console states
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toISOString().substring(11, 19)}] SYSTEM BOOT: KnewAfrikaan Creative Infrastructure SaaS initialized.`,
    `[${new Date().toISOString().substring(11, 19)}] PRO CHANNELS: SoundExchange, MLC, Songtrust, and MCSN sockets [READY].`
  ]);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Helper to add lines to terminal logs
  const addLogLine = (message: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setTerminalLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // Scroll logs to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    addLogLine(`ACCESS MATRIX: Shifted session context to role: "${role}". Updating authorized visual structures.`);
  };

  const handleAddTrack = (newTrack: TrackAsset) => {
    setTracks((prev) => [newTrack, ...prev]);
    setActiveTrackId(newTrack.id);
    addLogLine(`INGESTION HUB: Ingested new Sound Recording "${newTrack.master.recordingTitle}". Local ISRC: ${newTrack.master.isrc}. Status: ${newTrack.status}.`);
  };

  const handleUpdateLegacyItem = (updatedItem: LegacyCatalogItem) => {
    setLegacyItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleUpdateCohortArtist = (updatedArtist: CohortArtist) => {
    setCohortArtists((prev) => prev.map((artist) => (artist.id === updatedArtist.id ? updatedArtist : artist)));
  };

  const handleQuickAction = (action: string) => {
    if (action === 'ingest') {
      setActiveTab('ingestion');
      setLayoutMode('bento');
      addLogLine('QUICK ACTION: Navigated to Dual Ingestion Hub.');
    } else if (action === 'scan') {
      setActiveTab('lookback');
      setLayoutMode('bento');
      addLogLine('QUICK ACTION: Launched Black-Box Recovery Scan.');
    } else if (action === 'fintech') {
      setActiveTab('fintech_sandbox');
      setLayoutMode('bento');
      addLogLine('QUICK ACTION: Opened Mobile Money Payout Console.');
    } else if (action === 'cwr') {
      setLayoutMode('telemetry');
      addLogLine('QUICK ACTION: Exported CWR Flatfile Inspection.');
    }
  };

  // Dedicated Obsidian Dark Theme Classes
  const themeClasses = 'bg-[#121110] text-[#f2e9de] dark-theme';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-sahel-ochre/30 selection:text-white ${themeClasses}`}>
      {/* Top Header & Navigation Bar */}
      <ThemeAndLayoutBar
        layoutMode={layoutMode}
        onChangeLayoutMode={(mode) => {
          setLayoutMode(mode);
          addLogLine(`LAYOUT ENGINE: Switched display architecture to mode: "${mode.toUpperCase()}".`);
        }}
        themeMode={themeMode}
        onChangeThemeMode={(theme) => {
          setThemeMode(theme);
          addLogLine(`THEME ENGINE: Theme fixed to Obsidian Dark.`);
        }}
        currentRole={currentRole}
        onChangeRole={handleRoleChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickAction={handleQuickAction}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setLayoutMode('bento');
          addLogLine(`MODULE NAV: Switched active module to "${tab}".`);
        }}
      />

      {/* Primary Workspace Stage depending on Layout Mode */}
      <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1700px] w-full mx-auto pb-24">
        {/* LAYOUT 1: Bento Command Center View */}
        {layoutMode === 'bento' && (
          <div className="space-y-6">
            {activeTab === 'overview' ? (
              <BentoDashboardView
                tracks={tracks}
                legacyItems={legacyItems}
                cohortArtists={cohortArtists}
                currentRole={currentRole}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                }}
                onPlayTrack={(trackId) => setActiveTrackId(trackId)}
                onAddLog={addLogLine}
              />
            ) : (
              <div className="space-y-6">
                {/* Sub-module Return Header Banner */}
                <div className="bg-[#181614] border border-white/10 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="px-3.5 py-1.5 bg-sahel-ochre text-sahel-sand hover:bg-sahel-clay rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-sahel-ochre/30"
                    >
                      <span>← Return to Overview</span>
                    </button>

                    <div className="hidden sm:block h-4 w-px bg-white/10"></div>

                    <span className="text-xs font-mono font-bold uppercase text-sahel-ochre">
                      Active Module: <span className="text-[#f2e9de]">{activeTab.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <span className="text-xs font-mono text-white/60 bg-[#23201d] px-3 py-1 rounded-xl border border-white/10 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-sahel-ochre"></span>
                    Persona: <strong className="text-[#f2e9de]">{currentRole}</strong>
                  </span>
                </div>

                <div className="bg-[#181614]/80 border border-white/10 rounded-2xl p-4 shadow-sm">
                  {activeTab === 'ingestion' && <IngestionHub tracks={tracks} onAddTrack={handleAddTrack} />}
                  {activeTab === 'connections' && <ApiConnectionsDashboard onAddLog={addLogLine} />}
                  {activeTab === 'fintech_sandbox' && <FintechSandboxDashboard onAddLog={addLogLine} />}
                  {activeTab === 'lookback' && (
                    <LookBackEngine
                      legacyItems={legacyItems}
                      onUpdateLegacyItem={handleUpdateLegacyItem}
                      onAddLog={addLogLine}
                    />
                  )}
                  {activeTab === 'licensing' && <MicroLicensing tracks={tracks} onAddLog={addLogLine} />}
                  {activeTab === 'equity' && <SharedEquityLab onAddLog={addLogLine} />}
                  {activeTab === 'incubator' && (
                    <IncubatorPortal
                      tracks={tracks}
                      learningModules={LEARNING_MODULES}
                      cohortArtists={cohortArtists}
                      currentRole={currentRole}
                      onUpdateCohortArtist={handleUpdateCohortArtist}
                      onAddLog={addLogLine}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LAYOUT 2: Full-Screen Telemetry Monitor View */}
        {layoutMode === 'telemetry' && (
          <TelemetryView
            tracks={tracks}
            legacyItems={legacyItems}
            terminalLogs={terminalLogs}
            onAddLog={addLogLine}
          />
        )}
      </main>

      {/* Floating Audio Player Dock */}
      <AudioPlayerDock
        tracks={tracks}
        activeTrackId={activeTrackId}
        onSelectTrack={(id) => setActiveTrackId(id)}
      />
    </div>
  );
}
