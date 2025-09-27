
/**
 * ===============================================================
 * @param leanDocument 
 * @returns 
 * ===============================================================
 */
export function convertToSerializeableObject<T>(leanDocument: unknown): T {

  if (!leanDocument || typeof leanDocument !== 'object') {
    return leanDocument as T;
  }

  const out: Record<string, any> = Array.isArray(leanDocument) ? [] : {};

  for (const [key, val] of Object.entries(leanDocument)) {
    if (val == null) {
      out[key] = val;
      continue;
    }

    if (
      typeof val === 'object' &&
      'toString' in val &&
      typeof (val as any).toString === 'function' &&
      'toJSON' in val &&
      typeof (val as any).toJSON === 'function'
    ) {
      out[key] = (val as any).toString();
      continue;
    }

    if (val instanceof Date) {
      out[key] = val.toISOString();
      continue;
    }

    if (Array.isArray(val)) {
      out[key] = val.map((v) =>
        v && typeof v === 'object'
          ? convertToSerializeableObject<Record<string, any>>(v)
          : v
      );
      continue;
    }

    if (typeof val === 'object') {
      out[key] = convertToSerializeableObject<Record<string, any>>(val);
      continue;
    }

    out[key] = val;
  }

  //===============================================================
  return out as T;

}

