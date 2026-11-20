'use client'

import { useState } from 'react'
import { TaskPriority } from '@/lib/api'

type CreateTaskFormProps = {
  onSubmit: (taskData: {
    title: string
    description?: string
    priority: TaskPriority
    due_date?: string
  }) => Promise<void>
  onCancel: () => void
}

export default function CreateTaskForm({ onSubmit, onCancel }: CreateTaskFormProps) {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onSubmit({
      title,
      description: description || undefined,
      priority,
      due_date: dueDate || undefined
    })


    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-foreground/10 p-6 space-y-4">

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          minLength={3}
          className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>


      <div>
        <label className="block text-sm font-medium mb-1">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add some details..."
          rows={2}
          className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="low">🔵 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Due Date (optional)</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent/90"
        >
          Create Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-foreground/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/20"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
