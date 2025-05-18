"use client"
import React, {useEffect} from 'react'
import Button from '@/components/Button'
import { redirect } from "next/navigation";


const Page = () => {
  useEffect(() => {
    const serverUrl: string = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";
    const fetchProjects = async (serverUrl: string) => {
      const res = await fetch(`${serverUrl}/project/all`, {
        // credentials: 'include', // Important if using cookies
      });
      const data = await res.json();
      localStorage.setItem('authToken', data.token); // Store token
      console.log(data.projects);
    };
    fetchProjects(serverUrl)
  });

  return (
    <div>Project/all</div>
  )
}

export default Page