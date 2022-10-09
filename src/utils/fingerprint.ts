import FingerprintJS from '@fingerprintjs/fingerprintjs'

let value = '';

export async function getFingerPrint() {
  if (value) {
    return value;
  }
  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    value = result.visitorId;
  } catch (e) {
    console.error('Error in getFingerPrint:', e);
  }
  return value;
}
