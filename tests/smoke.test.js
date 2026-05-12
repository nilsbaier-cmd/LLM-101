import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('vitest läuft', () => {
    expect(1 + 1).toBe(2);
  });

  it('jsdom hat document', () => {
    expect(document).toBeDefined();
    expect(document.body).toBeDefined();
  });
});
