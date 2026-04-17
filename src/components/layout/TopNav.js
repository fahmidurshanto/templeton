"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import DesktopTopNav from './TopNav/DesktopTopNav';
import TabletTopNav from './TopNav/TabletTopNav';
import MobileTopNav from './TopNav/MobileTopNav';

export default function TopNav() {
    const pathname = usePathname();
    const { user, activeTab, setActiveTab, logout } = useAppContext();
    const tabs = ['DASHBOARD', 'PERSONAL', 'MEMBERSHIPS', 'SERVICES', 'SCHEDULE', 'DOCUMENTS', 'REPORTS', 'TRACKING'];

    const commonProps = {
        user,
        tabs,
        activeTab,
        setActiveTab,
        logout,
        pathname
    };

    return (
        <header className="fixed top-0 left-0 w-full z-40 flex flex-col">
            <DesktopTopNav {...commonProps} />
            <TabletTopNav {...commonProps} />
            <MobileTopNav {...commonProps} />
        </header>
    );
}
