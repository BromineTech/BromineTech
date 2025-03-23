"use client";

import { useState } from "react";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

export default function CreateProjectModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ name: "", description: "" });

  const handleSubmit = () => {
    const newErrors = { name: "", description: "" };

    if (!projectName.trim()) {
      newErrors.name = "Project name is required";
    }

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.description) {
      onSubmit({ name: projectName, description });
      setProjectName("");
      setDescription("");
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#121216] bg-opacity-80"
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
    >
      <div
        className="bg-[#000000] text-sm text-gray-200 border border-neutral-700 rounded-lg shadow-lg p-6 sm:max-w-md w-full h-[380px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="create-project-title"
          className="text-xl font-semibold text-center text-gray-100 mb-4"
        >
          Create Project
        </h2>

        {/* Form Section: Centered */}
        <div className="flex flex-col justify-center flex-grow">
          <div className="space-y-6"> {/* Increased spacing between fields */}
            {/* Project Name */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
                className="w-full p-2 bg-transparent border-b border-neutral-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                aria-label="Project name"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="px-2 text-sm text-red-500" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: "" }));
                  }
                }}
                className="w-full p-2 bg-transparent border-b border-neutral-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                aria-label="Project description"
                aria-invalid={errors.description ? "true" : "false"}
              />
              {errors.description && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons: "Cancel" on the left, "Next" on the right */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="px-2 py-2 text-gray-300 border border-neutral-600 rounded hover:bg-[#e04444] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
