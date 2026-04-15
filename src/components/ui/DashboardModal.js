"use client";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

/**
 * Reusable DashboardModal
 *
 * Props:
 *  - isOpen    {boolean}    Whether the modal is visible
 *  - onClose   {function}   Called when backdrop or close button is clicked
 *  - title     {string}     Header title text
 *  - icon      {ReactNode}  Optional SVG/icon shown left of the title
 *  - children  {ReactNode}  Modal body content
 *  - footer    {ReactNode}  Optional custom footer (defaults to a Close button)
 */
export default function DashboardModal({ isOpen, onClose, title, icon, children, footer, secondaryAction }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>

                {/* ── Backdrop ── */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </TransitionChild>

                {/* ── Panel ── */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

                            {/* Header — Golden Gradient */}
                            <div className="bg-gradient-gold px-6 py-4 flex items-center justify-between border-b border-[#b38b22]">
                                <div className="flex items-center gap-3">
                                    {icon && (
                                        <span className="text-black">{icon}</span>
                                    )}
                                    <DialogTitle className="text-black font-bold text-base tracking-wide uppercase">
                                        {title}
                                    </DialogTitle>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="cursor-pointer text-black/70 hover:text-black transition-colors duration-150"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                                {children}
                            </div>

                            {/* Footer */}
                            <div className="px-6 cursor-pointer py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                {secondaryAction}
                                {footer ?? (
                                    <button
                                        onClick={onClose}
                                        className="px-6 cursor-pointer py-2 bg-gradient-gold text-black text-sm font-bold rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>

                        </DialogPanel>
                    </TransitionChild>
                </div>

            </Dialog>
        </Transition>
    );
}
