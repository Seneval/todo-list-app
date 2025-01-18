import { NextResponse } from 'next/server'
import { createTask, getTasks, toggleTask, supabase } from '@/lib/db/supabase'

export async function POST(request: Request) {
  const { projectId, text } = await request.json()
  
  try {
    const task = await createTask(projectId, text)
    if (!task) {
      throw new Error('Failed to create task')
    }
    
    // Transform to frontend format
    return NextResponse.json({
      id: task.id.toString(),
      title: task.text,
      projectId: task.project_id?.toString(),
      completed: task.completed || false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')

  try {
    const tasks = await getTasks(projectId ? Number(projectId) : undefined)
    return NextResponse.json(tasks?.map(task => ({
      id: task.id.toString(),
      title: task.text,
      projectId: task.project_id?.toString(),
      completed: task.completed || false,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    })) || [])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const { id, completed } = await request.json()
  
  try {
    const task = await toggleTask(id, completed)
    if (!task) {
      throw new Error('Failed to update task')
    }
    
    return NextResponse.json({
      id: task.id.toString(),
      title: task.text,
      projectId: task.project_id?.toString(),
      completed: task.completed,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
