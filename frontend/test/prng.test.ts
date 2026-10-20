import { describe, it, expect } from 'vitest';
import { createPrng } from '@/lib/prng';

describe('Mulberry32 PRNG determinism', () => {
  it('produces identical sequences for the same seed', () => {
    const prng1 = createPrng(1337);
    const prng2 = createPrng(1337);

    const seq1 = Array.from({ length: 10 }, () => prng1.next());
    const seq2 = Array.from({ length: 10 }, () => prng2.next());

    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const prng1 = createPrng(1001);
    const prng2 = createPrng(2002);

    expect(prng1.next()).not.toEqual(prng2.next());
  });

  it('generates integers within bounds [min, max]', () => {
    const prng = createPrng(42);
    for (let i = 0; i < 50; i++) {
      const val = prng.nextInt(5, 15);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(15);
    }
  });
});
