import Link from 'next/link'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export default function Navbar() {
  return (
    <header className="border-b border-foreground/10">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Task<span className="text-accent">Flow</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Button href="/login" variant="ghost">Log in</Button>
          <Button href="/register">Get started</Button>
        </nav>
      </Container>
    </header>
  )
}
