"use client"
import React, { useEffect } from 'react'
import sass from "../app.module.sass"
import Aside from '@/components/Aside'
import Authentication from '../Authentication'

const layout = ({ children }) => {
  return (
    <Authentication>
      <div className={sass.cpanel}>
        <Aside sass={sass} />
        <main>{children}</main>
      </div>
    </Authentication>
  )
}

export default layout