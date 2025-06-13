'use client';

import React, { useEffect, useState } from 'react';

interface TriggerAppConfigPanelProps {
    app: string;
    savedData?: {
        username?: string;
        repository?: string;
        event?: string;
    };
    onClose: () => void;
    onProceed: () => void;
    onChange: (data: { [key: string]: any }) => void;
}

export default function TriggerAppConfigPanel({
    app,
    savedData,
    onClose,
    onProceed,
    onChange,
}: TriggerAppConfigPanelProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [localApp, setLocalApp] = useState(app);
    const [repository, setRepository] = useState('');
    const [repositories, setRepositories] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        if (savedData?.username) setUsername(savedData.username);
        if (savedData?.repository) setRepository(savedData.repository);
        if (savedData?.event) setSelectedEvent(savedData.event);
    }, [savedData]);

    useEffect(() => {
        setLocalApp(app);
    }, [app]);

    useEffect(() => {
        fetch('/api/user', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                if (data.connected) {
                    setIsConnected(true);
                    setUsername(data.username);
                    onChange({ username: data.username });

                    fetch('/api/repos', { credentials: 'include' })
                        .then((res) => res.json())
                        .then((repoData) => {
                            if (Array.isArray(repoData)) {
                                setRepositories(repoData);
                            } else {
                                console.error('Expected array, got:', repoData);
                            }
                        })
                        .catch((err) => {
                            console.error('Error fetching repos:', err);
                        });
                }
            });
    }, []);

    const EVENT_OPTIONS = [
        {
            value: 'new-branch',
            label: 'New Branch — Triggers when a new branch is created.',
        },
        {
            value: 'new-collaborator',
            label: 'New Collaborator — Triggers when you add a new collaborator.',
        },
        {
            value: 'new-commit',
            label: 'New Commit — Triggers when a new commit is created.',
        },
        {
            value: 'new-commit-comment',
            label: 'New Commit Comment — Triggers when a new comment on a commit is created.',
        },
    ];

    const handleConnect = () => {
        window.location.href = '/api/auth/github';
    };

    return (
        <div className="fixed top-0 right-0 h-full w-[400px] bg-[#1a1a1a] shadow-lg border-l border-white/10 z-50">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Select Event</h2>

                <label className="block text-sm text-white mb-1">App</label>
                <select
                    className="w-full mb-4 px-3 py-2 rounded-md bg-black text-white border border-white/20"
                    value={localApp}
                    onChange={(e) => {
                        const newApp = e.target.value;
                        setLocalApp(newApp);
                        onChange({ app: newApp, event: '', repository: '', username: '' });
                    }}
                >
                    <option value="GitHub">GitHub</option>
                    <option value="Discord">Discord</option>
                    <option value="Gmail">Gmail</option>
                </select>

                <label className="block text-sm text-white mb-1">Action Event</label>
                <select
                    className="w-full mb-4 px-3 py-2 rounded-md bg-black text-white border border-white/20"
                    value={selectedEvent}
                    onChange={(e) => {
                        const selected = EVENT_OPTIONS.find((opt) => opt.value === e.target.value);
                        setSelectedEvent(selected?.value || '');
                        onChange({
                            event: selected?.value || '',
                            eventLabel: selected?.label || '',
                        });
                    }}
                >
                    <option value="">Select an event</option>
                    {EVENT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <label className="block text-sm text-white mb-1">Account</label>
                {isConnected ? (
                    <div className="w-full mb-4 px-3 py-2 rounded-md bg-green-600 text-white text-center">
                        Connected as <strong>{username}</strong>
                    </div>
                ) : (
                    <button
                        className="w-full mb-4 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleConnect}
                    >
                        Connect {app}
                    </button>
                )}

                {localApp === 'GitHub' && (
                    <>
                        <label className="block text-sm text-white mb-1">Repository</label>
                        <select
                            className="w-full mb-4 px-3 py-2 rounded-md bg-black text-white border border-white/20"
                            value={repository}
                            onChange={(e) => {
                                setRepository(e.target.value);
                                onChange({ repository: e.target.value });
                            }}
                            disabled={!isConnected}
                        >
                            <option value="">Select a repository</option>
                            {repositories.map((repo) => (
                                <option key={repo.id} value={repo.name}>
                                    {repo.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onProceed}
                        disabled={!isConnected}
                        className={`px-4 py-2 text-white rounded ${
                            isConnected
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-white/10 cursor-not-allowed'
                        }`}
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    );
}
