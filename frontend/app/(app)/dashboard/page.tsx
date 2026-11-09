'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'

type Task = {
  id: number
  title: string
  description: string | null
  is_completed: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/login')
      return
    }

    api
      .getTasks(token)
      .then(setTasks)
      .catch(() => {
        auth.clearToken()
        router.push('/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    auth.clearToken()
    router.push('/login')
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = auth.getToken()
    if (!token) return

    try {
      await api.createTask(token, {
        title: newTaskTitle,
        description: newTaskDescription || undefined,
      })

      // Refresh the task list
      const updatedTasks = await api.getTasks(token)
      setTasks(updatedTasks)

      // Reset form
      setNewTaskTitle('')
      setNewTaskDescription('')
      setShowCreateForm(false)
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  if (loading) {
    return (
      <Container className="py-20 text-center">
        <p className="text-foreground/60">Loading your tasks...</p>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleLogout}>Log out</Button>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'New Task'}
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreateTask}
          className="mb-8 rounded-lg border border-foreground/10 p-6"
        >
          <Input
            id="title"
            label="Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            minLength={3}
          />

          <Input
            id="description"
            label="Description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Add some details..."
          />

          <Button type="submit" className="mt-2">Create Task</Button>
        </form>
      )}

              <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-start justify-between rounded-lg border border-foreground/10 p-4 transition-colors hover:border-accent/30"
            >
              <div className="flex-1">
                <h3 className={`font-semibold ${task.is_completed ? 'line-through text-foreground/50' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`mt-1 text-sm ${task.is_completed ? 'text-foreground/30 line-through' : 'text-foreground/60'}`}>
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                {/* Toggle Complete Button */}
                <button
                  onClick={async () => {
                    const token = auth.getToken()
                    if (!token) return
                    try {
                      await api.updateTask(token, task.id, { is_completed: !task.is_completed })
                      // refresh the list
                      const updatedTasks = await api.getTasks(token)
                      setTasks(updatedTasks)
                    } catch (err) {
                      console.error('Failed to update task:', err)
                    }
                  }}
                  className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                    task.is_completed
                      ? 'bg-foreground/10 text-foreground/60 hover:bg-foreground/20'
                      : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                  }`}
                >
                  {task.is_completed ? '↩ Undo' : '✓ Complete'}
                </button>

                <button
                  onClick={async () => {
                    if (!confirm('Are you sure you want to delete this task?')) return
                    const token = auth.getToken()
                    if (!token) return
                    try {
                      await api.deleteTask(token, task.id)
                      // Remove from local state immediately
                      setTasks(tasks.filter((t) => t.id !== task.id))
                    } catch (err) {
                      console.error('Failed to delete task:', err)
                    }
                  }}
                  className="rounded px-3 py-1 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
    </Container>
  )
}
