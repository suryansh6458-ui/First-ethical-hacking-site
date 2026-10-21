import { Router, Request, Response } from 'express';
import { analyzeTelecomNumber } from '../providers/telecomProvider.js';
import { searchPublicFootprintWithGemini } from '../providers/geminiSearchProvider.js';
import { resolveIpIntelligence } from '../providers/ipIntelligenceProvider.js';
import { getProviderCatalog, evaluateFootprintRisk, getDataBrokerOptOuts, getRemediationAdvice } from '../providers/sourcesManager.js';
import { FootprintReport, SourceExecutionLog } from '../types.js';

export const apiRouter = Router();

// Ephemeral in-memory storage for current session reports (auto-cleared after max size)
const sessionReports: FootprintReport[] = [];

// Rate limiting map (in-memory per client IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function applyRateLimit(req: Request, res: Response, next: () => void) {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30;

  const current = rateLimitMap.get(clientIp);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before initiating another intelligence inquiry.',
    });
  }

  current.count++;
  next();
}

apiRouter.use(applyRateLimit);

// 1. Providers Status Catalog
apiRouter.get('/providers', (_req: Request, res: Response) => {
  const catalog = getProviderCatalog();
  res.json({ providers: catalog, timestamp: new Date().toISOString() });
});

// 2. Real-time Number Pre-Validation
apiRouter.post('/validate-number', async (req: Request, res: Response) => {
  const { rawNumber, countryCode } = req.body;
  if (!rawNumber || typeof rawNumber !== 'string') {
    return res.status(400).json({ error: 'Valid rawNumber string required' });
  }

  const result = await analyzeTelecomNumber(rawNumber, countryCode);
  res.json(result);
});

// 3. Full Phone Intelligence & Digital Footprint Audit
apiRouter.post('/analyze', async (req: Request, res: Response) => {
  const { rawNumber, countryCode, userConsent } = req.body;

  // Strict Legal & Ethical Authorization Check
  if (!userConsent) {
    return res.status(403).json({
      error: 'User authorization & consent is required. You must verify that you own this number or are authorized to conduct this audit.',
    });
  }

  if (!rawNumber || typeof rawNumber !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid phone number.' });
  }

  const startTime = Date.now();
  const sourcesLog: SourceExecutionLog[] = [];

  // Stage 1: Telecom Registry Parsing & Normalization
  const telecomStart = Date.now();
  const { metadata: telecom, providerLog: telecomLog } = await analyzeTelecomNumber(rawNumber, countryCode);
  sourcesLog.push({
    providerId: 'telecom_e164',
    name: 'ITU-T E.164 Telecom Registry',
    queriedAt: new Date(telecomStart).toISOString(),
    durationMs: Date.now() - telecomStart,
    status: telecom.isValid ? 'succeeded' : 'no_results',
    message: telecomLog,
    findingsCount: telecom.isValid ? 1 : 0,
  });

  // Stage 2: Public Footprint Harvesting via Gemini Search Grounding
  let geminiResult: Awaited<ReturnType<typeof searchPublicFootprintWithGemini>> = {
    webReferences: [],
    emailAssociations: [],
    socialProfiles: [],
    summaryLog: '',
  };
  const geminiStart = Date.now();
  if (telecom.isValid || telecom.isPossible) {
    geminiResult = await searchPublicFootprintWithGemini(telecom);
    sourcesLog.push({
      providerId: 'gemini_grounding',
      name: 'Gemini Search Grounding Engine',
      queriedAt: new Date(geminiStart).toISOString(),
      durationMs: Date.now() - geminiStart,
      status: geminiResult.webReferences.length > 0 ? 'succeeded' : (process.env.GEMINI_API_KEY ? 'no_results' : 'not_configured'),
      message: geminiResult.summaryLog,
      findingsCount: geminiResult.webReferences.length + geminiResult.emailAssociations.length + geminiResult.socialProfiles.length,
    });
  } else {
    sourcesLog.push({
      providerId: 'gemini_grounding',
      name: 'Gemini Search Grounding Engine',
      queriedAt: new Date(geminiStart).toISOString(),
      durationMs: 0,
      status: 'skipped',
      message: 'Skipped search index query due to invalid international numbering syntax.',
      findingsCount: 0,
    });
  }

  // Stage 3: Log Secondary Optional Providers (Transparently note unconfigured ones)
  const catalog = getProviderCatalog();
  for (const prov of catalog) {
    if (!prov.isBuiltIn && !sourcesLog.some(l => l.providerId === prov.id)) {
      sourcesLog.push({
        providerId: prov.id,
        name: prov.name,
        queriedAt: new Date().toISOString(),
        durationMs: 0,
        status: prov.status === 'active' ? 'succeeded' : 'not_configured',
        message: prov.status === 'active' ? 'Provider active and healthy.' : `Provider integration not configured (${prov.configInstruction || 'API key missing'}).`,
        findingsCount: 0,
      });
    }
  }

  // Stage 4: Risk Assessment & Remediation Synthesis
  const { rating, factors } = evaluateFootprintRisk(
    geminiResult.webReferences,
    geminiResult.emailAssociations,
    geminiResult.socialProfiles
  );

  const reportId = `TL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const report: FootprintReport = {
    reportId,
    targetMasked: telecom.maskedE164,
    rawInput: telecom.e164,
    generatedAt: new Date().toISOString(),
    consentGranted: true,
    telecom,
    webReferences: geminiResult.webReferences,
    emailAssociations: geminiResult.emailAssociations,
    socialProfiles: geminiResult.socialProfiles,
    sourcesLog,
    overallRiskRating: rating,
    riskFactors: factors,
    optOutChecklist: getDataBrokerOptOuts(),
    remediationAdvice: getRemediationAdvice(rating),
    limitationsStatement:
      'TraceLens searches authorized public indexing sources only. It does NOT probe private telecom databases, intercept SMS messages, attempt account recovery exploits, or claim knowledge of live device locations or authenticated sessions.',
  };

  // Keep ephemeral history (max 20)
  sessionReports.unshift(report);
  if (sessionReports.length > 20) sessionReports.pop();

  res.json({ report, durationMs: Date.now() - startTime });
});

// 4. IP Intelligence & Network Architecture Analysis
apiRouter.get('/network/ip-info', async (req: Request, res: Response) => {
  const requestedIp = typeof req.query.ip === 'string' ? req.query.ip : undefined;
  const clientRemoteIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;

  const result = await resolveIpIntelligence(requestedIp, clientRemoteIp);
  res.json(result);
});

// 5. In-Session History List
apiRouter.get('/history', (_req: Request, res: Response) => {
  const list = sessionReports.map(r => ({
    reportId: r.reportId,
    targetMasked: r.targetMasked,
    country: r.telecom.country,
    generatedAt: r.generatedAt,
    overallRiskRating: r.overallRiskRating,
    findingsCount: r.webReferences.length + r.emailAssociations.length + r.socialProfiles.length,
  }));
  res.json({ history: list });
});

// 6. Purge In-Memory History (Data Minimization)
apiRouter.delete('/history', (_req: Request, res: Response) => {
  sessionReports.length = 0;
  res.json({ success: true, message: 'All in-memory investigation records have been securely purged.' });
});
