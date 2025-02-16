'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Loader2, Copy, Download, Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import templates from '@/data/templates.json';
import profiles from '@/data/profile.json';
import companies from '@/data/companies.json';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [template, setTemplate] = useState(Object.keys(templates)[0]);
  const [selectedProfile, setSelectedProfile] = useState(profiles.profiles[0]?.id || '');
  const [selectedCompany, setSelectedCompany] = useState(companies.companies[0]?.id || '');
  const [proposal, setProposal] = useState('');
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);
  const [isCopyClicked, setIsCopyClicked] = useState(false);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTemplate(Object.keys(templates)[0]);
  }, []);

  const generateProposal = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a job description',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedProfile) {
      toast({
        title: 'Error',
        description: 'Please select a profile',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingProposal(true);
    setIsButtonsDisabled(true);
    try {
      const response = await fetch('/api/generateProposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobDescription, 
          template,
          profileId: selectedProfile,
          companyId: selectedCompany
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!data.proposal) {
        throw new Error('No proposal was generated');
      }

      setProposal(data.proposal);
      toast({
        title: 'Success',
        description: 'Proposal generated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate proposal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const generatePrompt = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a job description',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedProfile) {
      toast({
        title: 'Error',
        description: 'Please select a profile',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingPrompt(true);
    setIsButtonsDisabled(true);
    try {
      const response = await fetch('/api/generateProposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          template,
          profileId: selectedProfile,
          returnPromptOnly: true,
          companyId: selectedCompany
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!data.processedTemplate) {
        throw new Error('No prompt was generated');
      }

      setProposal(data.processedTemplate);
      toast({
        title: 'Success',
        description: 'Prompt generated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate prompt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(proposal);
    setIsCopyClicked(true);
    toast({
      title: 'Copied',
      description: 'Proposal copied to clipboard',
    });
    setTimeout(() => setIsCopyClicked(false), 1000); // Reset "clicked" indicator
  };

  const downloadProposal = () => {
    const blob = new Blob([proposal], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proposal.txt';
    a.click();
    window.URL.revokeObjectURL(url);

    setIsDownloadClicked(true);
    setTimeout(() => setIsDownloadClicked(false), 1000); // Reset "clicked" indicator
  };

  const clearAll = () => {
    setProposal('');
    setIsButtonsDisabled(false);
    setTemplate(Object.keys(templates)[0]);
    setSelectedProfile(profiles.profiles[0]?.id || '');
    setSelectedCompany(companies.companies[0]?.id || '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Proposal Generator
            </h1>
            <p className="text-muted-foreground">
              Generate personalized Upwork proposals using AI
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Profile</label>
                <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Description</label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Template</label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(templates).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateProposal}
                disabled={isGeneratingProposal || isButtonsDisabled}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isGeneratingProposal ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Proposal...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Proposal
                  </>
                )}
              </Button>

              <Button
                onClick={generatePrompt}
                disabled={isGeneratingPrompt || isButtonsDisabled}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
              >
                {isGeneratingPrompt ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Prompt...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Prompt
                  </>
                )}
              </Button>
            </div>
          </Card>

          {proposal && (
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Generated Output</h2>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className={isCopyClicked ? 'bg-green-500 text-white' : ''}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {isCopyClicked ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadProposal}
                    className={isDownloadClicked ? 'bg-blue-500 text-white' : ''}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloadClicked ? 'Downloaded!' : 'Download'}
                  </Button>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {proposal}
              </div>
              <div className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
