'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { api, Task, TaskStatus } from '@/lib/api'
import { auth } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/login')
      return
    }

    api
      .getTasks(token, filterStatus || undefined)
      .then(setTasks)
      .catch(() => {
        auth.clearToken()
        router.push('/login')
      })
      .finally(() => setLoading(false))
  }, [router, filterStatus])

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
        status: 'todo',
      })

      const updatedTasks = await api.getTasks(token, filterStatus || undefined)
      setTasks(updatedTasks)

      setNewTaskTitle('')
      setNewTaskDescription('')
      setShowCreateForm(false)
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    const token = auth.getToken()
    if (!token) return

    try {
      await api.updateTask(token, taskId, { status: newStatus })
      const updatedTasks = await api.getTasks(token, filterStatus || undefined)
      setTasks(updatedTasks)
    } catch (err) {
      console.error('Failed to update task:', err)
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

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['', 'todo', 'in_progress', 'review', 'done'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-accent text-background'
                : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
            }`}
          >
            {status === '' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
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
              className="group flex items-start justify-between rounded-lg border border-foreground/10 p-4 transition-colors hover:border-accent/30"
            >
              <div className="flex-1">
                <h3 className={`font-semibold ${task.status === 'done' ? 'line-through text-foreground/50' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`mt-1 text-sm ${task.status === 'done' ? 'text-foreground/30 line-through' : 'text-foreground/60'}`}>
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                {/* Status Dropdown */}
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${getStatusColor(task.status)}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>

                {/* Delete Button */}
                <button
                  onClick={async () => {
                    if (!confirm('Are you sure you want to delete this task?')) return
                    const token = auth.getToken()
                    if (!token) return
                    try {
                      await api.deleteTask(token, task.id)
                      setTasks(tasks.filter((t) => t.id !== task.id))
                    } catch (err) {
                      console.error('Failed to delete task:', err)
                    }
                  }}
                  className="rounded px-3 py-1.5 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'todo':
      return 'bg-foreground/10 text-foreground'
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-500'
    case 'review':
      return 'bg-yellow-500/10 text-yellow-500'
    case 'done':
      return 'bg-green-500/10 text-green-500'
    default:
      return 'bg-foreground/10 text-foreground'
  }
}
