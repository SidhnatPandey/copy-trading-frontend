import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import CircularProgress from '@/components/CircularProgress';
import { toast } from 'sonner';
import { uploadImage } from '@/apiService/userService';
import { updateUser } from '@/apiService/authService';

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
            const { updateUser } = await import('@/apiService/authService');
            if (!name || name.trim().length < 2) {
                toast.error('Please provide a valid name');
                setLoading(false);
                return;
            }
            await updateUser(user.id, { name: name.trim() });
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

    const handleUpload = async () => {
        if (!user || !selectedFile) return;
        setLoading(true);
        try {
            const { secure_url } = await uploadImage(selectedFile);
            await updateUser(user.id, { profile_image_url: secure_url });
            await refreshUser(user.id);
            setSelectedFile(null);
            toast.success('Avatar uploaded');
        } catch (err) {
            console.error('Failed to upload avatar', err);
            toast.error('Failed to upload avatar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex items-start justify-center p-6 bg-background">
            <div className="w-full max-w-4xl glass-card p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Profile</h2>
                    <p className="text-sm text-muted-foreground mt-2 md:mt-0">Manage your account details and avatar</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center md:flex-col gap-4">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-muted-foreground/10 flex items-center justify-center ring-1 ring-muted-foreground/10">
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

                        <div className="hidden md:block text-sm text-muted-foreground">PNG, JPG up to 5MB</div>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground">Profile photo</label>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2">
                                <input className="block w-full sm:w-auto text-sm text-muted-foreground" type="file" accept="image/*" onChange={handleFileChange} />
                                <div className="text-xs text-muted-foreground mt-2 sm:mt-0">{selectedFile ? `Selected: ${selectedFile.name}` : 'Choose a file to upload'}</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 rounded-md border bg-background border-input"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">Email</label>
                            <input value={user?.email || ''} disabled className="mt-1 block w-full px-3 py-2 rounded-md border bg-muted-foreground/5 text-sm" />
                        </div>

                        <div className="sm:col-span-2 flex flex-col sm:flex-row items:center sm:justify-end gap-3 mt-2">
                            <Button variant="outline" type="button" onClick={() => { setSelectedFile(null); if (user) setName(user.name || ''); }} className="w-full sm:w-auto">
                                Reset
                            </Button>
                            {selectedFile && (
                                <Button type="button" disabled={loading} onClick={handleUpload} className="w-full sm:w-auto">
                                    {loading ? <CircularProgress /> : 'Upload photo'}
                                </Button>
                            )}
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                {loading ? <CircularProgress /> : 'Save changes'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}