"use client"
import React from 'react'
import TextEditor from "@/components/TextEditor"
import { EditorType } from '@/components/TextEditor'

const All = () => {
  return (
    <div>Project/all
      <div className="h-full w-full">
      <TextEditor type={EditorType.SingleLine}/>
      </div>
    </div>
  )
}

export default All;