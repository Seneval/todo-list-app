'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Clock, Search } from 'lucide-react'
import { useTaskContext } from "../contexts/TaskContext"
import { TaskForm } from "./TaskForm"
import TaskItem from "./TaskItem"
import { Priority } from "@/types"

export default function MainContent() {
  const { 
    activeView,
    projects,
    getTodayTasks,
    getOverdueTasks,
    getUpcomingTasks,
    getProjectTasks,
    searchTasks,
    filterTasks
  } = useTaskContext()

  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('')
  const [completedFilter, setCompletedFilter] = useState<'all' | 'completed' | 'pending'>('all')

  let tasks = []
  let title = ''

  switch (activeView) {
    case 'today':
      tasks = getTodayTasks()
      title = 'Today'
      break
    case 'upcoming':
      tasks = getUpcomingTasks()
      title = 'Upcoming'
      break
    default:
      const project = projects.find(p => p.id === activeView)
      if (project) {
        tasks = getProjectTasks(project.id)
        title = project.name
      }
  }

  // Apply search
  if (searchQuery) {
    tasks = searchTasks(searchQuery)
  }

  // Apply filters
  if (priorityFilter || completedFilter !== 'all') {
    tasks = filterTasks({
      priority: priorityFilter as Priority | undefined,
      completed: completedFilter === 'completed'
    })
  }

  const overdueTasks = getOverdueTasks()

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{tasks.length} tasks</p>
        </div>
        <div className="px-6 py-2 border-t flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={completedFilter} 
            onValueChange={(value: 'all' | 'completed' | 'pending') => setCompletedFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-8">
          {overdueTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <h2 className="font-semibold">Overdue</h2>
                </div>
                <Button variant="outline" size="sm" className="text-red-500">
                  Reschedule
                </Button>
              </div>
              <div className="space-y-2">
                {overdueTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
              <TaskForm defaultProjectId={activeView !== 'today' && activeView !== 'upcoming' ? activeView : undefined} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

