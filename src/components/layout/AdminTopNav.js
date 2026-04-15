"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import AdminDesktopTopNav from './AdminTopNav/AdminDesktopTopNav';
import AdminTabletTopNav from './AdminTopNav/AdminTabletTopNav';
import AdminMobileTopNav from './AdminTopNav/AdminMobileTopNav';

export default function AdminTopNav() {
    const pathname = usePathname();
    const { user, logout } = useAppContext();

    const tabs = [
        { name: 'OVERVIEW', href: '/admin' },
        { name: 'USERS', href: '/admin/users' },
        { name: 'ACTIVITIES', href: '/admin/activities' },
        { name: 'SCHEDULE', href: '/admin/schedule' },
        { name: 'TRACKING', href: '/admin/tracking' },
    ];

    const commonProps = {
        user,
        tabs,
        logout,
        pathname
    };

    return (
        <header className="fixed top-0 left-0 w-full z-40 flex flex-col">
            <AdminDesktopTopNav {...commonProps} />
            <AdminTabletTopNav {...commonProps} />
            <AdminMobileTopNav {...commonProps} />
        </header>
    );
}
