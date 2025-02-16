'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card'; 
import { Plus, Pencil, Trash2, Save, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import defaultProfiles from '@/data/profile.json';

interface Profile {
  id: string;
  name: string;
  profession: string;
  profileUrl: string;
  skills: string[];
  summary: string;
  portfolio: Array<{
    title: string;
    link: string;
    description: string;
    skills: string[];
  }>;
}

export default function ProfileManager() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load profiles from profile.json
    setProfiles(defaultProfiles.profiles);
  }, []);

  const handleSave = (profile: Profile) => {
    try {
      if (editingId && editingId !== 'new') {
        setProfiles(profiles.map(p => p.id === editingId ? profile : p));
      } else {
        // For new profiles, ensure unique ID
        const newProfile = {
          ...profile,
          id: profile.id || `profile-${Date.now()}`
        };
        setProfiles([...profiles, newProfile]);
      }
      
      setEditingId(null);
      toast({
        title: 'Success',
        description: 'Profile saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (id: string) => {
    try {
      if (profiles.length <= 1) {
        toast({
          title: 'Error',
          description: 'Cannot delete the last profile',
          variant: 'destructive',
        });
        return;
      }

      setProfiles(profiles.filter(p => p.id !== id));
      toast({
        title: 'Success',
        description: 'Profile deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete profile',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Profiles</h2>
        <Button onClick={() => setEditingId('new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Profile
        </Button>
      </div>

      <div className="grid gap-4">
        {profiles.map(profile => (
          <Card key={profile.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.profession}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(profile.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(profile.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editingId && (
        <ProfileEditor
          profile={profiles.find(p => p.id === editingId)}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      )}
    </div>
  );
}

function ProfileEditor({ 
  profile,
  onSave,
  onCancel 
}: { 
  profile?: Profile;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Profile>>(
    profile || {
      id: '',
      name: '',
      profession: '',
      profileUrl: '',
      skills: [],
      summary: '',
      portfolio: []
    }
  );
  const [jsonView, setJsonView] = useState<string>('');

  const handlePasteToJson = () => {
    const jsonData = JSON.stringify(formData, null, 2);
    setJsonView(jsonData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {profile ? 'Edit Profile' : 'New Profile'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">ID</label>
              <Input
                value={formData.id}
                onChange={e => setFormData({ ...formData, id: e.target.value })}
                placeholder="unique-profile-id"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Profession</label>
              <Input
                value={formData.profession}
                onChange={e => setFormData({ ...formData, profession: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Profile URL</label>
              <Input
                value={formData.profileUrl}
                onChange={e => setFormData({ ...formData, profileUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Input
                value={formData.skills?.join(', ')}
                onChange={e => setFormData({ 
                  ...formData, 
                  skills: e.target.value.split(',').map(s => s.trim()) 
                })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Summary</label>
              <Textarea
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => onSave(formData as Profile)}>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
              <Button variant="outline" onClick={handlePasteToJson}>
                <Clipboard className="w-4 h-4 mr-2" />
                Paste to Json
              </Button>
            </div>
          </div>

          {jsonView && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-medium mb-2">Profile JSON:</h4>
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {jsonView}
              </pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}