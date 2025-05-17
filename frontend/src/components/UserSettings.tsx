import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useAuth } from '../contexts/AuthContext';
import { getUserSettings, saveUserSettings, UserSettings as UserSettingsType } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const AVAILABLE_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Times',
  'Courier New',
  'Courier',
  'Verdana',
  'Georgia',
  'Palatino',
  'Garamond',
  'Bookman',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Impact',
];

export default function UserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettingsType>({
    primary_color: '#3498db',
    secondary_color: '#2ecc71',
    font_family: 'Arial',
    logo_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeColorTab, setActiveColorTab] = useState('primary');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      if (user) {
        const userSettings = await getUserSettings(user.id);
        setSettings(userSettings);
      }
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await saveUserSettings({
        ...settings,
        user_id: user.id,
      });
      setMessage('設定が保存されました');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage('設定の保存に失敗しました');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (color: string) => {
    if (activeColorTab === 'primary') {
      setSettings({ ...settings, primary_color: color });
    } else {
      setSettings({ ...settings, secondary_color: color });
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>ユーザー設定</CardTitle>
          <CardDescription>
            ロゴ、テーマカラー、フォントなどの設定を変更できます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ロゴURL設定 */}
          <div className="space-y-2">
            <Label htmlFor="logo-url">ロゴURL</Label>
            <Input
              id="logo-url"
              placeholder="https://example.com/logo.png"
              value={settings.logo_url || ''}
              onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
            />
            {settings.logo_url && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">プレビュー:</p>
                <img
                  src={settings.logo_url}
                  alt="ロゴプレビュー"
                  className="max-h-20 max-w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x50?text=Invalid+Logo+URL';
                  }}
                />
              </div>
            )}
          </div>

          {/* カラー設定 */}
          <div className="space-y-2">
            <Label>テーマカラー</Label>
            <Tabs value={activeColorTab} onValueChange={setActiveColorTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="primary">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: settings.primary_color }}
                    />
                    <span>プライマリカラー</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="secondary">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: settings.secondary_color }}
                    />
                    <span>セカンダリカラー</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="primary" className="pt-4">
                <HexColorPicker
                  color={settings.primary_color}
                  onChange={handleColorChange}
                  className="w-full"
                />
                <Input
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="mt-2"
                />
              </TabsContent>
              <TabsContent value="secondary" className="pt-4">
                <HexColorPicker
                  color={settings.secondary_color}
                  onChange={handleColorChange}
                  className="w-full"
                />
                <Input
                  value={settings.secondary_color}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  className="mt-2"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* フォント設定 */}
          <div className="space-y-2">
            <Label htmlFor="font-family">フォント</Label>
            <Select
              value={settings.font_family}
              onValueChange={(value) => setSettings({ ...settings, font_family: value })}
            >
              <SelectTrigger id="font-family">
                <SelectValue placeholder="フォントを選択" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_FONTS.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 p-4 border rounded-md">
              <p className="text-sm text-gray-500 mb-1">プレビュー:</p>
              <p style={{ fontFamily: settings.font_family }}>
                これはフォントのプレビューです。The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {message && <p className="text-green-500">{message}</p>}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '設定を保存'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
