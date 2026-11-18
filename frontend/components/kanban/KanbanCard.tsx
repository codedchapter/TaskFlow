'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, TaskStatus, TaskPriority } from '@/lib/api'

type KanbanCardProps = {
  task: Task
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void
}

export default function KanbanCard({ task, onStatusChange }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-lg border border-foreground/10 bg-background p-3 shadow-sm transition-all hover:border-accent/30 hover:shadow-md active:cursor-grabbing ${
        isDragging ? 'rotate-2 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm flex-1">{task.title}</h4>
        <span className="text-xs" title={`${task.priority} priority`}>
          {getPriorityBadge(task.priority)}
        </span>
      </div>
      {task.description && (
        <p className="mt-1 text-xs text-foreground/60 line-clamp-2">{task.description}</p>
      )}
      {task.due_date && (
        <p
          className={`mt-2 text-xs ${
            formatDueDate(task.due_date) === 'Overdue'
              ? 'text-rose-500 font-medium'
              : formatDueDate(task.due_date) === 'Today'
              ? 'text-amber-500 font-medium'
              : 'text-foreground/50'
          }`}
        >
          📅 {formatDueDate(task.due_date)}
        </p>
      )}
    </div>
  )
}

function getPriorityBadge(priority: TaskPriority): string {
  switch (priority) {
    case 'high':
      return '🔴'
    case 'medium':
      return '🟡'
    case 'low':
      return '🔵'
    default:
      return '🟡'
  }
}

function formatDueDate(dateString: string | null): string | null {
  if (!dateString) return null
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays <= 7) return `In ${diffDays} days`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
