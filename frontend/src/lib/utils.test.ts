import { cn } from './utils';

describe('cn utility', () => {
  it('joins class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates tailwind classes', () => {
    expect(cn('p-2', 'p-2')).toBe('p-2');
  });
});
