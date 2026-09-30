'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Blocks,
  BookOpen,
  Braces,
  Check,
  Code,
  Copy,
  Gem,
  GitBranch,
  Link2,
  Package,
  Plus,
  Smartphone,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';

const LANGUAGE_ICONS: Record<string, React.ReactNode> = {
  'JavaScript / TypeScript': <Braces size={20} aria-hidden />,
  Python: <Terminal size={20} aria-hidden />,
  Go: <Code size={20} aria-hidden />,
  Ruby: <Gem size={20} aria-hidden />,
  PHP: <Package size={20} aria-hidden />,
  'Dart / Flutter': <Smartphone size={20} aria-hidden />,
  Kotlin: <Blocks size={20} aria-hidden />,
};

const officialSDKs = [
  {
    name: 'JavaScript / TypeScript',
    package: '@creditax/node',
    version: 'v2.1.4',
    versionStatus: 'stable',
    lastUpdated: '2 days ago',
    features: ['TypeScript types included', 'Promise-based API', 'Auto-retry on 429'],
    installCommand: 'npm install @creditax/node',
    alternativeInstall: 'yarn add @creditax/node',
    featured: true,
    links: {
      docs: '/developers/quickstart',
      github: 'https://github.com/creditax-ai/node-sdk',
      npm: 'https://npmjs.com/@creditax/node',
    },
  },
  {
    name: 'Python',
    package: 'creditax-python',
    version: 'v2.0.8',
    versionStatus: 'stable',
    lastUpdated: '1 week ago',
    features: ['Type hints included', 'Async support', 'Pydantic models'],
    installCommand: 'pip install creditax',
    alternativeInstall: 'pip install creditax[async]',
    featured: false,
    links: {
      docs: '/developers/quickstart',
      github: 'https://github.com/creditax-ai/python-sdk',
      npm: 'https://pypi.org/project/creditax',
    },
  },
  {
    name: 'Go',
    package: 'creditax-go',
    version: 'v2.0.3',
    versionStatus: 'stable',
    lastUpdated: '3 weeks ago',
    features: ['Generated from OpenAPI', 'Context support', 'Zero dependencies'],
    installCommand: 'go get github.com/creditax-ai/creditax-go',
    alternativeInstall: null,
    featured: false,
    links: {
      docs: '/developers/quickstart',
      github: 'https://github.com/creditax-ai/go-sdk',
      npm: 'https://pkg.go.dev/github.com/creditax-ai/creditax-go',
    },
  },
  {
    name: 'Ruby',
    package: 'creditax-ruby',
    version: 'v1.8.1',
    versionStatus: 'legacy',
    lastUpdated: '2 months ago',
    features: ['Rails integration', 'ActiveRecord support'],
    installCommand: 'gem install creditax',
    alternativeInstall: null,
    featured: false,
    links: {
      docs: '/developers/quickstart',
      github: 'https://github.com/creditax-ai/ruby-sdk',
      npm: 'https://rubygems.org/gems/creditax',
    },
  },
  {
    name: 'PHP',
    package: 'creditax/php-sdk',
    version: 'v1.4.0',
    versionStatus: 'legacy',
    lastUpdated: '4 months ago',
    features: ['Laravel support', 'PSR-18 compatible'],
    installCommand: 'composer require creditax/php-sdk',
    alternativeInstall: null,
    featured: false,
    links: {
      docs: '/developers/quickstart',
      github: 'https://github.com/creditax-ai/php-sdk',
      npm: 'https://packagist.org/packages/creditax/php-sdk',
    },
  },
];

const communitySDKs = [
  {
    name: 'Dart / Flutter',
    package: 'creditax-dart',
    author: '@kelechi_dev',
    description: 'Unofficial Dart SDK for Creditax.ai API with Flutter support',
    installCommand: 'dart pub add creditax_dart',
    github: 'https://github.com/kelechi_dev/creditax-dart',
  },
  {
    name: 'Kotlin',
    package: 'creditax-kotlin',
    author: '@techlagos',
    description: 'Unofficial Kotlin SDK with Coroutines and Flow support',
    installCommand: 'implementation "ai.creditax:kotlin:1.0.0"',
    github: 'https://github.com/techlagos/creditax-kotlin',
  },
];

export default function SDKsPage() {
  const [copiedPackage, setCopiedPackage] = useState<string | null>(null);

  const copyToClipboard = (text: string, packageName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPackage(packageName);
    setTimeout(() => setCopiedPackage(null), 2000);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Page heading */}
      <div>
        <h1>SDKs</h1>
        <p className="mt-2 max-w-2xl text-lg text-text-secondary">
          Official and community-maintained client libraries for the Creditax.ai API.
        </p>
      </div>

      {/* Official libraries */}
      <section>
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2>Official Libraries</h2>
            <Badge variant="success">Maintained by Creditax.ai</Badge>
          </div>
          <p className="text-sm text-text-muted">Updated with every API release · Full feature support</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {officialSDKs.map((sdk, index) => (
            <motion.div
              key={sdk.package}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card
                className={`flex h-full flex-col p-5 ${sdk.featured ? 'border-l-4 border-l-brand-primary' : ''}`}
                accent={sdk.featured ? 'teal' : 'none'}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary-bg border border-brand-primary-border flex items-center justify-center shrink-0 text-brand-primary">
                      {LANGUAGE_ICONS[sdk.name] ?? <Code size={20} aria-hidden />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate">{sdk.name}</h3>
                      <code className="block text-sm font-mono text-brand-primary truncate">{sdk.package}</code>
                    </div>
                  </div>
                  <Badge variant={sdk.versionStatus === 'stable' ? 'success' : 'warning'}>
                    {sdk.version}
                  </Badge>
                </div>

                {/* Status */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mb-4">
                  <span className="flex items-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sdk.versionStatus === 'stable' ? 'bg-success' : 'bg-warning'
                      }`}
                    />
                    {sdk.versionStatus === 'stable' ? 'Stable' : 'Legacy'}
                  </span>
                  <span aria-hidden>·</span>
                  <span>Last updated {sdk.lastUpdated}</span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {sdk.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-[11px] px-2 py-1 rounded bg-surface-inset text-text-secondary"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Install command */}
                <div className="mt-auto">
                  <div className="relative">
                    <code className="block text-xs font-mono text-text-primary bg-surface-deep p-3 pr-10 rounded-lg overflow-x-auto whitespace-pre">
                      {sdk.installCommand}
                    </code>
                    <button
                      type="button"
                      aria-label={`Copy install command for ${sdk.name}`}
                      onClick={() => copyToClipboard(sdk.installCommand, sdk.package)}
                      className="absolute top-2 right-2 p-1.5 rounded bg-surface-overlay text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    >
                      {copiedPackage === sdk.package ? (
                        <Check size={16} className="text-success-text" aria-hidden />
                      ) : (
                        <Copy size={16} aria-hidden />
                      )}
                    </button>
                  </div>
                  {sdk.alternativeInstall && (
                    <p className="text-xs text-text-muted mt-2">
                      or: <code className="text-brand-primary">{sdk.alternativeInstall}</code>
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border-default">
                  <a
                    href={sdk.links.docs}
                    className="flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
                  >
                    <BookOpen size={14} aria-hidden />
                    Docs
                  </a>
                  <a
                    href={sdk.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
                  >
                    <GitBranch size={14} aria-hidden />
                    GitHub
                  </a>
                  <a
                    href={sdk.links.npm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
                  >
                    <Link2 size={14} aria-hidden />
                    Registry
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community libraries */}
      <section>
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2>Community Libraries</h2>
            <Badge variant="info">Not officially maintained</Badge>
          </div>
          <p className="text-sm text-text-muted">
            Built by the community. Not officially maintained by Creditax.ai.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {communitySDKs.map((sdk, index) => (
            <motion.div
              key={sdk.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card className="h-full p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-inset border border-border-default flex items-center justify-center shrink-0 text-text-secondary">
                      {LANGUAGE_ICONS[sdk.name] ?? <Blocks size={20} aria-hidden />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate">{sdk.name}</h3>
                      <p className="text-sm text-text-muted">by {sdk.author}</p>
                    </div>
                  </div>
                  <a
                    href={sdk.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${sdk.name} on GitHub`}
                    className="flex items-center gap-1.5 text-sm text-brand-primary hover:underline shrink-0"
                  >
                    <GitBranch size={14} aria-hidden />
                    GitHub
                  </a>
                </div>
                <p className="text-sm text-text-secondary mb-4">{sdk.description}</p>
                <div className="relative">
                  <code className="block text-xs font-mono text-text-primary bg-surface-deep p-3 pr-10 rounded-lg overflow-x-auto whitespace-pre">
                    {sdk.installCommand}
                  </code>
                  <button
                    type="button"
                    aria-label={`Copy install command for ${sdk.name}`}
                    onClick={() => copyToClipboard(sdk.installCommand, sdk.package)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-surface-overlay text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {copiedPackage === sdk.package ? (
                      <Check size={16} className="text-success-text" aria-hidden />
                    ) : (
                      <Copy size={16} aria-hidden />
                    )}
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Request CTA */}
      <section>
        <Card className="mx-auto max-w-2xl p-8 text-center">
          <h3 className="mb-2">Missing your language?</h3>
          <p className="text-text-secondary mb-6">
            Request an SDK or contribute to an existing one. We welcome community contributions.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              toast('Library requested (demo)', {
                description: 'We prioritize official SDKs by language demand — Track B wires the request form.',
              })
            }
          >
            <Plus size={18} aria-hidden />
            Request Library
          </Button>
        </Card>
      </section>
    </div>
  );
}
