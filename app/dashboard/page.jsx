"use client"
import { Loader, PlusCircle } from 'lucide-react'
import sass from '../app.module.sass'
import React, { useEffect, useState } from 'react'
import { useStore } from '@/useStore'
import QR from './QR'
import { toast } from 'sonner'
import axios from 'axios'

const page = () => {
    const { route } = useStore();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await axios.post("/api/dashboard");
                setLoading(false);
                setData(data);
            } catch (error) {
                toast.error("Something went wrong.");
                setLoading(false);
            }
        })();
    }, []);
    return (
        <>
            <div className={sass.content}>
                <div className={sass.header}>
                    <h2>{loading && <Loader />} <span>{route.title}</span></h2>
                </div>
                {!loading && <div className={sass.qrcode}><QR url={`${window.location.origin}/${data.username}`} /></div>}
            </div>
        </>
    )
}

export default page