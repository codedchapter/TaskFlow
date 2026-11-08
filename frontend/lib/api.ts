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

export const api = {
  async register(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<{ id: number; email: string }>(response)
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<{ access_token: string; token_type: string }>(response)
  },

  async getTasks(token: string) {
    const response = await fetch(`${API_BASE}/tasks/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return handleResponse<Array<{ id: number; title: string; description: string | null; is_completed: boolean }>>(response)
  },

  async createTask(token: string, task: { title: string; description?: string; is_completed?: boolean }) {
    const response = await fetch(`${API_BASE}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    })
    return handleResponse<{ id: number; title: string; user_id: number }>(response)
  },
}
