'use client';

import { useState } from 'react';
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
import { Loader2, Copy, Download, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [template, setTemplate] = useState('standard');
  const [proposal, setProposal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateProposal = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a job description',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Making request with:', { jobDescription, template });
      
      const response = await fetch('/api/generateProposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, template }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
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
      console.error('Error generating proposal:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate proposal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(proposal);
    toast({
      title: 'Copied',
      description: 'Proposal copied to clipboard',
    });
  };

  const downloadProposal = () => {
    const blob = new Blob([proposal], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proposal.txt';
    a.click();
    window.URL.revokeObjectURL(url);
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
                <label className="block text-sm font-medium mb-2">
                  Job Description
                </label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Template
                </label>
                <Select
                  value={template}
                  onValueChange={setTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Proposal</SelectItem>
                    <SelectItem value="ask-questions">Ask Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateProposal}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Proposal
                  </>
                )}
              </Button>
            </div>
          </Card>

          {proposal && (
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Generated Proposal</h2>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadProposal}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {proposal}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}