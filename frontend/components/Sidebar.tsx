'use client'

import { useState } from 'react'
import { Project } from '@/lib/api'

type SidebarProps = {
  projects: Project[]
  selectedProjectId: number | null
  onSelectProject: (id: number | null) => void
  onCreateProject: () => void
}

export default function Sidebar({ projects, selectedProjectId, onSelectProject, onCreateProject }: SidebarProps) {
  return (
    <aside className="hidden w-64 flex-col border-r border-foreground/10 bg-foreground/5 p-4 md:flex">
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight text-accent">TaskFlow</h2>
        <p className="text-xs text-foreground/50">Project Management</p>
      </div>

      <nav className="flex-1 space-y-1">
        {/* Inbox (No Project) */}
        <button
          onClick={() => onSelectProject(null)}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            selectedProjectId === null
              ? 'bg-accent text-background'
              : 'text-foreground hover:bg-foreground/10'
          }`}
        >
          <span>📥</span>
          Inbox
        </button>

        <div className="my-4 border-t border-foreground/10" />
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-foreground/40">Projects</p>

        {/* Project List */}
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              selectedProjectId === project.id
                ? 'bg-accent text-background'
                : 'text-foreground hover:bg-foreground/10'
            }`}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            {project.name}
          </button>
        ))}

        {/* Create Project Button */}
        <button
          onClick={onCreateProject}
          className="mt-4 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <span>➕</span>
          New Project
        </button>
      </nav>
    </aside>
  )
}
