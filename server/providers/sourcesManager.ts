import { ProviderStatus, SourceExecutionLog, WebReferenceFinding, EmailAssociationFinding, SocialProfileFinding } from '../types.js';

export function getProviderCatalog(): ProviderStatus[] {
  return [
    {
      id: 'telecom_e164',
      name: 'ITU-T E.164 Telecom Registry',
      category: 'telecom',
      status: 'active',
      isBuiltIn: true,
      description: 'Standard ITU-T RFC 3966 phone formatting, country validation, and carrier plan heuristics for 240+ countries.',
    },
    {
      id: 'gemini_grounding',
      name: 'Gemini Search Grounding Engine',
      category: 'search_grounding',
      status: process.env.GEMINI_API_KEY ? 'active' : 'not_configured',
      isBuiltIn: true,
      description: 'Real-time Google Search grounding using Gemini 3.8 Flash to harvest publicly indexed telephone mentions.',
      configInstruction: 'Configured via AI Studio Secrets (GEMINI_API_KEY).',
    },
    {
      id: 'ip_intel',
      name: 'Public IP & ASN Intelligence',
      category: 'ip_intelligence',
      status: 'active',
      isBuiltIn: true,
      description: 'Autonomous System Number (ASN), ISP metadata, and Mobile CGNAT vs. Public IP classification.',
    },
    {
      id: 'numverify',
      name: 'Numverify Telecom API',
      category: 'telecom',
      status: process.env.NUMVERIFY_API_KEY ? 'active' : 'not_configured',
      isBuiltIn: false,
      description: 'Secondary line-type and direct mobile network operator (MNO) database lookup.',
      configInstruction: 'Set NUMVERIFY_API_KEY in environment variables.',
    },
    {
      id: 'serpapi',
      name: 'SerpApi Web Engine',
      category: 'search_grounding',
      status: process.env.SERPAPI_API_KEY ? 'active' : 'not_configured',
      isBuiltIn: false,
      description: 'Dedicated search API scraping raw Google/Bing SERPs for exact unquoted and quoted string hits.',
      configInstruction: 'Set SERPAPI_API_KEY in environment variables.',
    },
    {
      id: 'ipinfo',
      name: 'IPinfo Commercial Data',
      category: 'ip_intelligence',
      status: process.env.IPINFO_TOKEN ? 'active' : 'not_configured',
      isBuiltIn: false,
      description: 'Commercial enterprise ASN, company, and carrier transit network enrichment.',
      configInstruction: 'Set IPINFO_TOKEN in environment variables.',
    },
  ];
}

export function evaluateFootprintRisk(
  webReferences: WebReferenceFinding[],
  emailAssociations: EmailAssociationFinding[],
  socialProfiles: SocialProfileFinding[]
): {
  rating: 'minimal' | 'low' | 'moderate' | 'elevated' | 'high';
  factors: Array<{ factor: string; level: 'low' | 'moderate' | 'high'; description: string }>;
} {
  const factors: Array<{ factor: string; level: 'low' | 'moderate' | 'high'; description: string }> = [];

  const dataBrokerHits = webReferences.filter(r => r.category === 'data_broker' || r.domain.includes('whitepages') || r.domain.includes('spokeo') || r.domain.includes('radaris'));
  if (dataBrokerHits.length > 0) {
    factors.push({
      factor: 'Data Broker Indexing',
      level: 'high',
      description: `${dataBrokerHits.length} public data aggregator listings index this number, allowing automated scraper harvesting.`,
    });
  }

  if (emailAssociations.length > 0) {
    const hasPersonal = emailAssociations.some(e => !e.isCorporate);
    factors.push({
      factor: 'Email Identifier Association',
      level: hasPersonal ? 'high' : 'moderate',
      description: `${emailAssociations.length} email address(es) co-occur with this number on indexed public web pages.`,
    });
  }

  if (socialProfiles.length > 0) {
    factors.push({
      factor: 'Social Media / Profile Visibility',
      level: 'moderate',
      description: `${socialProfiles.length} public account or profile reference(s) display this contact line.`,
    });
  }

  const forumHits = webReferences.filter(r => r.category === 'public_forum');
  if (forumHits.length > 0) {
    factors.push({
      factor: 'Public Forum Disclosures',
      level: 'moderate',
      description: 'Number was detected in public forum discussions, classifieds, or paste archives.',
    });
  }

  if (webReferences.length === 0 && emailAssociations.length === 0 && socialProfiles.length === 0) {
    factors.push({
      factor: 'Zero Public Index Footprint',
      level: 'low',
      description: 'No verified citations or data broker records detected in authorized search engines.',
    });
  }

  let rating: 'minimal' | 'low' | 'moderate' | 'elevated' | 'high' = 'minimal';
  if (dataBrokerHits.length > 0 || emailAssociations.length > 1) {
    rating = 'high';
  } else if (emailAssociations.length === 1 || socialProfiles.length > 1 || webReferences.length > 3) {
    rating = 'elevated';
  } else if (webReferences.length > 0 || socialProfiles.length > 0) {
    rating = 'moderate';
  } else if (factors.length === 1 && factors[0].level === 'low') {
    rating = 'minimal';
  } else {
    rating = 'low';
  }

  return { rating, factors };
}

export function getDataBrokerOptOuts() {
  return [
    {
      serviceName: 'Whitepages Inc.',
      category: 'Public Directory / People Search',
      optOutUrl: 'https://www.whitepages.com/suppression-requests',
      instructions: 'Submit the URL of your profile listing to suppress telephone and address records from the public index.',
      recommended: true,
    },
    {
      serviceName: 'Spokeo People Search',
      category: 'Data Aggregator',
      optOutUrl: 'https://www.spokeo.com/optout',
      instructions: 'Paste your public Spokeo listing link and verify via confirmation email to remove associated contact numbers.',
      recommended: true,
    },
    {
      serviceName: 'Radaris Public Records',
      category: 'Background & Contact Directory',
      optOutUrl: 'https://radaris.com/control/privacy',
      instructions: 'Claim listing or request record removal via the automated privacy verification portal.',
      recommended: true,
    },
    {
      serviceName: 'FastPeopleSearch',
      category: 'Free Directory Aggregator',
      optOutUrl: 'https://www.fastpeoplesearch.com/removal',
      instructions: 'Search by phone number, open record, and click "Remove My Record" with CAPTCHA validation.',
      recommended: true,
    },
    {
      serviceName: 'BeenVerified',
      category: 'Commercial Background Index',
      optOutUrl: 'https://www.beenverified.com/app/optout/search',
      instructions: 'Opt-out through the central privacy suppression tool across associated brands.',
      recommended: false,
    },
  ];
}

export function getRemediationAdvice(riskRating: string): string[] {
  return [
    'Lock down Carrier Account PIN: Call your cellular provider and set a verbal account password to defend against unauthorized SIM-swap attacks.',
    'Migrate away from SMS 2-Factor Authentication: Switch sensitive email, financial, and cloud accounts to Hardware Security Keys (FIDO2/WebAuthn) or Authenticator Apps (TOTP).',
    'Submit Suppression Requests: Use the Data Broker Opt-Out links above to remove indexed phone listings from people-search websites.',
    'Review Voicemail Security: Ensure your carrier voicemail box has a custom secure PIN instead of the default 4-digit code.',
    'Use VoIP Alias Numbers: When signing up for non-critical online services, utilize burner or virtual numbers rather than your primary carrier line.',
  ];
}
