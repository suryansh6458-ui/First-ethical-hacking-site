import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, CheckCircle2, AlertCircle, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { COUNTRIES, PRESET_TEST_CASES, CountryInfo } from '../constants/countries.ts';
import { TelecomMetadata } from '../types.ts';

interface PhoneIntakeCardProps {
  onStartAnalysis: (rawNumber: string, countryIso: string, consent: boolean) => void;
  isLoading: boolean;
  prefillNumber?: string;
}

export const PhoneIntakeCard: React.FC<PhoneIntakeCardProps> = ({
  onStartAnalysis,
  isLoading,
  prefillNumber,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState(prefillNumber || '');
  const [userConsent, setUserConsent] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [validationPreview, setValidationPreview] = useState<TelecomMetadata | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefillNumber) {
      setPhoneNumber(prefillNumber);
    }
  }, [prefillNumber]);

  // Handle outside click to close country dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instant validation as user types (debounced)
  useEffect(() => {
    const trimmed = phoneNumber.trim();
    if (!trimmed) {
      setValidationPreview(null);
      setValidationError(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const full = trimmed.startsWith('+') ? trimmed : `${selectedCountry.dialCode}${trimmed}`;
        const res = await fetch('/api/validate-number', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawNumber: full, countryCode: selectedCountry.iso }),
        });
        if (res.ok) {
          const data = await res.json();
          setValidationPreview(data.metadata);
          setValidationError(null);
        }
      } catch {
        // silent validation error
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [phoneNumber, selectedCountry]);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch) ||
      c.iso.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSelectCountry = (country: CountryInfo) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setCountrySearch('');
  };

  const handleApplyPreset = (preset: typeof PRESET_TEST_CASES[0]) => {
    const match = COUNTRIES.find((c) => c.iso === preset.countryIso) || COUNTRIES[0];
    setSelectedCountry(match);
    setPhoneNumber(preset.number);
    setUserConsent(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setValidationError('Please enter a phone number.');
      return;
    }
    if (!userConsent) {
      setValidationError('You must certify authorization and consent before auditing this number.');
      return;
    }
    const full = phoneNumber.startsWith('+') ? phoneNumber : `${selectedCountry.dialCode}${phoneNumber}`;
    onStartAnalysis(full, selectedCountry.iso, userConsent);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm sm:p-8">
      {/* Header & Mission */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Phone Intelligence & Digital Footprint Intake
          </h2>
          <p className="text-sm text-slate-400">
            Audit publicly indexed telephone records, E.164 carrier routing, and exposed email/social footprint.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Encrypted Session & Ephemeral Retention</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Row: Country Selector + Phone Number */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Target Phone Number & International Dialing Plan
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Country Selector Dropdown */}
            <div className="relative shrink-0 sm:w-64" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 text-left text-sm font-medium text-white transition-colors hover:border-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{selectedCountry.flag}</span>
                  <span className="truncate">{selectedCountry.name}</span>
                  <span className="font-mono text-slate-400 tabular-nums">{selectedCountry.dialCode}</span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 top-14 z-50 w-72 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl backdrop-blur-xl">
                  <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search country or code..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.iso}
                        type="button"
                        onClick={() => handleSelectCountry(country)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                          selectedCountry.iso === country.iso
                            ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{country.flag}</span>
                          <span className="truncate">{country.name}</span>
                        </div>
                        <span className="font-mono text-slate-400 tabular-nums">{country.dialCode}</span>
                      </button>
                    ))}
                    {filteredCountries.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-500">No countries match "{countrySearch}"</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="relative flex-1">
              <input
                type="tel"
                placeholder={selectedCountry.sample}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setValidationError(null);
                }}
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 font-mono text-base text-white placeholder-slate-500 transition-colors hover:border-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 tabular-nums"
              />
              {validationPreview && validationPreview.isValid && (
                <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden sm:inline font-mono">E.164 Valid</span>
                </div>
              )}
            </div>
          </div>

          {/* Live Validation Pill Bar */}
          {validationPreview && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
              <span>Normalized: <strong className="font-mono text-emerald-400 tabular-nums">{validationPreview.e164}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Type: <strong className="text-slate-200">{validationPreview.lineTypeLabel}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Country: <strong className="text-slate-200">{validationPreview.country}</strong></span>
            </div>
          )}
        </div>

        {/* Quick Testing Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Security Analyst Testing Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_TEST_CASES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mandatory Authorization & Consent Gate */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={userConsent}
              onChange={(e) => {
                setUserConsent(e.target.checked);
                setValidationError(null);
              }}
              className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950"
            />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-200">
                Authorization & Lawful OSINT Audit Certification
              </span>
              <p className="text-xs leading-relaxed text-slate-400">
                I certify that I am either the verified owner of this phone number or an authorized cybersecurity researcher conducting a legitimate security audit. I understand that TraceLens exclusively harvests public web indexes and does not access private subscriber databases or bypass authentication systems.
              </p>
            </div>
          </label>
        </div>

        {validationError && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* CTA Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-500/10"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                <span>Executing Investigation...</span>
              </>
            ) : (
              <>
                <span>Start Intelligence Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
