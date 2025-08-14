"use client"
import React from 'react'
import sass from "./app.module.sass"
import Aside from '@/components/Aside'

const page = () => {
  return (
    <div className={sass.cpanel}>
      <Aside sass={sass} />
      <main></main>
    </div>
  )
}

export default page