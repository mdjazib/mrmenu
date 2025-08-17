"use client"
import React, { useEffect, useState } from 'react'
import sass from '../../app.module.sass'
import { Pen, PlusCircle, Trash } from 'lucide-react'
import { useStore } from '@/useStore'

const page = () => {
    const { route } = useStore();
    return (
        <div className={sass.content} style={{ paddingBottom: "20px" }}>
            <div className={sass.header}>
                <h2><span>{route.title}</span></h2>
                <div className={sass.cta}>
                    <div className={sass.new} onClick={() => { }}>
                        <PlusCircle /> <span>Add new</span>
                    </div>
                </div>
            </div>
            <div className={sass.deals}>
                {
                    [...Array(29)].map((_, i) => (
                        <div key={i} className={sass.deal}>
                            <div className={sass.dheader}>
                                <h2>Midnight</h2>
                                <div className={sass.col}>
                                    <h3>1850 Rs</h3>
                                    <p>Save Rs. 200</p>
                                </div>
                            </div>
                            <div className={sass.items}>
                                <div className={sass.item}>Pizza <span>0</span></div>
                                <div className={sass.item}>Burger <span>0</span></div>
                                <div className={sass.item}>Shawarma <span>0</span></div>
                                <div className={sass.item}>Coke <span>1</span></div>
                                <div className={sass.item}>Fries <span>-</span></div>
                            </div>
                            <div className={sass.cta}>
                                <div className={`${sass.btn} ${sass.delete}`}><Trash /><span>Delete</span></div>
                                <div className={sass.btn}><Pen /><span>Edit</span></div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page