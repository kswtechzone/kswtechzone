'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, Github, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { API } from '@/constants/api';

const DEFAULT_SERVICES = [
  { name: 'Software Development', href: '/services/software' },
  { name: 'Web Development', href: '/services/web' },
  { name: 'Mobile Apps', href: '/services/mobile' },
  { name: 'Digital Marketing', href: '/services/marketing' },
  { name: 'Cloud Solutions', href: '/services/cloud' },
  { name: 'AI Solutions', href: '/services/ai' },
];

const DEFAULT_CONTACT = [
  { icon: Mail, text: 'kswtechzone@gmail.com', href: 'mailto:kswtechzone@gmail.com', key: 'contact_email' },
  { icon: Phone, text: '+977-9863198323', href: 'tel:+9779863198323', key: 'contact_phone' },
  { icon: MapPin, text: 'Kathmandu, Nepal', href: '#', key: 'contact_address' },
  { icon: Clock, text: 'Sun-Fri: 9AM-6PM NPT', href: '#', key: 'contact_hours' },
];

const SOCIAL_KEYS: { icon: React.ElementType; key: string }[] = [
  { icon: Github, key: 'social_github' },
  { icon: Twitter, key: 'social_twitter' },
  { icon: Linkedin, key: 'social_linkedin' },
  { icon: Facebook, key: 'social_facebook' },
  { icon: Instagram, key: 'social_instagram' },
];

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  products: [
    { name: 'KSW Hospitality', href: '/products#hospitality' },
    { name: 'Ghantaghar.com', href: '/products#ghantaghar' },
    { name: 'Hourly Place', href: '/products#hourlyplace' },
    { name: 'KSW Marketing', href: '/products#marketing' },
    { name: 'KIRA', href: '/products#kira' },
  ],
  account: [
    { name: 'KSW Account', href: '/account/dashboard' },
    { name: 'Sign In', href: '/auth/login' },
    { name: 'Register', href: '/auth/register' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  const [serviceItems, setServiceItems] = React.useState(DEFAULT_SERVICES);
  const [settings, setSettings] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    fetch(API.SERVICES)
      .then(r => r.json())
      .then((data: { title: string; slug: string; published: boolean; order: number }[]) => {
        const filtered = data
          .filter(s => s.published)
          .sort((a, b) => a.order - b.order)
          .map(s => ({ name: s.title, href: `/services/${s.slug}` }));
        if (filtered.length > 0) setServiceItems(filtered);
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    fetch(API.SETTINGS)
      .then(r => r.json())
      .then(data => { if (data && typeof data === 'object') setSettings(data); })
      .catch(() => {});
  }, []);

  const contactItems = DEFAULT_CONTACT.map(({ icon, text, href, key }) => ({
    icon,
    text: settings[key] || text,
    href: key === 'contact_email' ? `mailto:${settings[key] || text}` : key === 'contact_phone' ? `tel:${(settings[key] || text).replace(/[^+\d]/g, '')}` : href,
  }));

  const socialLinks = SOCIAL_KEYS.map(({ icon, key: settingKey }) => ({
    icon,
    href: settings[settingKey] || '#',
    key: settingKey,
  }));

  return (
    <footer className="border-t bg-background/50 backdrop-blur-xl">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/navlogo.png"
                alt="KSW TechZone"
                width={1556}
                height={591}
                className="h-20 w-auto"
                priority={false}
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Transforming Ideas Into Digital Solutions. Nepal-based technology company delivering enterprise-grade software solutions.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href, key }) => (
                <Link
                  key={key}
                  href={href}
                  className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center hover:bg-ksw-500 hover:text-white transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2">
              {serviceItems.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Account</h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {contactItems.map(({ icon: Icon, text, href }) => (
              <Link
                key={text}
                href={href}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4 text-ksw-500 shrink-0" />
                <span className="truncate">{text}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} KSW TechZone. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
