'use client';

import { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
}

const PLATFORMS = {
  facebook: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  twitter: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
  linkedin: (u: string, t: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`,
};

async function trackShare(fullUrl: string, title: string, description?: string, image?: string, platform?: string) {
  try {
    await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: fullUrl, title, description, image, platform }),
    });
  } catch {
    // silently fail
  }
}

export function ShareButtons({ url, title, description, image, className }: ShareButtonsProps) {
  const [fullUrl, setFullUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kswtechzone.com';
    setFullUrl(url.startsWith('http') ? url : `${origin}${url.startsWith('/') ? '' : '/'}${url}`);
  }, [url]);

  const handleShare = async (platform?: string) => {
    const shareUrl = fullUrl || `https://kswtechzone.com${url.startsWith('/') ? url : '/' + url}`;

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        await trackShare(shareUrl, title, description, image, 'copy');
      } catch {
        // clipboard not available
      }
      return;
    }

    if (platform === 'native' && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url: shareUrl });
        await trackShare(shareUrl, title, description, image, 'native');
      } catch {
        // user cancelled or native share not available
      }
      return;
    }

    if (platform && PLATFORMS[platform as keyof typeof PLATFORMS]) {
      const popupUrl = platform === 'facebook'
        ? PLATFORMS.facebook(shareUrl)
        : PLATFORMS[platform as keyof typeof PLATFORMS](shareUrl, title);
      window.open(popupUrl, '_blank', 'width=600,height=400');
      await trackShare(shareUrl, title, description, image, platform);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ''}`}>
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('native')}
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4 text-blue-600" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        title="Share on Twitter"
      >
        <Twitter className="h-4 w-4 text-sky-500" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        title="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4 text-blue-700" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('copy')}
        title="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
