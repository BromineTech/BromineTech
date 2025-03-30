"use client";
import { AppSidebar } from "@/components/Sidebar";
import { ProjectDashboard } from "@/components/ProjectTiles";
import { useState } from "react";
import InviteMembersDialog from "@/components/PopUpEmail";
import Navbar from '@/components/Navbar';
import { PropertiesSidebar } from "@/components/PropertiesSidebar"
import Image from "next/image";
import { redirect } from "next/navigation";
import IssueTracker from "@/components/IssueTracker";
export default function Home() {
  const [open, setOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  //redirect('/waitlist');

  return (
    // <div className="flex h-screen bg-zinc-900">
    //   {/* Left Sidebar */}
    //   <AppSidebar />
      
    //   {/* Main Content Wrapper */}
    //   <div className="flex flex-col flex-1">
    //     {/* Navbar: Full width, positioned after the sidebar */}
    //     <div className="flex-shrink-0 mr-2 mb-2">
    //       <Navbar
    //         isPropertiesOpen={isPropertiesOpen}
    //         onToggleProperties={() => setIsPropertiesOpen(!isPropertiesOpen)}
    //         className="w-full px-6 py-4" // Apply the same padding as the sidebar
    //       />
    //     </div>

    //     {/* Content Area with Properties Sidebar */}
    //     <div className="flex flex-1">
    //       {/* Main Content Section */}
    //       <div className="flex-1 pr-2 pb-50">
    //         <IssueTracker />
    //       </div>
    //       {/* <div className="flex-1 p-6">
    //         <h1 className="text-2xl font-semibold">Project Overview</h1>
    //       </div> */}

    //       {/* Properties Sidebar (Only shown when toggled) */}
    //       {isPropertiesOpen && (
    //         <PropertiesSidebar
    //           defaultProperties={{
    //             status: "Backlog",
    //             members: [],
    //             startDate: null,
    //             targetDate: null,
    //           }}
    //         />
    //       )}
    //     </div>
    //   </div>
    // </div>
    
    // <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
    //   <Navbar />
    // </main>

    <div className="flex h-screen bg-[#0a0a0a]">
      <AppSidebar />
      <ProjectDashboard />
    </div>

    // <div className="flex bg-[#121216]">
    //   <AppSidebar/>
    //   <div className="flex-1 p-8">Hello there
    //   <div className="flex min-h-screen items-center justify-center">
    //   <button onClick={() => setOpen(true)}>Invite Members</button>
    //   <InviteMembersDialog open={open} onOpenChange={setOpen} />
    // </div>
    //   </div>
    // </div>

    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //   hello
    // </main>
  );
}
