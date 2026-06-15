'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { API } from '@/constants/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DEFAULT_SERVICES = [
  { name: 'Software Development', href: '/services/software' },
  { name: 'Web Development', href: '/services/web' },
  { name: 'Mobile App Development', href: '/services/mobile' },
  { name: 'Digital Marketing', href: '/services/marketing' },
  { name: 'Cloud Solutions', href: '/services/cloud' },
  { name: 'AI Solutions', href: '/services/ai' },
];

interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

const staticNav: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services', children: [] },
  { name: 'Products', href: '/products' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [serviceItems, setServiceItems] = React.useState(DEFAULT_SERVICES);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navigation = React.useMemo(
    () => staticNav.map(item =>
      item.name === 'Services'
        ? { ...item, children: serviceItems }
        : item
    ),
    [serviceItems]
  );

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b'
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-28 sm:hidden">
            <Image
              src="/navlogo.png"
              alt="KSW TechZone"
              fill
              sizes="112px"
              className="object-contain"
              priority
            />
          </div>
          <div className="relative h-8 w-8 hidden sm:block">
            <Image
              src="/logo.png"
              alt="KSW TechZone"
              fill
              sizes="32px"
              className="object-contain rounded-lg"
              priority
            />
          </div>
          <span className="font-bold text-xl hidden sm:block">
            KSW <span className="text-ksw-500">TechZone</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children && item.children.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm font-medium gap-1"
                    >
                      {item.name}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56 max-h-[60vh] overflow-y-auto">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link href={child.href}>{child.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    'text-sm font-medium',
                    pathname === item.href && 'text-ksw-500'
                  )}
                >
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden lg:inline-flex rounded-full">
            <Link href="/contact">Get a Quote</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-background/95 backdrop-blur-xl lg:hidden overflow-hidden"
          >
            <div className="container py-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children && item.children.length > 0 ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                        {item.name}
                      </div>
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-6 py-2 text-sm hover:text-ksw-500 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors',
                        pathname === item.href && 'text-ksw-500'
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 px-3">
                <Button asChild className="w-full rounded-full" onClick={() => setIsOpen(false)}>
                  <Link href="/contact">Get a Quote</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
