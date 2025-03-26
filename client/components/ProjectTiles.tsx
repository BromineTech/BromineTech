"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import CreateProjectModal from "./CreateProjectModal"
import InviteMembersDialog from "./PopUpEmail"

interface Project {
  name: string
  issuesCount: number
  startDate: string
  targetDate: string
  description?: string
}

export function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "Project Name",
      issuesCount: 12,
      startDate: "12.10.24",
      targetDate: "20.12.24",
    },
    {
      name: "Project Name",
      issuesCount: 4,
      startDate: "15.12.24",
      targetDate: "29.01.25",
    },
  ])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [newProject, setNewProject] = useState<Partial<Project>>({})

  const handleCreateProject = (projectData: { name: string; description: string }) => {
    setNewProject({
      name: projectData.name,
      description: projectData.description,
      issuesCount: 0,
      startDate: new Date()
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
        .replace(/\//g, "."),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
        .replace(/\//g, "."),
    })

    setIsCreateModalOpen(false)
    setIsInviteModalOpen(true)
  }

  const handleInviteMembers = (emails: string[]) => {
    if (newProject.name) {
      setProjects([
        {
          name: newProject.name,
          description: newProject.description,
          issuesCount: newProject.issuesCount || 0,
          startDate: newProject.startDate || "",
          targetDate: newProject.targetDate || "",
        },
        ...projects,
      ])
    }

    setNewProject({})
    setIsInviteModalOpen(false)
  }

  return (
    <div className="flex-1 px-2 py-6 overflow-auto">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-white">Your Projects</h1>
          <button
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md px-4 py-2 text-sm transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Create New Project
          </button>
        </div>

        <div className="bg-[#121212] border border-neutral-700 rounded-md shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 text-sm text-gray-400 p-4 border-b border-neutral-700">
            <div>Name</div>
            <div>No. of issues opened</div>
            <div>Start Date</div>
            <div>Target Date</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col gap-2 p-2">
            {projects.map((project, index) => (
              <div
                key={index}
                className="grid grid-cols-4 p-4 text-white text-sm bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <div className="font-medium">{project.name}</div>
                <div>{project.issuesCount}</div>
                <div>{project.startDate}</div>
                <div>{project.targetDate}</div>
              </div>
            ))}

            {/* Empty project slots */}
            {/* {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="grid grid-cols-4 p-4 text-transparent text-sm bg-neutral-900 rounded-md"
              >
                <div className="font-medium">placeholder</div>
                <div>0</div>
                <div>00.00.00</div>
                <div>00.00.00</div>
              </div>
            ))} */}
          </div>
        </div>
      </div>

      <CreateProjectModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSubmit={handleCreateProject} />

      <InviteMembersDialog
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onSubmit={handleInviteMembers}
      />
    </div>
  )
}

