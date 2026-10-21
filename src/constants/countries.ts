export interface CountryInfo {
  iso: string;
  name: string;
  dialCode: string;
  flag: string;
  sample: string;
}

export const COUNTRIES: CountryInfo[] = [
  { iso: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', sample: '(212) 555-0199' },
  { iso: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', sample: '7911 123456' },
  { iso: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', sample: '(416) 555-0143' },
  { iso: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', sample: '151 23456789' },
  { iso: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', sample: '6 12 34 56 78' },
  { iso: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', sample: '98765 43210' },
  { iso: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', sample: '412 345 678' },
  { iso: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', sample: '90 1234 5678' },
  { iso: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', sample: '(11) 98765-4321' },
  { iso: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', sample: '55 1234 5678' },
  { iso: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', sample: '8123 4567' },
  { iso: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', sample: '6 12345678' },
  { iso: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', sample: '78 123 45 67' },
  { iso: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', sample: '70 123 45 67' },
  { iso: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', sample: '320 123 4567' },
  { iso: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', sample: '612 34 56 78' },
  { iso: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', sample: '85 123 4567' },
  { iso: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', sample: '21 123 4567' },
  { iso: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', sample: '50 123 4567' },
  { iso: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', sample: '82 123 4567' },
  { iso: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', sample: '10 1234 5678' },
  { iso: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', sample: '50 123 4567' },
  { iso: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', sample: '512 345 678' },
  { iso: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', sample: '412 34 567' },
  { iso: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', sample: '20 12 34 56' },
  { iso: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮', sample: '40 1234567' },
  { iso: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', sample: '470 12 34 56' },
  { iso: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', sample: '664 1234567' },
  { iso: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', sample: '912 345 678' },
  { iso: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰', sample: '9123 4567' },
  { iso: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', sample: '917 123 4567' },
  { iso: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', sample: '12 345 6789' },
  { iso: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', sample: '812 3456 7890' },
  { iso: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', sample: '81 234 5678' },
  { iso: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', sample: '91 234 56 78' },
  { iso: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', sample: '802 123 4567' },
  { iso: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', sample: '532 123 45 67' },
];

export const PRESET_TEST_CASES = [
  {
    label: 'US Corporate Toll-Free',
    countryIso: 'US',
    dialCode: '+1',
    number: '8005550199',
    description: 'Valid US Toll-Free routing line with national directory exposure',
  },
  {
    label: 'UK Telecom London Fixed',
    countryIso: 'GB',
    dialCode: '+44',
    number: '2079460991',
    description: 'UK BT/Virgin Media fixed-line allocation range',
  },
  {
    label: 'German Cellular Range',
    countryIso: 'DE',
    dialCode: '+49',
    number: '15123456789',
    description: 'German Telekom / O2 GSM cellular mobile block',
  },
  {
    label: 'US Tech Support Line',
    countryIso: 'US',
    dialCode: '+1',
    number: '4155550132',
    description: 'San Francisco Bay Area landline exchange',
  },
  {
    label: 'Invalid Syntax Pattern',
    countryIso: 'US',
    dialCode: '+1',
    number: '12345',
    description: 'Truncated invalid non-E.164 number to test validation engine',
  },
];
