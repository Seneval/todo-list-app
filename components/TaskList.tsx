import React from 'react'
import { Task } from '../contexts/TaskContext'
import TaskItem from './TaskItem'

type TaskListProps = {
  tasks: Task[]
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}

export default TaskList

