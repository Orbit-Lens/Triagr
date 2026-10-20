/**
 * Seeded PRNG using the Mulberry32 algorithm.
 * Guarantees determinism: same seed produces identical sequences across platforms.
 */
export function createPrng(seed: number) {
  let state = seed >>> 0;

  return {
    /** Returns a pseudo-random float in [0, 1) */
    next(): number {
      state |= 0;
      state = (state + 0x6d2b79f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },

    /** Returns a pseudo-random integer in [min, max] inclusive */
    nextInt(min: number, max: number): number {
      const f = this.next();
      return Math.floor(f * (max - min + 1)) + min;
    },

    /** Returns current internal state */
    getState(): number {
      return state;
    },
  };
}
