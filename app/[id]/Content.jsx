"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Content = () => {
    const { id } = useParams();
    const [mrmenu, setMrMenu] = useState({});
    useEffect(() => {
        (
            async () => {
                try {
                    const { data } = await axios.get(`/api/${id}`);
                    data === 401 && toast.error("Something went wrong.");
                    setMrMenu(data);
                } catch (error) {
                    toast.error("Something went wrong.");
                }
            }
        )();
    }, []);
    useEffect(() => {
        console.log(mrmenu);
    }, [mrmenu]);
    return (
        <div>Content</div>
    )
}

export default Content