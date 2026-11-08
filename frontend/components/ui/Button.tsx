import Link from 'next/link'

type Variant = 'primary' | 'ghost'
type Size = 'md' | 'lg'

type ButtonProps = {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  onClick?: () => void
}

const base =
  'inline-flex items-center justify-center rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-background hover:bg-accent/90',
  ghost: 'border border-foreground/25 text-foreground hover:border-foreground/60',
}

const sizes: Record<Size, string> = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  disabled,
  className = '',
  onClick,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
