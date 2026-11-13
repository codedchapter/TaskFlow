const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'

type ApiError = {
  detail: string | Array<{ loc: string[]; msg: string }>
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json()
    const message = Array.isArray(error.detail)
      ? error.detail.map((e) => e.msg).join(', ')
      : error.detail
    throw new Error(message)
  }
  return response.json()
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

export const api = {
  async register(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<{ id: number; email: string; role: string }>(response)
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<{ access_token: string; token_type: string }>(response)
  },

  async getTasks(token: string, status?: string) {
    const url = status
      ? `${API_BASE}/tasks/?status=${status}`
      : `${API_BASE}/tasks/`
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return handleResponse<Task[]>(response)
  },

  async createTask(token: string, task: {
    title: string
    description?: string
    status?: TaskStatus
  }) {
    const response = await fetch(`${API_BASE}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    })
    return handleResponse<Task>(response)
  },

  async updateTask(token: string, taskId: number, updates: { status?: TaskStatus }) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
    return handleResponse<Task>(response)
  },

  async deleteTask(token: string, taskId: number) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to delete task')
    }
    return true
  },

    async getTrashTasks(token: string) {
    const response = await fetch(`${API_BASE}/tasks/trash`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return handleResponse<Task[]>(response)
  },

  async restoreTask(token: string, taskId: number) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/restore`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to restore task')
    }
    return response.json()
  }
}

export type Task = {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  user_id: number
  is_deleted: boolean
  created_at: string
}
