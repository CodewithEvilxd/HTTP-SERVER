const decoder = new TextDecoder();
const encoder = new TextEncoder();

export function concatBytes(left: Uint8Array, right: Uint8Array): Uint8Array {
  const combined = new Uint8Array(left.length + right.length);
  combined.set(left, 0);
  combined.set(right, left.length);
  return combined;
}

export function decodeBytes(bytes: Uint8Array): string {
  return decoder.decode(bytes);
}

export function encodeText(value: string): Uint8Array {
  return encoder.encode(value);
}

export function findSequence(source: Uint8Array, sequence: readonly number[]): number {
  if (sequence.length === 0 || source.length < sequence.length) {
    return -1;
  }

  for (let index = 0; index <= source.length - sequence.length; index += 1) {
    let matched = true;

    for (let offset = 0; offset < sequence.length; offset += 1) {
      if (source[index + offset] !== sequence[offset]) {
        matched = false;
        break;
      }
    }

    if (matched) {
      return index;
    }
  }

  return -1;
}
