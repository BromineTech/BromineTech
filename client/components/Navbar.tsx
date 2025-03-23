"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Users, Link as LinkIcon } from "lucide-react";
import InviteMembersDialog from "./PopUpEmail"; // import your modal

interface NavbarProps {
  onToggleProperties: () => void;
  isPropertiesOpen: boolean;
  className?: string;
}

const Navbar = ({ onToggleProperties, isPropertiesOpen }: NavbarProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "issues">("overview");
  const [copied, setCopied] = useState(false);
  const [tooltipText, setTooltipText] = useState("Copy Link");
  const [flipped, setFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const pathname = usePathname();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin + pathname);
    setCopied(true);
    setTooltipText("Link Copied!");

    setTimeout(() => setCopied(false), 1500);
    setTimeout(() => setTooltipText("Copy Link"), 1600);
  };

  const handleAddMemberClick = () => {
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  return (
    <div className="w-full max-w-full h-13 mx-auto border border-neutral-700 bg-[#121212] rounded-lg p-2 flex items-center mt-2">
      {/* Left section with tabs */}
      <div className="relative flex items-center mr-auto ml-3">
        <div
          className="absolute h-full w-24 bg-neutral-700 rounded-lg transition-all duration-300 ease-in-out z-0"
          style={{
            left: activeTab === "overview" ? "0px" : "98px",
          }}
        />
        <button
          className={`w-24 h-7 flex items-center justify-center text-sm font-medium z-10 transition-colors duration-300 ${
            activeTab === "overview" ? "text-white" : "text-neutral-400"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`w-24 h-7 flex items-center justify-center text-sm font-medium z-10 transition-colors duration-300 ${
            activeTab === "issues" ? "text-white" : "text-neutral-400"
          }`}
          onClick={() => setActiveTab("issues")}
        >
          Issues
        </button>
      </div>

      {/* Right section with icons */}
      <div className="flex items-center space-x-3 mr-2">
        <button
          className="text-neutral-400 hover:text-neutral-100 transition-colors relative group"
          onClick={handleAddMemberClick} // Open modal on click
        >
          <Users size={24} />
          <span className="absolute left-1/2 -translate-x-1/2 top-8 bg-neutral-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Add Member
          </span>
        </button>

        <div className="h-8 w-[1px] bg-neutral-600"></div>

        {/* Copy Link Button */}
        <button
          className="text-neutral-400 hover:text-neutral-100 transition-colors relative group"
          onClick={copyToClipboard}
        >
          <LinkIcon size={24} />
          <span
            className={`absolute left-1/2 -translate-x-1/2 top-8 bg-neutral-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
              copied ? "opacity-100" : ""
            }`}
          >
            {tooltipText}
          </span>
        </button>

        <div className="h-8 w-[2px] bg-neutral-600"></div>

        {/* Custom Tab Icon */}
        <button
          className={`relative w-8 h-8 right-1 flex items-center justify-center text-neutral-400 hover:text-white transition-colors group ${
            isPropertiesOpen ? "" : ""
          }`}
          onClick={() => {
            setFlipped(!flipped);
            onToggleProperties();
          }}
        >
          {/* Glow Effect on Hover */}
          <div
            className={`absolute w-12 h-12 left-0.5 rounded-full transition-all duration-500 ${
              flipped ? "opacity-0 scale-110" : "opacity-100 scale-90"
            }`}
          />

          {/* "B" Icon */}
          <div
            className={`relative w-5 h-5 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${
              flipped ? "translate-x-0" : "translate-x-6"
            }`}
          >
            {/* Vertical Bar */}
            <div className="absolute w-[2px] h-6 bg-current rounded-full left-0"></div>

            {/* Top Arc */}
            <div
              className={`absolute w-4 h-3 border-2 border-current rounded-tl-full rounded-tr-full left-1 top-0 transition-all duration-500 ${
                flipped ? "translate-x-0 rotate-90" : "translate-x-[-22px] rotate-[270deg]"
              }`}
            ></div>

            {/* Bottom Arc */}
            <div
              className={`absolute w-4 h-3 border-2 border-current rounded-bl-full rounded-br-full left-1 bottom-0 transition-all duration-500 ${
                flipped ? "translate-x-0 -rotate-90" : "translate-x-[-22px] -rotate-[270deg]"
              }`}
            ></div>
          </div>
        </button>
      </div>

      {/* Pass the modal state and handler to the InviteMembersDialog */}
      <InviteMembersDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={(emails) => console.log(emails)} // Handle form submit
      />
    </div>
  );
};

export default Navbar;
