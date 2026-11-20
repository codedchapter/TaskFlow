'use client'

import { Task, TaskStatus, TaskPriority } from '@/lib/api'
import TaskCard from './TaskCard'

type TaskListProps = {
  tasks: Task[]
  editingTaskId: number | null
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void
  onEdit: (taskId: number) => void
  onDelete: (taskId: number) => void
  onSave: (taskId: number, updates: any) => void
  onCancel: () => void
}

export default function TaskList({
  tasks,
  editingTaskId,
  onStatusChange,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}: TaskListProps) {
  // Empty state — I wrote this part for you
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-foreground/10 p-12 text-center">
        <p className="text-foreground/60">No tasks here yet.</p>
      </div>
    )
  }

    return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isEditing={ editingTaskId === task.id }
          onStatusChange={ onStatusChange }
          onEdit={ () => onEdit(task.id) }
          onDelete={ () => onDelete(task.id) }
          onSave={ (updates) => onSave(task.id, updates) }
          onCancel={ onCancel }
        />
      ))}
    </div>
  )
}
