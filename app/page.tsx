'use client'

import { useState } from 'react'
import { TaskProvider } from '../contexts/TaskContext'
import Sidebar from '../components/Sidebar'
import MainContent from '../components/MainContent'

export default function Home() {
  return (
    <TaskProvider>
      <div className="flex h-screen bg-[#fafafa]">
        <Sidebar />
        <MainContent />
      </div>
    </TaskProvider>
  )
}

