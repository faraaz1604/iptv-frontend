const formatter =
  typeof Intl !== 'undefined' && Intl.DisplayNames
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

// Manual fixes for non-standard / problematic codes
const FALLBACK_NAMES = {
  UK: 'United Kingdom',
  XK: 'Kosovo'
};

export function getCountryFlagUrl(code) {
  if (!code) return null;

  const upper = code.toUpperCase();

  // Normalize problematic codes
  const normalized = upper === 'UK' ? 'GB' : upper;

  // XK (Kosovo) is supported by flagcdn
  return `https://flagcdn.com/w20/${normalized.toLowerCase()}.png`;
}


export function getCountryName(code) {
  if (!code || typeof code !== 'string') return '';

  const upperCode = code.toUpperCase();

  // Known fallbacks first
  if (FALLBACK_NAMES[upperCode]) {
    return FALLBACK_NAMES[upperCode];
  }

  // Intl-safe lookup
  try {
    if (formatter) {
      const name = formatter.of(upperCode);
      return name || upperCode;
    }
  } catch (e) {
    // Ignore Intl errors safely
  }

  // Final fallback
  return upperCode;
}
