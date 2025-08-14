"use client"
import React from 'react'
import Link from 'next/link'
import Logo from '@/app/Logo'
import { ChefHat, Cookie, Earth, Headset, HeartHandshake, Palette, PanelLeftClose, QrCode, ReceiptText, Stamp, SunMoon, TabletSmartphone, TvMinimal, User, Wallet } from 'lucide-react'

const Aside = ({ sass }) => {
    return (
        <aside>
            <div className={sass.header}>
                <Link href="/">
                    <Logo />
                    <h2>Mr Menu</h2>
                </Link>
                <div className={sass.btn}>
                    <PanelLeftClose />
                </div>
            </div>
            <nav>
                <ul>
                    <li><span className={sass.heading}>Home</span></li>
                    <div className={sass.group}>
                        <li><Link href="/"><TvMinimal /><span>Dashboard</span></Link></li>
                        <li><Link href="/categories"><ChefHat /><span>Categories</span></Link></li>
                        <li><Link href="/items"><Cookie /><span>Items</span></Link></li>
                        <li><Link href="/deals"><HeartHandshake /><span>Deals</span></Link></li>
                    </div>
                </ul>
                <ul>
                    <li><span className={sass.heading}>Customization</span></li>
                    <div className={sass.group}>
                        <li><Link href="/brand-settings"><Earth /><span>Brand Settings</span></Link></li>
                        <li><Link href="/menu-templates"><QrCode /><span>Print Templates</span></Link></li>
                        <li><Link href="/restaurant-details"><ReceiptText /><span>Restaurant Details</span></Link></li>
                        <li><Link href="/menu-theme"><Palette /><span>Menu Theme</span></Link></li>
                    </div>
                </ul>
                <ul>
                    <li><span className={sass.heading}>Billing</span></li>
                    <div className={sass.group}>
                        <li><Link href="/subscription"><Wallet /><span>Subscription</span></Link></li>
                        <li><Link href="/purchase"><Stamp /><span>Purchase</span></Link></li>
                    </div>
                </ul>
                <ul>
                    <li><span className={sass.heading}>Settings</span></li>
                    <div className={sass.group}>
                        <li><Link href="/dashboard-theme"><SunMoon /><span>Dashboard Theme</span></Link></li>
                        <li><Link href="/login-devices"><TabletSmartphone /><span>Login Devices</span></Link></li>
                        <li><Link href="/account-details"><User /><span>Account Details</span></Link></li>
                        <li><Link href="/support"><Headset /><span>Support</span></Link></li>
                    </div>
                </ul>
            </nav>
        </aside>
    )
}

export default Aside