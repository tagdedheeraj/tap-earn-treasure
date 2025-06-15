
import React, { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppSetting {
  setting_key: string;
  setting_value: any;
  description: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');

      if (error) throw error;

      const settingsObj = data?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>) || {};

      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('admin_settings')
        .update({ 
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id || '',
          action_type: 'setting_update',
          description: `Updated setting: ${key}`,
          metadata: { setting_key: key, new_value: value }
        });

      setSettings(prev => ({ ...prev, [key]: value }));

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const settingsConfig = [
    {
      key: 'daily_spin_limit',
      label: 'Daily Spin Limit',
      description: 'Maximum number of spins allowed per user per day',
      type: 'number'
    },
    {
      key: 'mining_cooldown_hours',
      label: 'Mining Cooldown (Hours)',
      description: 'Hours between mining sessions',
      type: 'number'
    },
    {
      key: 'mining_reward_amount',
      label: 'Mining Reward Amount',
      description: 'Coins awarded per mining session',
      type: 'number'
    },
    {
      key: 'referral_bonus_referrer',
      label: 'Referrer Bonus',
      description: 'Bonus coins for referrer when friend completes first mining',
      type: 'number'
    },
    {
      key: 'referral_bonus_new_user',
      label: 'New User Bonus',
      description: 'Welcome bonus for new users with referral code',
      type: 'number'
    },
    {
      key: 'app_maintenance_mode',
      label: 'Maintenance Mode',
      description: 'Enable maintenance mode to restrict app access',
      type: 'boolean'
    }
  ];

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">App Settings</h1>
            <p className="text-gray-600">Configure app-wide settings and limits</p>
          </div>

          <div className="grid gap-6">
            {settingsConfig.map((config) => (
              <Card key={config.key}>
                <CardHeader>
                  <CardTitle className="text-lg">{config.label}</CardTitle>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </CardHeader>
                <CardContent>
                  {config.type === 'boolean' ? (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings[config.key] === 'true' || settings[config.key] === true}
                        onCheckedChange={(checked) => updateSetting(config.key, checked)}
                        disabled={saving}
                      />
                      <Label>
                        {settings[config.key] === 'true' || settings[config.key] === true ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Input
                        type={config.type}
                        value={settings[config.key] || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, [config.key]: e.target.value }))}
                        className="max-w-xs"
                        disabled={saving}
                      />
                      <Button
                        onClick={() => updateSetting(config.key, settings[config.key])}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Update'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <p className="text-sm text-red-600">These actions can have significant impact on the app</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-600 mb-2">Reset All User Progress</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This will reset all user coins, mining progress, and task completion data.
                  </p>
                  <Button variant="destructive" disabled>
                    Reset All Data (Coming Soon)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminSettings;
