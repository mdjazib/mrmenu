"use client"
import axios from 'axios';
import { usePathname } from 'next/navigation'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import React, { useEffect, useState } from 'react'
import sass from "./app.module.sass"
import Logo from './Logo';

const Authentication = ({ children }) => {
    const pathname = usePathname();
    const [fingerprint, setFingerprint] = useState("");
    const [loading, setLoading] = useState(true);
    const [appHide, setAppHide] = useState(true);
    useEffect(() => {
        const fpPromise = FingerprintJS.load();
        (async () => {
            const fp = await fpPromise;
            const result = await fp.get();
            const visitorId = result.visitorId;
            setFingerprint(visitorId);
        })()
    }, []);
    useEffect(() => {
        if (pathname === "/" && fingerprint !== "") {
            document.addEventListener("visibilitychange", () => { authenticaiton() });
            document.addEventListener("mouseenter", () => { authenticaiton() })
            const authenticaiton = async () => {
                const { data } = await axios.get(`/api/verify?f=${fingerprint}`, { headers: { "Content-Type": "multipart/form-data" } });
                setTimeout(() => { setAppHide(!data) }, 1000);
                if (!data) window.location.reload();
                setLoading(!data);
            }
            authenticaiton();
        }
    }, [fingerprint]);
    return appHide && pathname === "/" ?
        <div className={sass.app}>
            <div className={sass.splash}>
                <Logo />
                <h2>Mr Menu</h2>
                <div className={sass.loading}>
                    <div className={loading ? sass.ba : sass.bar}></div>
                </div>
                <p>Ensuring Mr knows this device.</p>
            </div>
        </div >
        :
        <div className={sass.app}>
            {children}
        </div>

}

export default Authentication