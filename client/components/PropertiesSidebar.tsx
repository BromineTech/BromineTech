"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import type { Member, ProjectProperties, Status } from "../../types/properties";

const statusOptions: Status[] = ["Active", "Backlog", "Done"];
const MIN_WIDTH = 290; // Minimum width of the sidebar
const MAX_WIDTH = 350; // Maximum width of the sidebar

const defaultMembers: Member[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

interface PropertiesSidebarProps {
  defaultProperties?: Partial<ProjectProperties>;
  onPropertiesChange?: (properties: ProjectProperties) => void;
}

export function PropertiesSidebar({ defaultProperties, onPropertiesChange }: PropertiesSidebarProps) {
  const [properties, setProperties] = useState<ProjectProperties>({
    status: defaultProperties?.status ?? "Backlog",
    members: defaultProperties?.members ?? [],
    startDate: defaultProperties?.startDate ?? null,
    targetDate: defaultProperties?.targetDate ?? null,
  });

  // Set the sidebar's width to the minimum width on load
  const [width, setWidth] = useState(MIN_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handlePropertyChange = <K extends keyof ProjectProperties>(key: K, value: ProjectProperties[K]) => {
    const newProperties = { ...properties, [key]: value };
    setProperties(newProperties);
    onPropertiesChange?.(newProperties);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      if (sidebarRef.current) {
        const newWidth = window.innerWidth - e.clientX;
        setWidth(Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      ref={sidebarRef}
      className="relative space-y-4 p-4 mr-2 rounded-md shadow-lg bg-[#121212] border border-neutral-700"
      style={{
        width: `${width}px`,
        maxHeight: "calc(100vh - 16px)",
        overflowY: "auto",
        marginBottom: "10px",
        transition: isResizing ? 'none' : 'width 0.1s ease-in-out'
      }}
    >
      {/* Resize Handle */}
      <div
        className={`absolute left-0 top-0 w-[2px] h-full cursor-ew-resize ${isResizing ? "bg-neutral-500" : "bg-neutral-600/10 hover:bg-neutral-500"} transition-colors`}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
          document.body.style.cursor = 'ew-resize';
        }}
      />

      <h2 className="text-sm font-medium text-white/90">Properties</h2>

      <div className="space-y-2 pl-2">
        <div className="grid gap-y-2" style={{ gridTemplateColumns: '100px 1fr' }}>
          {/* Status */}
          <span className="text-xs text-white/70 font-medium">Status</span>
          <div className="pl-4">
            <select
              value={properties.status}
              onChange={(e) => handlePropertyChange("status", e.target.value as Status)}
              className="w-32 rounded p-1 text-xs bg-black/30 backdrop-blur-sm text-white/90 border border-white/10 hover:bg-black/40 transition-colors"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Members */}
          <span className="text-xs text-white/70 font-medium">Members</span>
          <div className="pl-4">
            <select
              value=""
              onChange={(e) => {
                const member = defaultMembers.find((m) => m.id === e.target.value);
                if (member) {
                  handlePropertyChange("members", [...properties.members, member]);
                }
              }}
              className="w-32 rounded p-1 text-xs bg-black/30 backdrop-blur-sm text-white/90 border border-white/10 hover:bg-black/40 transition-colors"
            >
              <option value="">Add members</option>
              {defaultMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <span className="text-xs text-white/70 font-medium">Start Date</span>
          <div className="pl-4">
            <input
              type="date"
              value={properties.startDate ? format(properties.startDate, "yyyy-MM-dd") : ""}
              onChange={(e) => handlePropertyChange("startDate", e.target.valueAsDate)}
              className="w-32 rounded p-1 text-xs bg-black/30 backdrop-blur-sm text-white/90 border border-white/10 hover:bg-black/40 transition-colors"
            />
          </div>

          {/* Target Date */}
          <span className="text-xs text-white/70 font-medium">Target Date</span>
          <div className="pl-4">
            <input
              type="date"
              value={properties.targetDate ? format(properties.targetDate, "yyyy-MM-dd") : ""}
              onChange={(e) => handlePropertyChange("targetDate", e.target.valueAsDate)}
              className="w-32 rounded p-1 text-xs bg-black/30 backdrop-blur-sm text-white/90 border border-white/10 hover:bg-black/40 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
