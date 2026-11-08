'use client'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  id: string
}

export default function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground/80">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/35 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      />
    </div>
  )
}
