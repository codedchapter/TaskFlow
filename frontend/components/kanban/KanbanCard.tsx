'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, TaskStatus } from '@/lib/api'

type KanbanCardProps = {
  task: Task
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void
}

export default function KanbanCard({ task, onStatusChange }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
      <h4 className="font-semibold text-sm">{task.title}</h4>
      {task.description && (
        <p className="mt-1 text-xs text-foreground/60 line-clamp-2">
          {task.description}
        </p>
      )}
    </div>
  )
}
