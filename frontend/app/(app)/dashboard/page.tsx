'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { api, Task, TaskStatus, TaskPriority, Project } from '@/lib/api'
import { auth } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import KanbanBoard from '@/components/kanban/KanbanBoard'

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  const [showTrash, setShowTrash] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#FF6B4A')

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium')
  const [editDueDate, setEditDueDate] = useState<string>('')

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const [tasksData, projectsData] = await Promise.all([
          showTrash
            ? api.getTrashTasks(token)
            : api.getTasks(token, filterStatus || undefined, selectedProjectId ?? undefined),
          api.getProjects(token),
        ])
        setTasks(tasksData)
        setProjects(projectsData)
      } catch {
        auth.clearToken()
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, filterStatus, showTrash, selectedProjectId])

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
        priority: newTaskPriority,
        due_date: newTaskDueDate || undefined,
        project_id: selectedProjectId ?? undefined,
      })

      const updatedTasks = await api.getTasks(token, filterStatus || undefined, selectedProjectId ?? undefined)
      setTasks(updatedTasks)
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskPriority('medium')
      setNewTaskDueDate('')
      setShowCreateForm(false)
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = auth.getToken()
    if (!token) return

    try {
      const newProject = await api.createProject(token, {
        name: newProjectName,
        color: newProjectColor,
      })
      setProjects([...projects, newProject])
      setSelectedProjectId(newProject.id)
      setNewProjectName('')
      setShowNewProjectForm(false)
    } catch (err) {
      console.error('Failed to create project:', err)
    }
  }

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    const token = auth.getToken()
    if (!token) return
    try {
      await api.updateTask(token, taskId, { status: newStatus })
      const updatedTasks = await api.getTasks(token, filterStatus || undefined, selectedProjectId ?? undefined)
      setTasks(updatedTasks)
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  const handleRestoreTask = async (taskId: number) => {
    const token = auth.getToken()
    if (!token) return
    try {
      await api.restoreTask(token, taskId)
      setTasks(tasks.filter((t) => t.id !== taskId))
    } catch (err) {
      console.error('Failed to restore task:', err)
    }
  }

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditPriority(task.priority)
    setEditDueDate(task.due_date ? task.due_date.split('T')[0] : '')
  }

  const cancelEditing = () => {
    setEditingTaskId(null)
    setEditTitle('')
    setEditDescription('')
    setEditPriority('medium')
    setEditDueDate('')
  }

  const saveEditing = async (taskId: number) => {
    const token = auth.getToken()
    if (!token) return

    try {
      await api.updateTask(token, taskId, {
        title: editTitle,
        description: editDescription || undefined,
        priority: editPriority,
        due_date: editDueDate || null,
      })
      const updatedTasks = await api.getTasks(token, filterStatus || undefined, selectedProjectId ?? undefined)
      setTasks(updatedTasks)
      cancelEditing()
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-foreground/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => {
          setSelectedProjectId(id)
          setShowTrash(false)
        }}
        onCreateProject={() => setShowNewProjectForm(true)}
      />

      <main className="flex-1 p-6 md:p-12">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {showTrash ? 'Trash Bin' : selectedProjectId ? projects.find((p) => p.id === selectedProjectId)?.name : 'Inbox'}
            </h1>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" onClick={handleLogout}>
                Log out
              </Button>

              <div className="flex rounded-lg border border-foreground/10 overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === 'list' ? 'bg-accent text-background' : 'bg-background hover:bg-foreground/5'
                  }`}
                >
                  📋 List
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === 'kanban' ? 'bg-accent text-background' : 'bg-background hover:bg-foreground/5'
                  }`}
                >
                  📊 Kanban
                </button>
              </div>

              {!showTrash && (
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                  {showCreateForm ? 'Cancel' : 'New Task'}
                </Button>
              )}
              <Button variant={showTrash ? 'primary' : 'ghost'} onClick={() => setShowTrash(!showTrash)}>
                {showTrash ? '← Back' : 'View Trash'}
              </Button>
            </div>
          </div>

          {showNewProjectForm && (
            <form onSubmit={handleCreateProject} className="mb-8 rounded-lg border border-foreground/10 p-6">
              <Input
                id="projectName"
                label="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Website Redesign"
                required
              />
              <div className="mt-4 flex items-center gap-4">
                <label className="text-sm font-medium">Color:</label>
                <input
                  type="color"
                  value={newProjectColor}
                  onChange={(e) => setNewProjectColor(e.target.value)}
                  className="h-8 w-16 cursor-pointer rounded border border-foreground/20"
                />
                <Button type="submit">Create Project</Button>
                <Button type="button" variant="ghost" onClick={() => setShowNewProjectForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {!showTrash && viewMode === 'list' && (
            <div className="mb-6 flex flex-wrap gap-2">
              {['', 'todo', 'in_progress', 'review', 'done'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                    filterStatus === status ? 'bg-accent text-background' : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                  }`}
                >
                  {status === '' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
          )}

          {!showTrash && showCreateForm && (
            <form onSubmit={handleCreateTask} className="mb-8 rounded-lg border border-foreground/10 p-6">
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

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="low">🔵 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Due Date (optional)</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4">
                Create Task
              </Button>
            </form>
          )}

          {tasks.length === 0 ? (
            <div className="rounded-lg border border-foreground/10 p-12 text-center">
              <p className="text-foreground/60">
                {showTrash ? 'Trash is empty.' : 'No tasks here yet. Create your first one!'}
              </p>
            </div>
          ) : viewMode === 'kanban' && !showTrash ? (
            <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-start justify-between rounded-lg border p-4 transition-colors ${
                    showTrash
                      ? 'border-foreground/5 bg-foreground/5 opacity-75 hover:opacity-100'
                      : 'border-foreground/10 hover:border-accent/30'
                  }`}
                >
                  {editingTaskId === task.id ? (
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                        autoFocus
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Add some details..."
                        className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                        rows={2}
                      />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium">Priority</label>
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          >
                            <option value="low">🔵 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium">Due Date</label>
                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEditing(task.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEditing}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span title={`${task.priority} priority`}>{getPriorityBadge(task.priority)}</span>
                        <h3 className={`font-semibold ${task.status === 'done' ? 'line-through text-foreground/50' : ''}`}>
                          {task.title}
                        </h3>
                      </div>
                      {task.description && (
                        <p className={`mt-1 text-sm ${task.status === 'done' ? 'text-foreground/30 line-through' : 'text-foreground/60'}`}>
                          {task.description}
                        </p>
                      )}
                      {task.due_date && (
                        <p
                          className={`mt-1 text-xs ${
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
                  )}

                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                    {showTrash ? (
                      <button
                        onClick={() => handleRestoreTask(task.id)}
                        className="rounded bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-500 transition-colors hover:bg-green-500/20"
                      >
                        ♻️ Restore
                      </button>
                    ) : editingTaskId === task.id ? null : (
                      <>
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

                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(task)}
                            className="rounded px-3 py-1.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/10"
                          >
                            ✏️ Edit
                          </button>
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
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>
    </div>
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
