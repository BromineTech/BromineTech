"use client"

import { useState } from "react"

// Props for the modal
type IssueModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (issue: { title: string; milestone: number; assignedTo: string }) => void
}

export default function IssueModal({ isOpen, onClose, onSubmit }: IssueModalProps) {
  const [issueName, setIssueName] = useState("")
  const [description, setDescription] = useState("")
  const [assignee, setAssignee] = useState("assignedTo")

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!issueName.trim()) return

    onSubmit({
      title: issueName,
      milestone: 0,
      assignedTo: assignee,
    })

    // Reset form
    setIssueName("")
    setDescription("")
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-black border border-gray-800 rounded-md w-full max-w-md p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Issue Name"
              value={issueName}
              onChange={(e) => setIssueName(e.target.value)}
              className="bg-transparent border-b border-gray-600 rounded-none px-0 h-10 text-lg focus-visible:ring-0 focus-visible:border-gray-400 w-full"
            />
          </div>

          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-transparent border-b border-gray-600 rounded-none px-0 min-h-24 resize-none focus-visible:ring-0 focus-visible:border-gray-400 w-full"
            />
          </div>

          <div className="pt-4">
            <button
              className="rounded-md border border-gray-700 text-white px-4 py-2"
              onClick={() => setAssignee("assignedTo")}
            >
              Assignee
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="rounded-md border border-gray-700 bg-transparent hover:bg-gray-800 px-4 py-2"
            onClick={handleSubmit}
          >
            Create Issue
          </button>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
