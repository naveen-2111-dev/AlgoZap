'use client';
import React from 'react';
import Image from 'next/image';


const apps = [
    { name: 'GitHub', icon: '/icons/github.svg' },
    { name: 'Discord', icon: '/icons/discord.svg' },
    { name: 'Gmail', icon: '/icons/gmail.svg' },
];

export default function TriggerAppSelector({ onSelectApp, onClose }: {
    onSelectApp: (app: string) => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-xl shadow-xl w-96">
                <h2 className="text-xl font-semibold text-white mb-4">Choose a Trigger App</h2>
                <p className="text-sm text-gray-400 mb-4">Pick an app to start your Zap</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    {apps.map((app) => (
                        <button
                            key={app.name}
                            onClick={() => onSelectApp(app.name)}
                            className="flex flex-col items-center bg-white/5 hover:bg-white/10 p-4 rounded-lg"
                        >
                            <Image
                                src={app.icon}
                                alt={app.name}
                                width={32}
                                height={32}
                                className="mb-2"
                            />


                            <span className="text-xs text-white">{app.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
