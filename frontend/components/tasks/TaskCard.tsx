'use client'

import { useState } from 'react'
import { Task, TaskStatus, TaskPriority } from '@/lib/api'

type TaskCardProps = {
  task: Task
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void
  onEdit: () => void
  onDelete: () => void
  onSave: (updates: any) => void
  onCancel: () => void
  isEditing: boolean
}

export default function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  isEditing
}: TaskCardProps) {
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority)
  const [editDueDate, setEditDueDate] = useState(task.due_date ? task.due_date.split('T')[0] : '')

  return (
    <div className="rounded-lg border border-foreground/10 p-4">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full rounded border px-3 py-2 mt-2"
            rows={2}
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
            className="w-full rounded border px-3 py-2 mt-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="w-full rounded border px-3 py-2 mt-2"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => onSave({
              title: editTitle,
              description: editDescription,
              priority: editPriority,
              due_date: editDueDate || null
            })}>
              Save
            </button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          {task.description && <p className="text-sm text-foreground/60">{task.description}</p>}
          <div className="flex gap-2 mt-2">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}
