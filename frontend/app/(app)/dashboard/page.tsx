'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { api, Task, TaskStatus, TaskPriority, Project } from '@/lib/api'
import { auth } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import TaskList from '@/components/tasks/TaskList'
import CreateTaskForm from '@/components/tasks/CreateTaskForm'

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [showTrash, setShowTrash] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

  // 3. FETCH PROJECTS (Only runs ONCE on mount)
  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/login')
      return
    }
    api.getProjects(token).then(setProjects).catch(() => {
      auth.clearToken()
      router.push('/login')
    })
  }, [router])

  // 4. FETCH TASKS (Only runs when filters change)
  useEffect(() => {
    const token = auth.getToken()
    if (!token) return

    setLoading(true)
    const fetchTasks = async () => {
      try {
        const data = showTrash
          ? await api.getTrashTasks(token)
          : await api.getTasks(token, filterStatus || undefined, selectedProjectId ?? undefined)
        setTasks(data)
      } catch {
        auth.clearToken()
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [filterStatus, showTrash, selectedProjectId, router])

  // 5. HANDLERS (Wrapped in useCallback to prevent unnecessary re-renders)
  const handleLogout = useCallback(() => {
    auth.clearToken()
    router.push('/login')
  }, [router])

  const handleCreateTask = useCallback(async (taskData: { title: string; description?: string; priority: TaskPriority; due_date?: string }) => {
    const token = auth.getToken()
    if (!token) return
    try {
      await api.createTask(token, { ...taskData, status: 'todo', project_id: selectedProjectId ?? undefined })
      const updatedTasks = await api.getTasks(token, filterStatus || undefined, selectedProjectId ?? undefined)
      setTasks(updatedTasks)
      setShowCreateForm(false)
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }, [filterStatus, selectedProjectId])

  const handleCreateProject = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const token = auth.getToken()
    if (!token) return
    const form = e.target as HTMLFormElement
    const nameInput = form.elements.namedItem('projectName') as HTMLInputElement
    const colorInput = form.elements.namedItem('projectColor') as HTMLInputElement

    try {
      const newProject = await api.createProject(token, { name: nameInput.value, color: colorInput.value })
      setProjects((prev) => [...prev, newProject])
      setSelectedProjectId(newProject.id)
      setShowProjectForm(false)
      form.reset()
    } catch (err) {
      console.error('Failed to create project:', err)
    }
  }, [])

  const handleStatusChange = useCallback(async (taskId: number, newStatus: TaskStatus) => {
    const token = auth.getToken()
    if (!token) return
    try {
      await api.updateTask(token, taskId, { status: newStatus })
      const updatedTasks = await api.getTasks(token, filterStatus || undefined, selectedProjectId ?? undefined)
      setTasks(updatedTasks)
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }, [filterStatus, selectedProjectId])

  const handleDeleteTask = useCallback(async (taskId: number) => {
    if (!confirm('Are you sure?')) return
    const token = auth.getToken()
    if (!token) return
    try {
      await api.deleteTask(token, taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }, [])

  const handleRestoreTask = useCallback(async (taskId: number) => {
    const token = auth.getToken()
    if (!token) return
    try {
      await api.restoreTask(token, taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (err) {
      console.error('Failed to restore task:', err)
    }
  }, [])

  const handleEditTask = useCallback((taskId: number) => setEditingTaskId(taskId), [])
  const handleCancelEdit = useCallback(() => setEditingTaskId(null), [])

  const handleSaveTask = useCallback(async (taskId: number, updates: any) => {
    const token = auth.getToken()
    if (!token) return
    try {
      await api.updateTask(token, taskId, updates)
      const updatedTasks = await api.getTasks(token, filterStatus || undefined, selectedProjectId ?? undefined)
      setTasks(updatedTasks)
      setEditingTaskId(null)
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }, [filterStatus, selectedProjectId])

  const handleSelectProject = useCallback((id: number | null) => {
    setSelectedProjectId(id)
    setShowTrash(false)
  }, [])

  if (loading && projects.length === 0) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-foreground/60">Loading...</p></div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={() => setShowProjectForm(true)}
      />

      <main className="flex-1 p-6 md:p-12">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {showTrash ? 'Trash Bin' : selectedProjectId ? projects.find((p) => p.id === selectedProjectId)?.name : 'Inbox'}
            </h1>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" onClick={handleLogout}>Log out</Button>
              <div className="flex rounded-lg border border-foreground/10 overflow-hidden">
                <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-accent text-background' : 'bg-background hover:bg-foreground/5'}`}>📋 List</button>
                <button onClick={() => setViewMode('kanban')} className={`px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-accent text-background' : 'bg-background hover:bg-foreground/5'}`}>📊 Kanban</button>
              </div>
              {!showTrash && <Button onClick={() => setShowCreateForm(!showCreateForm)}>{showCreateForm ? 'Cancel' : 'New Task'}</Button>}
              <Button variant={showTrash ? 'primary' : 'ghost'} onClick={() => setShowTrash(!showTrash)}>{showTrash ? '← Back' : 'View Trash'}</Button>
            </div>
          </div>

          {showProjectForm && (
            <form onSubmit={handleCreateProject} className="mb-8 rounded-lg border border-foreground/10 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input name="projectName" required placeholder="e.g., Website Redesign" className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Color:</label>
                <input name="projectColor" type="color" defaultValue="#FF6B4A" className="h-8 w-16 cursor-pointer rounded border border-foreground/20" />
                <Button type="submit">Create Project</Button>
                <Button type="button" variant="ghost" onClick={() => setShowProjectForm(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {!showTrash && showCreateForm && (
            <CreateTaskForm onSubmit={handleCreateTask} onCancel={() => setShowCreateForm(false)} />
          )}

          {!showTrash && viewMode === 'list' && (
            <div className="mb-6 flex flex-wrap gap-2">
              {['', 'todo', 'in_progress', 'review', 'done'].map((status) => (
                <button key={status} onClick={() => setFilterStatus(status)} className={`rounded px-3 py-1 text-sm font-medium transition-colors ${filterStatus === status ? 'bg-accent text-background' : 'bg-foreground/10 text-foreground hover:bg-foreground/20'}`}>
                  {status === '' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
          )}

          {viewMode === 'kanban' && !showTrash ? (
            <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
          ) : (
            <TaskList
              tasks={tasks}
              editingTaskId={editingTaskId}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onSave={handleSaveTask}
              onCancel={handleCancelEdit}
            />
          )}
        </Container>
      </main>
    </div>
  )
}
