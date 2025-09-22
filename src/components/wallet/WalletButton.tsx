"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Wallet, Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface WalletButtonProps {
  variant?: 'header' | 'main';
}

export const WalletButton = ({ variant = 'header' }: WalletButtonProps) => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleConnect = () => {
    setVisible(true);
  };

  if (variant === 'header') {
    if (!connected) {
      return (
        <Button 
          onClick={handleConnect}
          className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-md px-4 py-2 h-auto font-medium transition-all duration-300"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-viewheel-card border border-primary/30 rounded-lg hover:border-primary/50 transition-colors"
        >
          <Check className="h-4 w-4 text-primary" />
          <span className="text-primary font-medium">
            {publicKey ? formatAddress(publicKey.toString()) : 'Connected'}
          </span>
          <ChevronDown className="h-4 w-4 text-primary" />
        </button>
        
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-viewheel-card border border-viewheel-border rounded-lg shadow-lg z-50 min-w-[160px]">
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-viewheel-border/20 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  // Main variant for the app page
  return (
    <Button 
      onClick={handleConnect}
      size="lg"
      className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-md px-8 py-6 h-auto font-semibold text-lg transition-all duration-300"
    >
      <Wallet className="mr-2 h-6 w-6" />
      Connect Wallet to Continue
    </Button>
  );
};