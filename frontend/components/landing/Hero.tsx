import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <Container className="py-24 text-center md:py-32">
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
        Built for focused teams
      </p>

      <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
        Stop managing tasks.
        <br />
        Start finishing them.
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
        TaskFlow keeps your projects, deadlines, and teammates in one place 
        without the clutter that slows you down.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="/register" size="lg">Start for free</Button>
        <Button href="/login" variant="ghost" size="lg">I have an account</Button>
      </div>
    </Container>
  )
}
