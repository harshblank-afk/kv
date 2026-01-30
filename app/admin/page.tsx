'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Download, Search, FileText, Lock } from 'lucide-react';
import { ROLES } from '@/lib/career-data';

interface Application {
    id: string;
    name: string;
    email: string;
    roleTitle: string;
    roleSlug: string;
    resume: string;
    submittedAt: string;
    fields: Record<string, string>;
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [applications, setApplications] = useState<Application[]>([]);
    const [filterRole, setFilterRole] = useState<string>('all');
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/applications?password=${encodeURIComponent(password)}`);
            if (res.ok) {
                const data = await res.json();
                setApplications(data.applications);
                setIsAuthenticated(true);
            } else {
                setError('Invalid Password or Server Error');
            }
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        fetchApplications();
    };

    const filteredApps = filterRole === 'all'
        ? applications
        : applications.filter(app => app.roleSlug === filterRole);

    const handleDownload = async (filename: string) => {
        // In a real app, this would be a protected API route
        // utilizing window.open with the api url
        window.open(`/api/admin/download?filename=${encodeURIComponent(filename)}&password=${encodeURIComponent(password)}`, '_blank');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black p-4">
                <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 p-8 bg-card border border-white/10 rounded-2xl">
                    <div className="text-center mb-6">
                        <Lock className="w-12 h-12 mx-auto text-primary mb-2" />
                        <h1 className="text-2xl font-bold">Admin Access</h1>
                    </div>
                    <Input
                        type="password"
                        placeholder="Enter Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-center"
                    />
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Unlock Dashboard'}
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Applications Dashboard</h1>
                        <p className="text-muted-foreground">{applications.length} Total Applications</p>
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="h-10 rounded-lg border border-input bg-card px-3 text-sm"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            {ROLES.map(r => (
                                <option key={r.slug} value={r.slug}>{r.title}</option>
                            ))}
                        </select>
                        <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Logout</Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {filteredApps.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">No applications found.</p>
                    ) : (
                        filteredApps.map((app) => (
                            <div key={app.id} className="bg-card border border-white/5 rounded-xl p-6 hover:bg-white/5 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            {app.name}
                                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-normal">
                                                {app.roleTitle}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{app.email} • {app.fields.phone}</p>
                                        <p className="text-xs text-gray-500 mt-1">Applied: {new Date(app.submittedAt).toLocaleString()}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleDownload(app.resume)}
                                        className="shrink-0"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Resume
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 text-sm bg-black/20 p-4 rounded-lg">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Why Join?</p>
                                        <p className="text-gray-200">{app.fields.why_join}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Status</p>
                                        <p className="text-gray-200">{app.fields.status}</p>
                                    </div>
                                    {/* Display specific fields dynamically if needed, 
                                  or just let the admin download full data. 
                                  For now, showing key highlights is enough. 
                              */}
                                </div>
                                <div className="mt-2 text-xs text-gray-600 font-mono">ID: {app.id}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
