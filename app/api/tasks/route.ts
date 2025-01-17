import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Get all tasks
export async function GET() {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  return NextResponse.json(tasks);
}

// Create new task
export async function POST(request: Request) {
  const { text, projectId } = await request.json();
  
  const stmt = db.prepare('INSERT INTO tasks (text, project_id) VALUES (?, ?)');
  const result = stmt.run(text, projectId);
  
  return NextResponse.json({ id: result.lastInsertRowid });
}

// Update task
export async function PUT(request: Request) {
  const { id, text, completed } = await request.json();
  
  const stmt = db.prepare('UPDATE tasks SET text = ?, completed = ? WHERE id = ?');
  stmt.run(text, completed, id);
  
  return NextResponse.json({ success: true });
}

// Delete task
export async function DELETE(request: Request) {
  const { id } = await request.json();
  
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id);
  
  return NextResponse.json({ success: true });
}
