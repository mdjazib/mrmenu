"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/app/Logo'
import {
    ChefHat, Cookie, Earth, Headset, HeartHandshake, Loader,
    Palette, PanelLeftClose, QrCode, ReceiptText, Stamp, SunMoon,
    TabletSmartphone, TvMinimal, User, Wallet
} from 'lucide-react'
import { useStore } from '@/useStore'
import { usePathname } from 'next/navigation'

const Aside = ({ sass }) => {
    const pathname = usePathname();
    const { route, setRoute } = useStore();
    const [routing, setRouting] = useState("");

    useEffect(() => {
        pathname !== route && setRouting(route);
    }, [pathname, route]);

    useEffect(() => {
        setRouting("");
    }, [pathname]);

    useEffect(() => {
        setRoute(pathname);
    }, []);

    const makeLink = (href, icon, label) => (
        <li>
            <Link
                href={href}
                onClick={(e) => {
                    if (href === route) {
                        e.preventDefault();
                        return;
                    }
                    setRoute(href);
                }}
                className={route === href ? sass.active : ""}
            >
                {routing === href ? <Loader className={sass.routing} /> : icon}
                <span>{label}</span>
            </Link>
        </li>
    );

    return (
        <aside>
            <div className={sass.header}>
                <Link href="/dashboard/">
                    <Logo />
                    <h2>Mr Menu</h2>
                </Link>
                <div className={sass.btn}>
                    <PanelLeftClose />
                </div>
            </div>
            <nav>
                <ul>
                    <li className={sass.sticky}>
                        <span className={sass.heading}>Home</span>
                    </li>
                    <div className={sass.group}>
                        {makeLink("/dashboard", <TvMinimal />, "Dashboard")}
                        {makeLink("/dashboard/categories", <ChefHat />, "Categories")}
                        {makeLink("/dashboard/items", <Cookie />, "Items")}
                        {makeLink("/dashboard/deals", <HeartHandshake />, "Deals")}
                    </div>
                </ul>
                <ul>
                    <li className={sass.sticky}>
                        <span className={sass.heading}>Customization</span>
                    </li>
                    <div className={sass.group}>
                        {makeLink("/dashboard/brand-settings", <Earth />, "Brand Settings")}
                        {makeLink("/dashboard/menu-templates", <QrCode />, "Print Templates")}
                        {makeLink("/dashboard/restaurant-details", <ReceiptText />, "Restaurant Details")}
                        {makeLink("/dashboard/menu-theme", <Palette />, "Menu Theme")}
                    </div>
                </ul>
                <ul>
                    <li className={sass.sticky}>
                        <span className={sass.heading}>Billing</span>
                    </li>
                    <div className={sass.group}>
                        {makeLink("/dashboard/subscription", <Wallet />, "Subscription")}
                        {makeLink("/dashboard/purchase", <Stamp />, "Purchase")}
                    </div>
                </ul>
                <ul>
                    <li className={sass.sticky}>
                        <span className={sass.heading}>Settings</span>
                    </li>
                    <div className={sass.group}>
                        {makeLink("/dashboard/dashboard-theme", <SunMoon />, "Dashboard Theme")}
                        {makeLink("/dashboard/login-devices", <TabletSmartphone />, "Login Devices")}
                        {makeLink("/dashboard/account-details", <User />, "Account Details")}
                        {makeLink("/dashboard/support", <Headset />, "Support")}
                    </div>
                </ul>
            </nav>
        </aside>
    )
}

export default Aside
