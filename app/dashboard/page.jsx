"use client"
import { Loader, PlusCircle } from 'lucide-react'
import sass from '../app.module.sass'
import React, { useState } from 'react'
import { useStore } from '@/useStore'

const page = () => {
    const { route } = useStore();
    const [loading, setLoading] = useState(false);
    return (
        <>
            <div className={sass.content}>
                <div className={sass.header}>
                    <h2>{loading && <Loader />} <span>{route.title}</span></h2>
                </div>
            </div>
        </>
    )
}

export default page