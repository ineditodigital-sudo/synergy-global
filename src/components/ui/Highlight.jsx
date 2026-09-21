/**
 * Renders `text` with the words in `highlight` styled (e.g. gold italics).
 * Editors type the words to highlight in a plain field; no markup needed.
 */
export default function Highlight({ text, highlight, className = 'italic' }) {
  const value = String(text || '');
  const needle = String(highlight || '').trim();
  if (!needle) return value;
  const idx = value.toLowerCase().indexOf(needle.toLowerCase());
  if (idx === -1) return value;
  return (
    <>
      {value.slice(0, idx)}
      <span className={className}>{value.slice(idx, idx + needle.length)}</span>
      {value.slice(idx + needle.length)}
    </>
  );
}
