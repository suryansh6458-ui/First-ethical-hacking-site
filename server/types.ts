export type LineType = 
  | 'mobile' 
  | 'fixed_line' 
  | 'voip' 
  | 'toll_free' 
  | 'premium_rate' 
  | 'shared_cost' 
  | 'pager' 
  | 'uan' 
  | 'voicemail' 
  | 'unknown';

export type MatchConfidence = 'confirmed' | 'probable' | 'unverified';

export interface TelecomMetadata {
  e164: string;
  maskedE164: string;
  nationalNumber: string;
  internationalNumber: string;
  country: string;
  countryIso: string;
  dialCode: string;
  lineType: LineType;
  lineTypeLabel: string;
  carrier: string;
  timezones: string[];
  isValid: boolean;
  isPossible: boolean;
  activityEstimate: 'likely_active' | 'reachable' | 'unconfirmed' | 'invalid_range';
}

export interface WebReferenceFinding {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  matchType: 'exact' | 'partial' | 'directory_entry';
  firstSeen?: string;
  category: 'business_directory' | 'corporate_site' | 'public_forum' | 'data_broker' | 'news_media' | 'social_network' | 'public_registry';
}

export interface EmailAssociationFinding {
  id: string;
  email: string;
  domain: string;
  sourceUrl: string;
  sourceTitle: string;
  evidence: string;
  confidence: MatchConfidence;
  discoveredDate: string;
  isCorporate: boolean;
}

export interface SocialProfileFinding {
  id: string;
  platform: string;
  profileUrl: string;
  handle: string;
  displayName?: string;
  associationEvidence: string;
  confidence: MatchConfidence;
  profileType: 'public_directory' | 'verified_business' | 'public_post' | 'unconfirmed_mention';
  timestamp: string;
  authPossessionNotice: string;
}

export interface ProviderStatus {
  id: string;
  name: string;
  category: 'telecom' | 'search_grounding' | 'ip_intelligence' | 'data_broker' | 'email_verifier';
  status: 'active' | 'not_configured' | 'rate_limited' | 'error';
  isBuiltIn: boolean;
  description: string;
  configInstruction?: string;
}

export interface SourceExecutionLog {
  providerId: string;
  name: string;
  queriedAt: string;
  durationMs: number;
  status: 'succeeded' | 'no_results' | 'skipped' | 'failed' | 'not_configured';
  message: string;
  findingsCount: number;
}

export interface FootprintReport {
  reportId: string;
  targetMasked: string;
  rawInput: string;
  generatedAt: string;
  consentGranted: boolean;
  telecom: TelecomMetadata;
  webReferences: WebReferenceFinding[];
  emailAssociations: EmailAssociationFinding[];
  socialProfiles: SocialProfileFinding[];
  sourcesLog: SourceExecutionLog[];
  overallRiskRating: 'minimal' | 'low' | 'moderate' | 'elevated' | 'high';
  riskFactors: {
    factor: string;
    level: 'low' | 'moderate' | 'high';
    description: string;
  }[];
  optOutChecklist: {
    serviceName: string;
    category: string;
    optOutUrl: string;
    instructions: string;
    recommended: boolean;
  }[];
  remediationAdvice: string[];
  limitationsStatement: string;
}

export interface IPAnalysisResult {
  ip: string;
  isIpv4: boolean;
  isPrivate: boolean;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  isp?: string;
  asn?: string;
  organization?: string;
  lookupSource: string;
  queriedAt: string;
  networkExplanation: {
    type: 'public_gateway' | 'private_lan' | 'cgnat_carrier';
    definition: string;
    whyPhoneDoesNotExposeLiveIp: string;
  };
}
