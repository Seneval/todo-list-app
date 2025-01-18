'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Task, Project, Priority } from '@/types'
import { useToast } from '@/components/ui/use-toast'

interface TaskContextType {
  tasks: Task[]
  projects: Project[]
  activeView: string
  setActiveView: (view: string) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  addProject: (project: Omit<Project, 'id' | 'taskCount' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string, deleteTasks: boolean) => void
  getProjectTasks: (projectId: string) => Task[]
  getTodayTasks: () => Task[]
  getOverdueTasks: () => Task[]
  getUpcomingTasks: () => Task[]
  searchTasks: (query: string) => Task[]
  filterTasks: (options: { project?: string; priority?: Priority; completed?: boolean }) => Task[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activeView, setActiveView] = useState('today')
  const { toast } = useToast()

  // Load initial data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/projects')
        ]);
        
        if (!tasksRes.ok) throw new Error('Failed to fetch tasks');
        if (!projectsRes.ok) throw new Error('Failed to fetch projects');
        
        const tasksData = await tasksRes.json();
        const projectsData = await projectsRes.json();
        
        setTasks(tasksData || []);
        setProjects(projectsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: taskData.title,
          projectId: taskData.projectId
        })
      });
      
      const newTask = await response.json();
      const now = new Date();
      setTasks(prev => [...prev, { 
        ...taskData, 
        id: newTask.id.toString(),
        createdAt: now,
        updatedAt: now
      }]);
      toast({
        title: "Task created",
        description: "Your new task has been created successfully."
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          text: updates.title,
          completed: updates.completed
        })
      });
      
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'taskCount' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectData.name
        })
      });
      
      const responseData = await response.json();
      if (!responseData?.id) {
        throw new Error('Invalid project data received from server');
      }
      
      const now = new Date();
      setProjects(prev => [...prev, { 
        ...projectData, 
        id: responseData.id.toString(),
        taskCount: 0,
        createdAt: now,
        updatedAt: now
      }]);
      toast({
        title: "Project created",
        description: "Your new project has been created successfully."
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name: updates.name
        })
      });
      
      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...updates } : project
      ));
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
    }
  };

  const deleteProject = async (id: string, deleteTasks: boolean) => {
    try {
      await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      
      setProjects(prev => prev.filter(project => project.id !== id));
      if (deleteTasks) {
        setTasks(prev => prev.filter(task => task.projectId !== id));
      } else {
        setTasks(prev => prev.map(task => 
          task.projectId === id ? { ...task, projectId: undefined } : task
        ));
      }
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
  };

  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() < today.getTime() && !task.completed;
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() > today.getTime();
    });
  };

  const searchTasks = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filterTasks = (options: { project?: string; priority?: Priority; completed?: boolean }) => {
    return tasks.filter(task => {
      if (options.project && task.projectId !== options.project) return false;
      if (options.priority && task.priority !== options.priority) return false;
      if (options.completed !== undefined && task.completed !== options.completed) return false;
      return true;
    });
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      projects,
      activeView,
      setActiveView,
      addTask,
      updateTask,
      deleteTask,
      addProject,
      updateProject,
      deleteProject,
      getProjectTasks,
      getTodayTasks,
      getOverdueTasks,
      getUpcomingTasks,
      searchTasks,
      filterTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
