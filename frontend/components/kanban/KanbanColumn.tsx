'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '@/lib/api'
import KanbanCard from './KanbanCard'

type KanbanColumnProps = {
  status: TaskStatus
  title: string
  color: string
  tasks: Task[]
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void
}

export default function KanbanColumn({ status, title, color, tasks, onStatusChange }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div className="flex flex-col rounded-lg bg-foreground/5 p-4 min-w-[280px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 min-h-[200px] rounded-lg p-2 transition-colors ${
          isOver ? 'bg-accent/10 border-2 border-dashed border-accent' : ''
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onStatusChange={onStatusChange} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="text-center text-xs text-foreground/40 py-8">
            Drop tasks here
          </p>
        )}
      </div>
    </div>
  )
}
