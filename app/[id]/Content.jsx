"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import sass from "./menu.module.sass"
import Lottie from "lottie-react"
import loadingAnimation from "../loading.json"
import Doodles from './Doodles'
import Logo from '../Logo'
import { Link, Minus, Plus, X } from 'lucide-react'
import copy from 'copy-to-clipboard'

const Content = () => {
    const { id } = useParams();
    const [mrmenu, setMrMenu] = useState({});
    const [open, setOpen] = useState("");
    useEffect(() => {
        (
            async () => {
                try {
                    const { data } = await axios.get(`/api/${id}`);
                    data.status === 401 && toast.error(data.msg);
                    setMrMenu(data);
                } catch (error) {
                    toast.error("Something went wrong.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        )();
    }, []);
    return (
        <div className={sass.mrmenu}>
            {
                Object.keys(mrmenu).length ?
                    <div className={sass.mr}>
                        <header>
                            <div className={sass.col}><Logo className={sass.logo} /> <h2>Mr Menu </h2></div>
                            <div className={sass.btn} onClick={() => {
                                copy(window.location.href);
                                toast.success("Menu link successfully copied.");
                            }}><Link /></div>
                        </header>
                        <div className={sass.menu}>
                            <div className={`${sass.page} ${sass.main}`}>
                                <div className={`${sass.category} ${open === "deal" && sass.open}`}>
                                    <div className={sass.header} onClick={() => { setOpen("deal" === open ? "" : "deal") }}>
                                        <h3>Deals</h3>
                                        {open === "deal" ? <Minus /> : <Plus />}
                                    </div>
                                    <div className={sass.items}>
                                        <div className={sass.deals}>
                                            {
                                                mrmenu.deals.map((deal, i) => (
                                                    < div key={i} className={sass.deal}>
                                                        <div className={sass.iheader}>
                                                            <h2>{deal.name}</h2>
                                                            <div className={sass.col}>
                                                                <h5>{deal.price} Rs</h5>
                                                                <p>Save Rs. {deal.save}</p>
                                                            </div>
                                                        </div>
                                                        <table>
                                                            <tbody>
                                                                {
                                                                    deal.items.map((item, j) => (
                                                                        <tr key={j}>
                                                                            <td>{item.name}</td>
                                                                            <td>{item.quantity}</td>
                                                                            <td>{item.price} Rs</td>
                                                                        </tr>
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    mrmenu.items.map((category, i) => (
                                        <div key={i} className={`${sass.category} ${open === category.category && sass.open}`}>
                                            <div className={sass.header} onClick={() => { setOpen(category.category === open ? "" : category.category) }}>
                                                <h3>{category.category}</h3>
                                                {open === category.category ? <Minus /> : <Plus />}
                                            </div>
                                            <table className={sass.items}>
                                                <tbody>
                                                    {
                                                        category.items.map((item, j) => (
                                                            <tr key={j} className={sass.row}>
                                                                <td className={sass.name}><div className={sass.flex}>{item.inStock && <X className={sass.out} />}<span>{item.name}</span></div></td>
                                                                <td className={sass.price}>
                                                                    <div className={sass.flex}>
                                                                        {typeof item.price === "number" ? item.price :
                                                                            item.price.map((price, k) => (
                                                                                <p key={k}><b>{price.label}</b>{price.price}</p>
                                                                            ))
                                                                        } Rs
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div >
                    : <div className={sass.splash}>
                        <Doodles className={sass.doodles} />
                        <Lottie
                            animationData={loadingAnimation}
                            loop
                            autoplay
                            style={{ width: 150, height: 150 }}
                        />
                    </div>
            }
        </div >
    )
}

export default Content