'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Save, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import defaultCompanies from '@/data/companies.json';

interface Company {
  id: string;
  company: string;
  initialText: string;
}

function CompanyEditor({
  company,
  onSave,
  onCancel
}: {
  company?: Company;
  onSave: (company: Company) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Company>>(
    company || {
      id: '',
      company: '',
      initialText: ''
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
          <h3 className="text-lg font-semibold mb-4">
            {company ? 'Edit Company' : 'Add Company'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">ID</label>
              <Input
                value={formData.id}
                onChange={e => setFormData({ ...formData, id: e.target.value })}
                placeholder="company-id"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Initial Text</label>
              <Textarea
                value={formData.initialText}
                onChange={e => setFormData({ ...formData, initialText: e.target.value })}
                className="min-h-[200px]"
                placeholder="Enter the initial text template..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => onSave(formData as Company)}>
                <Save className="w-4 h-4 mr-2" />
                Save Company
              </Button>
              <Button variant="outline" onClick={handlePasteToJson}>
                <Clipboard className="w-4 h-4 mr-2" />
                Paste to Json
              </Button>
            </div>
          </div>

          {jsonView && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-medium mb-2">Company JSON:</h4>
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

export default function CompanyManager() {
  const [companies, setCompanies] = useState<Company[]>(defaultCompanies.companies);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleSave = (company: Company) => {
    if (editingCompany) {
      setCompanies(companies.map(c => c.id === company.id ? company : c));
      setEditingCompany(undefined);
    } else {
      setCompanies([...companies, company]);
      setIsAdding(false);
    }
    toast({
      title: 'Success',
      description: `Company ${editingCompany ? 'updated' : 'added'} successfully!`,
    });
  };

  const handleDelete = (id: string) => {
    setCompanies(companies.filter(c => c.id !== id));
    toast({
      title: 'Success',
      description: 'Company deleted successfully!',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Companies</h2>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="grid gap-4">
        {companies.map((company) => (
          <Card key={company.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{company.company}</h3>
                <p className="text-sm text-muted-foreground">ID: {company.id}</p>
                <p className="text-sm mt-2">{company.initialText}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCompany(company)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(company.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(isAdding || editingCompany) && (
        <CompanyEditor
          company={editingCompany}
          onSave={handleSave}
          onCancel={() => {
            setEditingCompany(undefined);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
} 