"use client";
import React from 'react';
import CalendarPage from '../../(dashboard)/components/CalendarPage';

export default function AdminSchedulePage() {
    return (
        <div className="w-full h-full">
            <CalendarPage isAdmin={true} />
        </div>
    );
}
