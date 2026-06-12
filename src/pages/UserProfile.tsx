import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import CircularProgress from '@/components/CircularProgress';
import { toast } from 'sonner';

export default function UserProfile() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const f = files[0];
            if (f.size > 5 * 1024 * 1024) {
                toast.error('Image must be smaller than 5MB');
                return;
            }
            setSelectedFile(f);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const { updateUser, uploadAvatar } = await import('@/apiService/authService');
            if (!name || name.trim().length < 2) {
                toast.error('Please provide a valid name');
                setLoading(false);
                return;
            }
            await updateUser(user.id, { name: name.trim() });
            if (selectedFile) await uploadAvatar(user.id, selectedFile);
            await refreshUser(user.id);
            setSelectedFile(null);
            toast.success('Profile updated');
        } catch (err) {
            console.error('Failed to update profile', err);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex items-start justify-center p-6">
            <div className="w-full max-w-2xl glass-card p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-28 h-28 rounded-full overflow-hidden bg-muted-foreground/10 flex items-center justify-center">
                            {preview ? (
                                <img src={preview} alt="avatar preview" className="w-full h-full object-cover" />
                            ) : (
                                <img
                                    src={user?.avatar || (user ? `/api/users/${user.id}/avatar` : '')}
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/avatar-placeholder.png'; }}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-muted-foreground">Profile photo</label>
                            <p className="text-xs text-muted-foreground mb-2">PNG, JPG up to 5MB</p>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 rounded-md border bg-background border-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input value={user?.email || ''} disabled className="mt-1 block w-full px-3 py-2 rounded-md border bg-muted-foreground/5" />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Button variant="outline" type="button" onClick={() => { setSelectedFile(null); if (user) setName(user.name || ''); }}>
                            Reset
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <CircularProgress /> : 'Save changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}