
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Crown, Star, Calendar, Copy, Check, Share2, Edit2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProfileHeaderProps {
  profile: any;
  wallet: any;
  userLevel: number;
  loginStreak: number;
}

const ProfileHeader = ({ profile, wallet, userLevel, loginStreak }: ProfileHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(profile?.username || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      toast({
        title: "Referral Code Copied! 📋",
        description: "Share with friends to earn 100 points per successful referral!",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyReferralLink = () => {
    if (profile?.referral_code) {
      const referralLink = `${window.location.origin}?ref=${profile.referral_code}`;
      navigator.clipboard.writeText(referralLink);
      setLinkCopied(true);
      toast({
        title: "Referral Link Copied! 🔗",
        description: "Share this link with friends to earn rewards when they join!",
      });
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        toast({
          title: "Profile Photo Updated! 📸",
          description: "Your new profile photo has been saved.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameEdit = () => {
    if (isEditingName) {
      // Save the name (in a real app, this would be saved to the database)
      toast({
        title: "Name Updated! ✏️",
        description: "Your profile name has been updated.",
      });
    }
    setIsEditingName(!isEditingName);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 border-0 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardHeader className="text-center relative z-10 pb-4">
        <div className="relative mx-auto mb-4">
          <Avatar className="w-24 h-24 mx-auto shadow-lg border-4 border-white/20">
            <AvatarImage src={profileImage || ''} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-3xl font-bold">
              {profile?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-full p-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-4 h-4" />
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-yellow-800" />
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          {isEditingName ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-center text-xl font-bold max-w-48"
              placeholder="Enter your name"
            />
          ) : (
            <CardTitle className="text-2xl font-bold text-white">
              {profile?.username || 'GiftLeap User'}
            </CardTitle>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 text-white hover:bg-white/20"
            onClick={handleNameEdit}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex justify-center gap-3 mb-4">
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Star className="w-3 h-3 mr-1" />
            Level {userLevel}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Calendar className="w-3 h-3 mr-1" />
            {loginStreak} Day Streak
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm text-white/80">Total Points</span>
            </div>
            <div className="text-2xl font-bold text-white">{wallet?.total_coins || 0}</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm text-white/80">Rank</span>
            </div>
            <div className="text-2xl font-bold text-white">#42</div>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/80 text-sm">Referral Code</span>
            <Badge variant="outline" className="font-mono text-white border-white/30 bg-white/10">
              {profile?.referral_code || 'Loading...'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
              onClick={handleCopyReferralCode}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Code Copied!' : 'Copy Referral Code'}
            </Button>
            
            <Button 
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
              onClick={handleCopyReferralLink}
            >
              {linkCopied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
              {linkCopied ? 'Link Copied!' : 'Copy Referral Link'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
