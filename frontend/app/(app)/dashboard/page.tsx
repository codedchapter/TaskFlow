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

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-foreground/10 p-12 text-center">
          <p className="text-foreground/60">No tasks yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-foreground/10 p-4 transition-colors hover:border-accent/30"
            >
              <h3 className="font-semibold">{task.title}</h3>
              {task.description && (
                <p className="mt-1 text-sm text-foreground/60">{task.description}</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`text-xs ${
                    task.is_completed ? 'text-green-500' : 'text-foreground/40'
                  }`}
                >
                  {task.is_completed ? '✓ Completed' : '○ In progress'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
