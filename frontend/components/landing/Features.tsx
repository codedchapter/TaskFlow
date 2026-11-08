import Container from '@/components/ui/Container'

const features = [
  {
    title: 'Everything in one place',
    description: 'Projects, tasks, and deadlines live together. No more tab-hopping to find what matters.',
  },
  {
    title: 'Secure by default',
    description: 'Encrypted passwords and token-based sessions. Your data stays yours, always.',
  },
  {
    title: 'Fast at any scale',
    description: 'Paginated, filterable, and searchable. Ten tasks or ten thousand, it stays instant.',
  },
]

export default function Features() {
  return (
    <Container className="border-t border-foreground/10 py-20">
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border border-foreground/10 p-6 transition-colors hover:border-accent/50"
          >
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-foreground/65">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Container>
  )
}
