"use client"
import React, { useEffect, useState } from 'react'
import sass from "./auth.module.sass"
import Logo from '../Logo'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import Countdown from "react-countdown";

const page = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ email: "", client: "", device: "", pixels: "" });
    const [state, setState] = useState({ phase: "email", action: "Continue" });
    useEffect(() => {
        const fpPromise = FingerprintJS.load();
        (async () => {
            const fp = await fpPromise
            const result = await fp.get()
            const visitorId = result.visitorId
            const pixels = window.innerWidth;
            const device = pixels < 520 ? "Mobile" : pixels < 1024 ? "Tablet" : "Desktop";
            setData((prev) => ({ ...prev, client: visitorId, device, pixels: pixels.toString() }));
        })()
    }, []);
    const authentication = async (e) => {
        e.preventDefault();
        try {
            if (!loading) {
                if (data.email.includes("@gmail.com") && data.email.length > 11) {
                    setLoading(true);
                    const formdata = new FormData();
                    Object.entries(data).forEach(([key, value]) => { formdata.append(key, value.trim()) });
                    formdata.append("phase", state.phase);
                    const { data: response } = await axios.post("/api/auth", formdata, { headers: { "Content-Type": "multipart/form-data" } });
                    setLoading(false);
                    if (response.status) {
                        toast.success(response.msg);
                    } else {
                        toast.error(response.msg);
                    }
                    setState({ phase: response.phase, action: response.action });
                } else {
                    toast.error("Email isn't valid.");
                }
            }
        } catch (error) {
            toast.error("Something went wrong.");
            setLoading(false);
        }
    }
    return (
        <div className={sass.auth}>
            <Logo className={sass.logo} />
            <div className={sass.header}>
                <h2>Mr Menu</h2>
                <p>Menus that change at your command.</p>
            </div>
            <form onSubmit={authentication}>
                <div className={sass.input}><input type="text" autoComplete='off' placeholder='Email' readOnly={loading || state.phase === "otp"} value={data.email} onChange={(e) => { setData((prev) => ({ ...prev, email: e.target.value })) }} /><p>Email</p></div>
                {loading ? <div className={sass.loader}><LoaderCircle /></div> : state.phase === "email" ? <input type="submit" value={state.action} disabled={loading} /> : <></>}
                {
                    state.phase === "otp" &&
                    <>
                        <div className={sass.redirecting}>
                            <div className={sass.timeout}></div>
                            <Countdown
                                date={Date.now() + 5000}
                                renderer={({ seconds, completed }) => {
                                    if (completed) {
                                        window.location.href = "https://mail.google.com/mail/u/0/#inbox/";
                                    } else {
                                        return <>{seconds < 0 ? <span>Redirecting to inbox</span> : <><b>{seconds}</b><span>Just a moment...</span></>}</>;
                                    }
                                }}
                            />
                        </div>
                    </>
                }
            </form>
        </div>
    )
}

export default page