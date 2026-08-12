import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet'
export type ButtonSize = 'md' | 'lg'

/**
 * Only colour and small transforms animate here — never width, height or padding,
 * which would force layout on every frame. The whole control is never scaled:
 * a button that grows on hover reads cheap.
 */
const BASE_CLASS =
  'group inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-medium ' +
  'transition-colors duration-[var(--duration-fast)] ease-out-quart ' +
  'disabled:pointer-events-none disabled:opacity-40'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  // Hover inverts rather than lightens: dark surface, lime text.
  primary:
    'bg-accent text-accent-contrast hover:bg-canvas hover:text-accent hover:ring-1 hover:ring-accent',
  secondary: 'border border-line-strong text-content hover:border-content hover:bg-surface',
  quiet: 'text-content-secondary hover:text-content',
}

/** Wireframe: 54–56px tall, 28px inline padding. Sharper than a pill. */
const SIZE_CLASS: Record<ButtonSize, string> = {
  md: 'h-12 px-6 text-body-sm',
  lg: 'h-14 px-7 text-body',
}

type StyleProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Mobile CTAs run edge to edge; desktop ones do not. */
  fullWidth?: boolean
}

function buttonClass({ variant = 'primary', size = 'md', fullWidth }: StyleProps, extra?: string) {
  return cn(BASE_CLASS, VARIANT_CLASS[variant], SIZE_CLASS[size], fullWidth && 'w-full', extra)
}

type ButtonProps = StyleProps & ComponentPropsWithoutRef<'button'>

/** A real button: submits forms, opens the mobile menu, advances the lead form. */
export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, fullWidth }, className)}
      {...props}
    />
  )
}

type ButtonLinkProps = StyleProps & ComponentPropsWithoutRef<typeof Link>

/** Navigation that looks like a button. Anchors to a section, or leaves the site. */
export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, fullWidth }, className)} {...props} />
}

/**
 * The small arrow that trails a CTA. Nudges 4px on the parent's hover — the
 * button itself stays put.
 */
export function CtaArrow({ direction = 'up-right' }: { direction?: 'up-right' | 'right' }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-[var(--duration-fast)] ease-out-quart group-hover:translate-x-1"
    >
      {direction === 'up-right' ? '↗' : '→'}
    </span>
  )
}
