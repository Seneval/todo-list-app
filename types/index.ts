export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate?: Date
  projectId?: string
  projectName?: string
  color?: string
  priority?: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  color?: string
  taskCount: number
  createdAt: Date
  updatedAt: Date
}

export type View = 'today' | 'upcoming' | 'project'
export type Priority = 'low' | 'medium' | 'high'

export const PRIORITY_COLORS = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
}

