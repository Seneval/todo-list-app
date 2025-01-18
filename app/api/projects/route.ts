import { NextResponse } from 'next/server'
import { createProject, getProjects, supabase } from '@/lib/db/supabase'

export async function POST(request: Request) {
  const { name } = await request.json()
  
  try {
    const project = await createProject(name)
    if (!project) {
      throw new Error('Failed to create project')
    }
    
    // Transform to frontend format
    return NextResponse.json({
      id: project.id.toString(),
      name: project.name,
      taskCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const projects = await getProjects()
    // Transform to frontend format
    const formattedProjects = projects.map(project => ({
      id: project.id.toString(),
      name: project.name,
      taskCount: project.task_count || 0,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }))
    return NextResponse.json(formattedProjects)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const { id, name } = await request.json()
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ name })
      .eq('id', id)
      .select()
    
    if (error) throw error
    if (!data?.[0]) throw new Error('Project not found')
    // Transform to frontend format
    return NextResponse.json({
      id: data[0].id.toString(),
      name: data[0].name,
      taskCount: data[0].task_count || 0,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return NextResponse.json({ 
      success: true,
      id: id.toString() 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
