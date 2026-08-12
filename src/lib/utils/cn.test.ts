import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('joins class names and drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c')
  })

  it('lets the later utility win within a conflicting group', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8')
  })

  it('keeps a custom font-size and a custom text colour together', () => {
    // Regression guard for the tailwind-merge class-group extension: without it,
    // one of these two classes is silently discarded.
    expect(cn('text-display-section', 'text-accent')).toBe('text-display-section text-accent')
  })

  it('still resolves conflicts inside the custom scales', () => {
    expect(cn('text-display-hero', 'text-display-section')).toBe('text-display-section')
    expect(cn('text-content-secondary', 'text-accent')).toBe('text-accent')
    expect(cn('text-content-tertiary', 'text-content-secondary')).toBe('text-content-secondary')
  })

  it('keeps the metadata size distinct from the body sizes', () => {
    expect(cn('text-meta', 'text-content-tertiary')).toBe('text-meta text-content-tertiary')
    expect(cn('text-body-sm', 'text-meta')).toBe('text-meta')
  })
})
