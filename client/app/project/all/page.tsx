"use client"
import React, {useEffect} from 'react'
import Button from '@/components/Button'
import { redirect } from "next/navigation";
import TextEditor from "@/components/TipTapEditor"

const Page = () => {
  // useEffect(() => {
  //   const serverUrl: string = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";
  //   const fetchProjects = async (serverUrl: string) => {
  //     const res = await fetch(`${serverUrl}/project/all`, {
  //       // credentials: 'include', // Important if using cookies
  //     });
  //     const data = await res.json();
  //     localStorage.setItem('authToken', data.token); // Store token
  //     console.log(data.projects);
  //   };
  //   fetchProjects(serverUrl)
  // });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 ">
      <h1 className="text-2xl font-bold mb-6">Project Details</h1>
      
      {/* Document Name Editor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Document Name</label>
        <TextEditor
          type="singleLine"
          docId="doc-name"
          user={{ name: 'Alice', color: '#f783ac' }}
        />
      </div>

      {/* Description Editor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <TextEditor
          type="multiline"
          docId="doc-description"
          user={{ name: 'Alice', color: '#f783ac' }}
        />
      </div>

      
    </div>
  )
}

export default Page