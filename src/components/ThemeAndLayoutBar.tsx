import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  LayoutGrid,
  Activity,
  Palette,
  Search,
  Sparkles,
  Flame,
  Shield,
  User,
  Award,
  Briefcase,
  ChevronDown,
  X,
  PlusCircle,
  Smartphone,
  FileCheck,
  LayoutDashboard,
  Database,
  ShoppingBag,
  Scale,
  GraduationCap,
  Network,
  Layers,
  Compass,
  Check
} from 'lucide-react';

export type LayoutMode = 'bento' | 'telemetry';
export type ThemeMode = 'obsidian';

interface ThemeAndLayoutBarProps {
  layoutMode: LayoutMode;
  onChangeLayoutMode: (mode: LayoutMode) => void;
  themeMode: ThemeMode;
  onChangeThemeMode?: (theme: ThemeMode) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickAction: (action: string) => void;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

const ROLES: { role: UserRole; name: string; icon: any }[] = [
  { role: 'Independent Artist', name: 'ClassiQ', icon: User },
  { role: 'Master Producer', name: 'Geekbeatz', icon: Award },
  { role: 'Rights Administrator', name: 'Bello Idris', icon: Shield },
  { role: 'Talent Manager', name: 'Arewa MGMT', icon: Briefcase },
];

const INTEGRATED_MODULES = [
  { id: 'overview', name: 'Overview & Metrics', category: 'Rights & Catalog Engine', icon: LayoutDashboard },
  { id: 'ingestion', name: 'Dual Ingestion Hub', category: 'Rights & Catalog Engine', icon: Database },
  { id: 'lookback', name: 'Look-Back Recovery Engine', category: 'Rights & Catalog Engine', icon: Search },
  { id: 'licensing', name: 'Micro-Licensing Portal', category: 'Monetization & Royalty', icon: ShoppingBag },
  { id: 'equity', name: 'Shared-Equity Lab', category: 'Monetization & Royalty', icon: Scale },
  { id: 'fintech_sandbox', name: 'Fintech Mobile Money', category: 'Monetization & Royalty', icon: Smartphone },
  { id: 'incubator', name: 'Sahel Incubator Hub', category: 'Ecosystem & Developer', icon: GraduationCap },
  { id: 'connections', name: 'API Sockets & Traffic', category: 'Ecosystem & Developer', icon: Network },
];

export default function ThemeAndLayoutBar({
  layoutMode,
  onChangeLayoutMode,
  themeMode,
  currentRole,
  onChangeRole,
  searchQuery,
  onSearchChange,
  onQuickAction,
  activeTab = 'overview',
  onSelectTab,
}: ThemeAndLayoutBarProps) {
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [showQuickActions, setShowQuickActions] = useState<boolean>(false);

  return (
    <div className="bg-[#181614]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 sticky top-0 z-40 text-[#f2e9de] shadow-md transition-all">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sahel-ochre/20 text-sahel-ochre border border-sahel-ochre/30 rounded-xl flex items-center justify-center shadow-xs">
              <Flame className="h-5 w-5 fill-current animate-pulse text-sahel-ochre" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-sahel-ochre">
                KnewAfrikaan
              </span>
              <h1 className="font-serif font-black text-sm text-[#f2e9de] leading-none">
                Creative Infrastructure
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-sahel-ochre font-bold">
              Obsidian Dark
            </span>
          </div>
        </div>

        {/* Global Search, Quick Action, Persona Selector & Obsidian Indicator */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Global Search Bar */}
          <div className="relative flex-1 md:w-56 min-w-[180px]">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tracks, claims, acts..."
              className="w-full bg-[#23201d] border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs font-mono text-[#f2e9de] placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-sahel-ochre"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Quick Actions Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="bg-sahel-ochre text-sahel-sand px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-sahel-clay transition-all cursor-pointer border border-sahel-ochre/30"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quick Action</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {showQuickActions && (
              <div className="absolute right-0 mt-2 w-52 bg-[#23201d] border border-white/15 rounded-xl shadow-2xl p-2 z-50 font-mono text-xs space-y-1">
                <button
                  onClick={() => {
                    onQuickAction('ingest');
                    setShowQuickActions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg flex items-center gap-2 text-[#f2e9de]"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-sahel-ochre" />
                  <span>Ingest Master Track</span>
                </button>

                <button
                  onClick={() => {
                    onQuickAction('scan');
                    setShowQuickActions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg flex items-center gap-2 text-[#f2e9de]"
                >
                  <Search className="h-3.5 w-3.5 text-sahel-olive" />
                  <span>Run Black-Box Scan</span>
                </button>

                <button
                  onClick={() => {
                    onQuickAction('fintech');
                    setShowQuickActions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg flex items-center gap-2 text-[#f2e9de]"
                >
                  <Smartphone className="h-3.5 w-3.5 text-sahel-clay" />
                  <span>Mobile Money Payout</span>
                </button>

                <button
                  onClick={() => {
                    onQuickAction('cwr');
                    setShowQuickActions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg flex items-center gap-2 text-[#f2e9de]"
                >
                  <FileCheck className="h-3.5 w-3.5 text-[#f2e9de]" />
                  <span>Export CWR Split File</span>
                </button>
              </div>
            )}
          </div>

          {/* Persona / User Role Selector */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="bg-[#23201d] hover:bg-[#2e2a26] border border-white/15 px-3 py-1.5 rounded-xl font-mono text-xs text-[#f2e9de] font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all"
              title="Active User Persona"
            >
              <Sparkles className="h-3.5 w-3.5 text-sahel-ochre" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                Persona: <strong className="text-sahel-ochre">{currentRole}</strong>
              </span>
              <ChevronDown className="h-3 w-3 text-white/50" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#23201d] border border-white/15 rounded-xl shadow-2xl p-2 z-50 font-mono text-xs space-y-1">
                <div className="text-[10px] font-bold uppercase text-white/40 px-3 py-1 border-b border-white/5 mb-1 flex items-center justify-between">
                  <span>Switch Access Persona</span>
                  <span className="text-sahel-ochre">4 Roles</span>
                </div>
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isCurrent = currentRole === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        onChangeRole(r.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-sahel-ochre/25 text-white font-bold border border-sahel-ochre/40'
                          : 'hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-sahel-ochre shrink-0" />
                        <div>
                          <div className="font-bold text-[#f2e9de]">{r.role}</div>
                          <div className="text-[10px] text-white/50 font-sans">{r.name}</div>
                        </div>
                      </div>
                      {isCurrent && <Check className="h-3.5 w-3.5 text-sahel-ochre shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Locked Obsidian Theme Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#23201d] border border-white/10 px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold text-sahel-ochre">
            <span className="h-2 w-2 rounded-full bg-sahel-ochre animate-pulse"></span>
            <span>Obsidian Dark Mode</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Integrated Module Navigation Tabs */}
      <div className="max-w-[1700px] mx-auto border-t border-white/10 pt-2.5 mt-2.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max pb-0.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sahel-ochre flex items-center gap-1.5 shrink-0 mr-1 bg-sahel-ochre/15 px-2.5 py-1.5 rounded-xl border border-sahel-ochre/30">
            <Compass className="h-3.5 w-3.5 text-sahel-ochre" />
            Modules:
          </span>

          {INTEGRATED_MODULES.map((mod) => {
            const IconComponent = mod.icon;
            const isActive = activeTab === mod.id;

            return (
              <button
                key={mod.id}
                onClick={() => onSelectTab && onSelectTab(mod.id)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-sahel-ochre text-sahel-sand border-sahel-ochre shadow-md'
                    : 'bg-[#23201d] hover:bg-[#2a2622] text-white/70 hover:text-white border-white/10 hover:border-white/20'
                }`}
                title={`${mod.category}: ${mod.name}`}
              >
                <IconComponent className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-sahel-sand' : 'text-sahel-ochre'}`} />
                <span>{mod.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
