export type UserRole = 'Independent Artist' | 'Master Producer' | 'Rights Administrator' | 'Talent Manager';

export interface ContributorSplit {
  name: string;
  shareSplit: number; // percentage (e.g., 50 for 50%)
  role: 'Songwriter' | 'Composer' | 'Producer' | 'Arranger';
  ipi?: string; // Interested Parties Information identifier
  verified: boolean;
}

export interface MasterRights {
  recordingTitle: string;
  primaryArtists: string[];
  masterProducer: string;
  isrc: string; // International Standard Recording Code
  labelOwner: string;
  format: 'Dolby Atmos' | 'Stereo WAV' | 'Stems';
  fileSize: string;
  ingestionDate: string;
}

export interface PublishingRights {
  compositionTitle: string;
  songwriters: ContributorSplit[];
  publisher: string;
  iswc: string; // International Standard Musical Work Code
  registrationStatus: 'Pending' | 'CWR_Exported' | 'Registered';
  shareSplitsApproved: boolean;
}

export interface RegionalTags {
  language: string; // e.g., 'Hausa', 'Fulfulde', 'Kanuri', 'Tamasheq'
  dialect?: string; // e.g., 'Arewa', 'Kano', 'Zaria'
  region: string; // e.g., 'Jos', 'Kano', 'Niamey', 'N'Djamena'
}

export interface SolarSyncStatus {
  synced: boolean;
  syncTimestamp?: string;
  cachedLocally: boolean;
  queuePriority: 'High' | 'Medium' | 'Low';
}

export interface TrackAsset {
  id: string;
  status: 'Ingesting' | 'Local Cache' | 'Synced' | 'CWR Generated' | 'Fully Registered';
  master: MasterRights;
  publishing: PublishingRights;
  regionalTags: RegionalTags;
  solarSync: SolarSyncStatus;
}

// Look-Back Engine legacy item
export interface LegacyCatalogItem {
  id: string;
  legacyTitle: string;
  originalArtist: string;
  releaseYear: string;
  estimatedUnclaimedRoyalty: number;
  unclaimedSources: string[]; // e.g., ["The MLC", "SoundExchange", "MCSN"]
  claimStatus: 'Unclaimed' | 'Scanning' | 'Conflict' | 'LOD_Required' | 'LOD_Signed' | 'Submitted' | 'Recovered';
  contributors: { name: string; role: string; split: number; approved: boolean }[];
  legacyIsrc?: string;
  lodDocumentUrl?: string;
}

// Sahel Beats incubator structure
export interface LearningModule {
  id: string;
  title: string;
  category: 'IP Law' | 'Digital Literacy' | 'Financial Planning' | 'Production Standards';
  description: string;
  completed: boolean;
  score?: number;
  durationMinutes: number;
}

export interface CohortArtist {
  id: string;
  name: string;
  stageName: string;
  primaryDialect: string;
  location: string;
  milestonesCompleted: number; // out of total modules
  totalRegisteredTracks: number;
  totalRoyaltiesRecovered: number;
  payoutStatus: 'Up-to-Date' | 'Pending Review' | 'Approved';
  pendingPayoutAmount: number;
}


