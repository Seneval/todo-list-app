'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusCircle, Search, Calendar, CalendarDays, Hash, ChevronDown, MoreHorizontal } from 'lucide-react'
import { useTaskContext } from "../contexts/TaskContext"
import { TaskForm } from "./TaskForm"
import { ProjectForm } from "./ProjectForm"

export default function Sidebar() {
  const { projects, activeView, setActiveView, deleteProject } = useTaskContext()

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Delete this project? You can choose to keep or delete its tasks.')) {
      const deleteTasks = window.confirm('Delete all tasks in this project?')
      deleteProject(projectId, deleteTasks)
      if (activeView === projectId) {
        setActiveView('today')
      }
    }
  }

  return (
    <div className="w-[300px] border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="font-medium">User Name</span>
          <ChevronDown className="w-4 h-4 ml-auto" />
        </div>
        <TaskForm />
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search"
            className="pl-8 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${activeView === 'today' ? 'bg-accent' : ''}`}
              onClick={() => setActiveView('today')}
            >
              <Calendar className="h-4 w-4" />
              Today
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${activeView === 'upcoming' ? 'bg-accent' : ''}`}
              onClick={() => setActiveView('upcoming')}
            >
              <CalendarDays className="h-4 w-4" />
              Upcoming
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Hash className="h-4 w-4" />
              Filters & Labels
            </Button>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">My Projects</h2>
              <ProjectForm />
            </div>
            <div className="space-y-1">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center group">
                  <Button
                    variant="ghost"
                    className={`flex-1 justify-start gap-2 ${activeView === project.id ? 'bg-accent' : ''}`}
                    onClick={() => setActiveView(project.id)}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                    <span className="ml-auto text-muted-foreground">
                      {project.taskCount}
                    </span>
                  </Button>
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
                      <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-red-600">
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

