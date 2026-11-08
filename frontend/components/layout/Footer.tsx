import Container from '@/components/ui/Container'

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <Container className="flex flex-col items-center justify-between gap-2 py-8 text-sm text-foreground/50 sm:flex-row">
        <p>TaskFlow  a full-stack project.</p>
        <p>FastAPI · MySQL · Next.js</p>
      </Container>
    </footer>
  )
}
