import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth functions
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// Helper functions for projects
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createProject = async (name: string) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ name }])
    .select()
  
  if (error) throw error
  return data?.[0]
}

// Helper functions for tasks
export const getTasks = async (projectId?: number) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createTask = async (projectId: number, text: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ project_id: projectId, text }])
    .select()
  
  if (error) throw error
  return data?.[0]
}

export const toggleTask = async (taskId: number, completed: boolean) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', taskId)
    .select()
  
  if (error) throw error
  return data?.[0]
}

// Chat message functions
export const getMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export const createMessage = async (content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ content }])
    .select()
  
  if (error) throw error
  return data?.[0]
}

export const deleteMessage = async (messageId: number) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)
  
  if (error) throw error
}
