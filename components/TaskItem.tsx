'use client'

import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Task, PRIORITY_COLORS } from "@/types"
import { useTaskContext } from "@/contexts/TaskContext"

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask } = useTaskContext()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const handleComplete = () => {
    updateTask(task.id, { completed: !task.completed })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateTask(task.id, editedTask)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id)
    }
  }

  return (
    <>
      <div className="group flex items-start gap-3 rounded-lg border bg-white p-3 hover:border-primary">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={handleComplete}
          className="mt-1"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className={task.completed ? "line-through text-muted-foreground" : ""}>
              {task.title}
            </p>
            {task.priority && (
              <span className={`h-2 w-2 rounded-full ${PRIORITY_COLORS[task.priority]}`} />
            )}
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {task.dueDate && (
              <>
                <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                {task.projectName && <span>•</span>}
              </>
            )}
            {task.projectName && <span>{task.projectName}</span>}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              value={editedTask.title}
              onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
              placeholder="Task title"
              required
            />
            <Textarea
              value={editedTask.description || ''}
              onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}
              placeholder="Description (optional)"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Calendar
                mode="single"
                selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                onSelect={date => setEditedTask({ ...editedTask, dueDate: date })}
                className="rounded-md border"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

