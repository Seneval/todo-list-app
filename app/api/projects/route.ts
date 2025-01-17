import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Get all projects
export async function GET() {
  const projects = db.prepare('SELECT * FROM projects').all();
  return NextResponse.json(projects);
}

// Create new project
export async function POST(request: Request) {
  const { name } = await request.json();
  
  const stmt = db.prepare('INSERT INTO projects (name) VALUES (?)');
  const result = stmt.run(name);
  
  return NextResponse.json({ id: result.lastInsertRowid });
}

// Update project
export async function PUT(request: Request) {
  const { id, name } = await request.json();
  
  const stmt = db.prepare('UPDATE projects SET name = ? WHERE id = ?');
  stmt.run(name, id);
  
  return NextResponse.json({ success: true });
}

// Delete project
export async function DELETE(request: Request) {
  const { id } = await request.json();
  
  const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
  stmt.run(id);
  
  return NextResponse.json({ success: true });
}
