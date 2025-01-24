'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Save, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import defaultTemplates from '@/data/templates.json';

interface Template {
  id: string;
  name: string;
  template: string;
}

export default function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initialTemplates = Object.entries(defaultTemplates).map(([key, value]) => ({
      id: key,
      name: value.name,
      template: value.template
    }));
    setTemplates(initialTemplates);
  }, []);

  const handleSave = (template: Template) => {
    try {
      if (editingId) {
        setTemplates(templates.map(t => (t.id === editingId ? template : t)));
      } else {
        setTemplates([...templates, { ...template, id: Date.now().toString() }]);
      }
      setEditingId(null);
      toast({
        title: 'Success',
        description: 'Template saved successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save template',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = (id: string) => {
    try {
      setTemplates(templates.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Template deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Templates</h2>
        <Button onClick={() => setEditingId('new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map(template => (
          <Card key={template.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground truncate max-w-md">
                  {template.template.substring(0, 100)}...
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(template.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editingId && (
        <TemplateEditor
          template={templates.find(t => t.id === editingId)}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      )}
    </div>
  );
}

function TemplateEditor({
  template,
  onSave,
  onCancel
}: {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Template>>(
    template || {
      name: '',
      template: ''
    }
  );
  const [jsonView, setJsonView] = useState<string | null>(null);

  const handlePasteToJson = () => {
    const jsonContent = JSON.stringify(
      {
        name: formData.name,
        template: formData.template
      },
      null,
      2
    );
    setJsonView(jsonContent);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-background shadow-lg p-6 overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">
          {template ? 'Edit Template' : 'New Template'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Template Content</label>
            <div className="text-sm text-muted-foreground mb-2">
              Available variables: ${'{profile.name}'}, ${'{profile.profession}'}, {'{profile.profileUrl}'}, ${'{profile.skills}'}, ${'{profile.summary}'}, ${'{jobDescription}'}
            </div>
            <Textarea
              value={formData.template}
              onChange={e => setFormData({ ...formData, template: e.target.value })}
              className="min-h-[300px] font-mono"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => onSave(formData as Template)}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
            <Button variant="outline" onClick={handlePasteToJson}>
              <Clipboard className="w-4 h-4 mr-2" />
              Paste to Json
            </Button>
          </div>
        </div>

        {jsonView && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-medium mb-2">Template JSON:</h4>
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {jsonView}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
