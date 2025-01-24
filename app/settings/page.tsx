'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ProfileManager from '@/components/settings/ProfileManager';
import TemplateManager from '@/components/settings/TemplateManager';

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <Card className="p-6">
            <ProfileManager />
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="p-6">
            <TemplateManager />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}