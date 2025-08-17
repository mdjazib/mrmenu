"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/app/Logo'
import {
    ChefHat, Cookie, Headset, HeartHandshake, Loader,
    LogOut,
    PanelLeftClose,
    TvMinimal
} from 'lucide-react'
import { useStore } from '@/useStore'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'

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
                { href: "/dashboard", icon: <TvMinimal />, label: "Dashboard", external: false },
                { href: "/dashboard/categories", icon: <ChefHat />, label: "Categories", external: false },
                { href: "/dashboard/items", icon: <Cookie />, label: "Items", external: false },
                { href: "/dashboard/deals", icon: <HeartHandshake />, label: "Deals", external: false }
            ]
        },
        {
            heading: "Settings",
            items: [
                { href: "https://wa.me/+923214310717", icon: <Headset />, label: "Support", external: true },
                { href: "javascript:void(0)", icon: <LogOut />, label: "Logout", external: true }
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
                                            if (routing === "") {
                                                if (item.external) {
                                                    if (item.href === "javascript:void(0)") {
                                                        toast.promise(
                                                            new Promise((resolve, reject) => {
                                                                try {
                                                                    (async () => {
                                                                        await axios.post("/api/logout");
                                                                        resolve("You have been logged out successfully.");
                                                                        setTimeout(() => {
                                                                            window.location.reload();
                                                                        }, 2000);
                                                                    })();
                                                                } catch (error) {
                                                                    reject("Logout failed.")
                                                                }
                                                            }),
                                                            {
                                                                loading: "Logging out...",
                                                                success: (msg) => msg,
                                                                error: (msg) => msg,
                                                            }
                                                        )
                                                    } else {
                                                        window.open(item.href, "_blank");
                                                    }
                                                    e.preventDefault();
                                                    return;
                                                } else {
                                                    if (item.href === route.href) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    setRoute({ href: item.href, title: item.label });
                                                }
                                            } else {
                                                e.preventDefault();
                                                return;
                                            }
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
        </aside >
    )
}

export default Aside
