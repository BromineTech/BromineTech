"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import IssueModal from "./IssueModal"
import IssueCard from "./IssueCard"

// Types for our data structure
type Issue = {
  id: number
  title: string
  milestone: number
  assignedTo: string
}

type Column = {
  id: string
  title: string
  issues: Issue[]
}

export default function IssueTracker() {
  // State for columns and issues
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "in-progress",
      title: "In Progress",
      issues: [
        { id: 0, title: "issue 0", milestone: 0, assignedTo: "assignedTo" },
        { id: 1, title: "issue 1", milestone: 1, assignedTo: "assignedTo" },
      ],
    },
    {
      id: "todo",
      title: "Todo",
      issues: [
        { id: 2, title: "issue 2", milestone: 1, assignedTo: "assignedTo" },
        { id: 3, title: "issue 3", milestone: 2, assignedTo: "assignedTo" },
      ],
    },
    {
      id: "done",
      title: "Done",
      issues: [],
    },
  ])

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeColumn, setActiveColumn] = useState<string | null>(null)

  // Function to open modal for a specific column
  const openModal = (columnId: string) => {
    setActiveColumn(columnId)
    setIsModalOpen(true)
  }

  // Function to add a new issue
  const addIssue = (issue: Omit<Issue, "id">) => {
    if (!activeColumn) return

    setColumns(
      columns.map((column) => {
        if (column.id === activeColumn) {
          const newId = Math.max(0, ...column.issues.map((i) => i.id)) + 1
          return {
            ...column,
            issues: [...column.issues, { ...issue, id: newId }],
          }
        }
        return column
      }),
    )

    setIsModalOpen(false)
  }

  return (
    <div className="border border-gray-800 rounded-lg max-w-5xl mx-auto h-[90vh] flex flex-col">
      {/* Columns - Vertically Stacked */}
      <div className="space-y-4 p-4 flex-1 overflow-y-auto no-scrollbar">
        {columns.map((column) => (
          <div key={column.id} className="border border-gray-800 rounded-md flex flex-col">
            <div className="flex justify-between items-center p-3 border-b border-gray-800">
              <h3 className="font-medium">{column.title}</h3>
              <button
                className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-700 transition"
                onClick={() => openModal(column.id)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="p-2 space-y-2 flex-1 overflow-y-auto no-scrollbar">
              {column.issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        ))}
      </div>
  
      {/* Issue creation modal */}
      <IssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addIssue} />
    </div>
  );  
}
