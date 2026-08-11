import { readFile } from 'node:fs/promises';

const file = new URL('../src/data/faqs.json', import.meta.url);
const parsed = JSON.parse(await readFile(file, 'utf8'));
const faqs = parsed.faqs;

if (!Array.isArray(faqs) || faqs.length === 0) {
  throw new Error('FAQ content must contain at least one entry.');
}

const ids = new Set();
for (const [index, entry] of faqs.entries()) {
  if (!entry.id || typeof entry.id !== 'string') {
    throw new Error(`FAQ ${index + 1} is missing a stable ID.`);
  }
  if (ids.has(entry.id)) throw new Error(`Duplicate FAQ ID: ${entry.id}`);
  ids.add(entry.id);

  for (const locale of ['en', 'fr']) {
    for (const field of ['question', 'answer']) {
      if (!entry[locale]?.[field]?.trim()) {
        throw new Error(`FAQ ${entry.id} is missing ${locale}.${field}.`);
      }
    }
  }
}

console.log(`Validated ${faqs.length} complete bilingual FAQ entries.`);
