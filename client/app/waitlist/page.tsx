"use client"
import { useState, useEffect, useRef } from "react";
import { BackgroundBeams } from "@/components/lightBeamBg";
import { PlaceholdersAndVanishInput } from "@/components/placeholdersvanishandinput"
import { Toaster, toast } from 'sonner';


export default function Waitlist() {
  const [formData, setFormData] = useState<string>('');
  const placeholders = [
    "Enter your email id",
    "Join the waitlist!"
  ];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading('Sending mail', { duration: 2000, position: 'top-center', invert: true })

    const token = "Bearer " + process.env.NEXT_PUBLIC_USE_PLUNK_API
    const mailSendResponse: any = await fetch('https://api.useplunk.com/v1/track', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
      body: JSON.stringify({
        "event": "joined-waitlist",
        "email": `${formData}`,
        "data": {
          "tag": "waitlist",
          "emailName": `${formData}`
        }
      })
    });
    const mailSend = await mailSendResponse.json()

    if (mailSend.success) {
      toast.success('Mail sent', {
        id: toastId,
        description: "Thank you for joining the waitlist"
      })

    }

    if (mailSend.error) {
      toast.error(`${mailSend.message}`, {
        id: toastId,
        description: `Please enter valid email address`
      })
    }

  };

  return (
  
    <div className="flex relative w-full h-screen justify-center  items-start mt-10">
      <BackgroundBeams />
      <div className="Globe flex flex-col gap-4 py-4 ">
        <div className="relative z-10 flex w-full  flex-col justify-start items-center gap-2">

          <p className="md:text-xl border-2 p-4 rounded-full border-gray-600 text-sm text-gray-300 font-semibold my-4">
            join the wailist
          </p>

        </div>
        <div className=" flex flex-col gap-4 justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-2 p-2">

            <p className="bg-gradient-to-br from-gray-400 via-white via-50% to-black text-transparent bg-clip-text p-2 text-2xl md:text-5xl font-semibold text-center">
              realtime and minimalist <br /> project  <br/>management tool <br/>{"                "}
            </p>
            <p className="md:text-xl text-sm text-gray-400 font-semibold">
              manage your projects with lesser distractions
            </p>
          </div>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setFormData(e.target.value)}
            onSubmit={onSubmit}
          />

        </div>

      </div>
      <Toaster />
      
    </div>
    
    
  );
}