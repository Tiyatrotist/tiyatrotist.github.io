/**
 * TIYATROTIST — Technical Content Tokenizer
 *
 * Protects technical elements (code blocks, inline code, URLs, repo names,
 * version strings, file paths, Markdown links) from alteration during translation.
 */

export interface TokenizedResult {
  maskedText: string;
  tokens: Map<string, string>;
}

const PROTECTED_TERMS = [
  'TypeFlow',
  'BookOS',
  'Tiyatrotist',
  'GitHub',
  'Next.js',
  'Turbopack',
  'Supabase',
  'PostgreSQL',
  'TypeScript',
  'JavaScript',
  'TailwindCSS',
  'DotEngine',
  'DotTypography',
];

export function maskTechnicalContent(text: string): TokenizedResult {
  if (!text) return { maskedText: '', tokens: new Map() };

  const tokens = new Map<string, string>();
  let tokenCounter = 0;

  const createToken = (original: string): string => {
    const tokenId = `__TECH_TOKEN_${tokenCounter++}__`;
    tokens.set(tokenId, original);
    return tokenId;
  };

  let processed = text;

  // 1. Mask fenced code blocks (```lang ... ```)
  processed = processed.replace(/```[\s\S]*?```/g, (match) => createToken(match));

  // 2. Mask inline code (`...`)
  processed = processed.replace(/`[^`\n]+`/g, (match) => createToken(match));

  // 3. Mask URLs (http:// or https://)
  processed = processed.replace(/https?:\/\/[^\s)]+/g, (match) => createToken(match));

  // 4. Mask version strings (e.g., v1.0.0, v0.2.1-beta)
  processed = processed.replace(/\bv\d+\.\d+\.\d+(?:-[\w.]+)?\b/gi, (match) => createToken(match));

  // 5. Mask file paths & CLI commands
  processed = processed.replace(/\b(?:npm|pnpm|yarn|git|npx)\s+[a-z0-9_\-./]+/gi, (match) => createToken(match));

  // 6. Mask protected terms
  for (const term of PROTECTED_TERMS) {
    const regex = new RegExp(`\\b${term}\\b`, 'g');
    processed = processed.replace(regex, (match) => createToken(match));
  }

  return { maskedText: processed, tokens };
}

export function unmaskTechnicalContent(maskedText: string, tokens: Map<string, string>): string {
  if (!maskedText) return '';

  let restored = maskedText;

  // Normalize any accidental whitespace inserted inside token delimiters by translation engines
  restored = restored.replace(/__\s*TECH_TOKEN_(\d+)\s*__/gi, '__TECH_TOKEN_$1__');

  tokens.forEach((original, tokenId) => {
    const escaped = tokenId.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    restored = restored.replace(new RegExp(escaped, 'gi'), original);
  });

  return restored;
}
