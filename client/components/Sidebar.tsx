"use client";

import { useState } from "react";

interface Activity {
  projectName: string;
  description: string;
}

const recentActivities: Activity[] = [
  {
    projectName: "Project Name",
    description: "You created this issue",
  },
  {
    projectName: "Project Name",
    description: "You assigned this issue to Rajeev...",
  },
];

export function AppSidebar() {
  const [sidebarWidth, setSidebarWidth] = useState(240); // Initial width in pixels
  const [isDragging, setIsDragging] = useState(false); // Track dragging state

  // Limit sidebar width to a range
  const handleDrag = (e: MouseEvent) => {
    const newWidth = e.clientX; // Get mouse X position
    if (newWidth >= 200 && newWidth <= 400) {
      setSidebarWidth(newWidth);
    }
  };

  const startDragging = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true); // Set dragging state to true
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDragging);
  };

  const stopDragging = () => {
    setIsDragging(false); // Set dragging state to false
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDragging);
  };

  return (
    <div
      className="relative bg-[#121212] text-sm text-white border border-neutral-700 rounded-md shadow-lg p-4 m-2 overflow-hidden"
      style={{
        height: "calc(100vh - 16px)", // Adjust height to account for margin
        width: `${sidebarWidth}px`,
        paddingTop: "16px",
        paddingBottom: "16px",
        paddingLeft: "12px",
      }}
    >
      {/* Resizer Handle */}
      <div
        className={`absolute top-0 right-0 h-full w-[2px] cursor-ew-resize transition-colors ${
          isDragging ? "bg-neutral-500" : "bg-neutral-600/10 hover:bg-neutral-500"
        }`}
        onMouseDown={startDragging}
      ></div>

      {/* Header Section */}
      <div className="border-b border-gray-700 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-neutral-600 rounded-full flex items-center justify-center">
            DP
          </div>
          <span className="text-sm font-medium">Rajeev Dewangan</span>
        </div>
        <div className="relative mt-4">
          <svg
            className="absolute left-3 top-2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-neutral-700 pl-10 py-1.5 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sidebar Content */}
      <div>
        {/* Projects Section */}
        <div className="group relative cursor-pointer mt-2 p-2 rounded-md bg-[#121212] hover:bg-neutral-900 text-white overflow-hidden">
          <span className="font-small">Projects</span>
          {/* Shine Effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        </div>

        {/* Recent Activities Section */}
        <div className="mt-2 pl-2">
          <p className="text-gray-400 text-sm mb-2">Recent Activities</p>
          <div>
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="group relative p-2 rounded-md bg-[#121212] hover:bg-neutral-900 text-white overflow-hidden"
              >
                <span className="text-sm font-medium">{activity.projectName}</span>
                <p className="text-xs text-gray-400">{activity.description}</p>
                {/* Shine Effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
