// Parses the Fama/French 3 Factors CSV (Ken French Data Library).
// The file has text headers, a monthly section (YYYYMM rows), then an "Annual Factors" section (YYYY rows).
// Values are percents. Columns: Mkt-RF, SMB, HML, RF.
import { inflateRawSync } from 'node:zlib';

export function parseFF(text) {
  const monthly = [], annual = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*(\d{4}|\d{6})\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*$/);
    if (!m) continue;
    const [mktrf, smb, hml, rf] = m.slice(2).map(Number);
    if ([mktrf, smb, hml, rf].some(v => v <= -99.99)) continue; // missing-data marker
    if (m[1].length === 6) monthly.push({ ym: +m[1], mktrf, smb, hml, rf });
    else annual.push({ y: +m[1], mktrf, smb, hml, rf });
  }
  return { monthly, annual };
}

// Reads the first file out of a .zip (stored or deflated) without extra dependencies.
export function unzipFirst(buf) {
  if (buf.readUInt32LE(0) !== 0x04034b50) throw new Error('Not a zip file');
  const method = buf.readUInt16LE(8), csize = buf.readUInt32LE(18), nlen = buf.readUInt16LE(26), xlen = buf.readUInt16LE(28);
  const start = 30 + nlen + xlen, data = buf.subarray(start, start + csize);
  return (method === 0 ? data : inflateRawSync(data)).toString('latin1');
}
