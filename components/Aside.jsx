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
        pathname !== route.href && setRouting(route.href);
    }, [pathname, route]);

    useEffect(() => {
        setRouting("");
        const allItems = menuGroups.flatMap(group => group.items);
        const match = allItems.find(item => item.href === pathname);
        setRoute({
            href: pathname,
            title: match ? match.label : ""
        });
    }, [pathname]);

    const menuGroups = [
        {
            heading: "Home",
            items: [
                { href: "/dashboard", icon: <TvMinimal />, label: "Dashboard" },
                { href: "/dashboard/categories", icon: <ChefHat />, label: "Categories" },
                { href: "/dashboard/items", icon: <Cookie />, label: "Items" },
                { href: "/dashboard/deals", icon: <HeartHandshake />, label: "Deals" }
            ]
        },
        {
            heading: "Customization",
            items: [
                { href: "/dashboard/brand-settings", icon: <Earth />, label: "Brand Settings" },
                { href: "/dashboard/menu-templates", icon: <QrCode />, label: "Print QR Templates" },
                { href: "/dashboard/restaurant-details", icon: <ReceiptText />, label: "Restaurant Details" },
                { href: "/dashboard/menu-theme", icon: <Palette />, label: "Menu Theme" }
            ]
        },
        {
            heading: "Billing",
            items: [
                { href: "/dashboard/subscription", icon: <Wallet />, label: "Subscription" },
                { href: "/dashboard/purchase", icon: <Stamp />, label: "Purchase" }
            ]
        },
        {
            heading: "Settings",
            items: [
                { href: "/dashboard/dashboard-theme", icon: <SunMoon />, label: "Dashboard Theme" },
                { href: "/dashboard/login-devices", icon: <TabletSmartphone />, label: "Login Devices" },
                { href: "/dashboard/account-details", icon: <User />, label: "Account Details" },
                { href: "/dashboard/support", icon: <Headset />, label: "Support" }
            ]
        }
    ];

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
                {menuGroups.map((group, gi) => (
                    <ul key={gi}>
                        <li className={sass.sticky}>
                            <span className={sass.heading}>{group.heading}</span>
                        </li>
                        <div className={sass.group}>
                            {group.items.map((item, ii) => (
                                <li key={ii}>
                                    <Link
                                        href={item.href}
                                        onClick={(e) => {
                                            if (item.href === route.href) {
                                                e.preventDefault();
                                                return;
                                            }
                                            setRoute({ href: item.href, title: item.label });
                                        }}
                                        className={route.href === item.href ? sass.active : ""}
                                    >
                                        {routing === item.href ? <Loader className={sass.routing} /> : item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </div>
                    </ul>
                ))}
            </nav>
        </aside>
    )
}

export default Aside
