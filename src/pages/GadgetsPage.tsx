import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Laptop, Headphones, Check, ArrowLeft, ShoppingCart, Gift } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Gadget {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  coin_cost: number;
  category: string;
  is_available: boolean;
}

const GadgetsPage: React.FC = () => {
  const { wallet, updateCoins } = useUserData();
  const { requireAuth, AuthDialog, isAuthenticated } = useRequireAuth();
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGadgets();
  }, []);

  const fetchGadgets = async () => {
    setLoading(true);
    try {
      console.log('Loading premium gadgets data...');
      setGadgets([
        {
          id: '1',
          name: 'iPhone 15',
          description: 'Latest iPhone 15 with 128GB storage',
          image_url: null,
          coin_cost: 200000, // Higher threshold for premium items
          category: 'smartphones',
          is_available: true
        },
        {
          id: '2',
          name: 'Samsung Galaxy S24',
          description: 'Samsung Galaxy S24 Ultra 256GB',
          image_url: null,
          coin_cost: 180000,
          category: 'smartphones',
          is_available: true
        },
        {
          id: '3',
          name: 'Apple AirPods Pro',
          description: 'Wireless earbuds with noise cancellation',
          image_url: null,
          coin_cost: 35000,
          category: 'audio',
          is_available: true
        },
        {
          id: '4',
          name: 'MacBook Air M3',
          description: 'Apple MacBook Air with M3 chip, 13-inch',
          image_url: null,
          coin_cost: 350000, // Premium laptop pricing
          category: 'laptops',
          is_available: true
        },
        {
          id: '5',
          name: 'Sony WH-1000XM5',
          description: 'Premium noise-canceling headphones',
          image_url: null,
          coin_cost: 45000,
          category: 'audio',
          is_available: true
        },
        {
          id: '6',
          name: 'Dell XPS 13',
          description: 'Dell XPS 13 laptop with Intel i7',
          image_url: null,
          coin_cost: 280000,
          category: 'laptops',
          is_available: true
        },
        {
          id: '7',
          name: 'iPad Air',
          description: 'iPad Air with M2 chip, 64GB',
          image_url: null,
          coin_cost: 120000,
          category: 'tablets',
          is_available: true
        },
        {
          id: '8',
          name: 'Gaming Mouse',
          description: 'High-precision gaming mouse',
          image_url: null,
          coin_cost: 15000,
          category: 'accessories',
          is_available: true
        }
      ]);
    } catch (error) {
      console.error('Error loading gadgets:', error);
      toast({
        title: "Error",
        description: "Failed to load gadgets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (gadget: Gadget) => {
    const redeemAction = async () => {
      if (!wallet) {
        toast({
          title: "Error",
          description: "Your wallet information couldn't be loaded.",
          variant: "destructive",
        });
        return;
      }

      const totalCoins = wallet.total_coins || 0;
      
      if (totalCoins < gadget.coin_cost) {
        toast({
          title: "Insufficient Coins",
          description: `You need ${gadget.coin_cost - totalCoins} more coins to redeem this item.`,
          variant: "destructive",
        });
        return;
      }

      try {
        await updateCoins(-gadget.coin_cost, 'redemption', `Redeemed ${gadget.name}`);
        
        const { error } = await supabase
          .from('redemptions')
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            item_name: gadget.name,
            item_description: gadget.description,
            coins_spent: gadget.coin_cost,
            status: 'pending'
          });

        if (error) throw error;

        toast({
          title: "Redemption Successful! 🎉",
          description: `Your ${gadget.name} request is being processed. Check your email for updates.`,
        });
      } catch (error) {
        console.error('Error processing redemption:', error);
        toast({
          title: "Error",
          description: "Failed to process redemption. Please try again.",
          variant: "destructive",
        });
      }
    };

    requireAuth(redeemAction);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'smartphones': return <Smartphone className="w-5 h-5" />;
      case 'laptops': return <Laptop className="w-5 h-5" />;
      case 'audio': return <Headphones className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const categories = ['all', ...Array.from(new Set(gadgets.map(g => g.category)))];

  const filteredGadgets = selectedCategory === 'all'
    ? gadgets
    : gadgets.filter(gadget => gadget.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <Button variant="ghost" className="text-white p-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Premium Gadget Store</h1>
          {isAuthenticated && (
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
              <ShoppingCart className="w-4 h-4" />
              <span className="font-bold">{wallet?.total_coins || 0}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-600" />
              Premium Gadgets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Premium gadgets for dedicated users. Save up for amazing tech!</p>
            {isAuthenticated ? (
              <div className="mt-2 p-2 bg-white rounded-lg border text-center">
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-2xl font-bold text-purple-600">{wallet?.total_coins || 0} coins</p>
              </div>
            ) : (
              <Button onClick={() => navigate('/auth')} className="w-full mt-2">
                Sign In to View Your Balance
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="w-full overflow-x-auto flex whitespace-nowrap pb-2">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGadgets.map(gadget => {
              const canAfford = (wallet?.total_coins || 0) >= gadget.coin_cost;
              
              return (
                <Card key={gadget.id} className={`overflow-hidden ${!canAfford || !isAuthenticated ? 'opacity-75' : ''}`}>
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24 flex items-center justify-center">
                    <div className="bg-white/20 p-4 rounded-full">
                      {getCategoryIcon(gadget.category)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{gadget.name}</h3>
                      <Badge variant="outline" className="bg-purple-50">
                        {gadget.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{gadget.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-purple-600">{gadget.coin_cost.toLocaleString()} coins</div>
                      <Button 
                        onClick={() => handleRedeem(gadget)}
                        size="sm"
                        className={canAfford && isAuthenticated ? 
                          "bg-gradient-to-r from-purple-500 to-pink-600" : 
                          "bg-gray-300"
                        }
                        disabled={!canAfford || !isAuthenticated}
                      >
                        {canAfford && isAuthenticated ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Redeem
                          </>
                        ) : (
                          "Not Enough Coins"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <AuthDialog />
    </div>
  );
};

export default GadgetsPage;
