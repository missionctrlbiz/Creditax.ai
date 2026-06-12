'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

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
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">Client Libraries</h1>
          <p className="text-text-secondary text-lg">
            Official and community-maintained SDKs for the Creditax.ai API.
          </p>
        </motion.div>

        {/* Official Libraries Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-text-primary">Official Libraries</h2>
              <Badge variant="success">Maintained by Creditax.ai</Badge>
            </div>
            <p className="text-sm text-text-muted">
              Updated with every API release · Full feature support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officialSDKs.map((sdk, index) => (
              <motion.div
                key={sdk.package}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card
                  className={`p-5 h-full flex flex-col ${
                    sdk.featured ? 'border-l-4 border-l-brand-primary' : ''
                  }`}
                  accent={sdk.featured ? 'teal' : 'none'}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-inset flex items-center justify-center">
                        {sdk.name.includes('JavaScript') ? (
                          <svg viewBox="0 0 24 24" className="w-6 h-6 text-yellow-400">
                            <path fill="currentColor" d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
                          </svg>
                        ) : sdk.name === 'Python' ? (
                          <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400">
                            <path fill="currentColor" d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h5.84l.69.05.6.12.52.18.44.22.39.26.33.29.28.3.23.32.18.33.15.33.1.32.08.3.04.27.03.23.01.16v1.95l-.02.06-.03.11-.04.16-.06.2-.08.23-.1.25-.12.26-.14.26-.15.25-.16.23-.17.21-.17.18-.16.16-.15.13-.14.1-.12.08-.09.05-.07.03H5.84l-.69-.05-.6-.12-.52-.18-.44-.22-.39-.26-.33-.29-.28-.3-.23-.32-.18-.33-.15-.33-.1-.32-.08-.3-.04-.27-.03-.23-.01-.16v-1.95l.02-.06.03-.11.04-.16.06-.2.08-.23.1-.25.12-.26.14-.26.15-.25.16-.23.17-.21.17-.18.16-.16.15-.13.14-.1.12-.08.09-.05.07-.03h7.22l.69.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02h-5.84l-.69-.05-.6-.12-.52-.18-.44-.23-.39-.26-.33-.29-.28-.3-.23-.32-.18-.33-.15-.33-.1-.32-.08-.3-.04-.28-.03-.23-.01-.16v-1.95l.02-.06.03-.11.04-.16.06-.2.08-.23.1-.25.12-.26.14-.26.15-.25.16-.23.17-.21.17-.18.16-.16.15-.14.14-.1.12-.08.09-.05.07-.03h5.84l.69.05.6.12.52.18.44.23.39.26.33.29.28.3.23.32.18.33.15.33.1.32.08.3.04.28.03.23.01.16v1.95l-.02.06-.03.11-.04.16-.06.2-.08.23-.1.25-.12.26-.14.26-.15.25-.16.23-.17.21-.17.18-.16.16-.15.14-.14.1-.12.08-.09.05-.07.03h-5.84l-.69-.05-.6-.12-.52-.18-.44-.23-.39-.26-.33-.29-.28-.3-.23-.32-.18-.33-.15-.33-.1-.32-.08-.3-.04-.28-.03-.23-.01-.16v-1.95l.02-.06.03-.11.04-.16.06-.2.08-.23.1-.25.12-.26.14-.26.15-.25.16-.23.17-.21.17-.18.16-.16.15-.14.14-.1.12-.08.09-.05.07-.03h7.22l.69.05zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" />
                          </svg>
                        ) : sdk.name === 'Go' ? (
                          <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-400">
                            <path fill="currentColor" d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2m3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 01-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106zm2.78-4.72c-.011-.153-.011-.27-.034-.386-.21-1.157-1.274-1.81-2.384-1.554-1.087.245-1.788 1.063-1.928 2.162-.094.72.07 1.378.433 1.97.709 1.157 1.879 1.564 3.143 1.343.609-.105 1.121-.362 1.544-.77.094-.093.105-.129.058-.21a2.409 2.409 0 00-.832-1.555z" />
                          </svg>
                        ) : sdk.name === 'Ruby' ? (
                          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-500">
                            <path fill="currentColor" d="M20.156.083c3.033.525 3.893 2.598 3.829 4.77L24 4.822 22.635 22.71 4.89 23.926h-.034L.046 4.822 4.89.083h3.609l2.406 16.205L9.517.083h3.456l1.172 16.205L16.82.083h3.336zM8.476 20.08l11.15-.916L17.78 4.41l-3.02 15.67H8.476zm5.127-16.205l.78 11.58 5.12-.416-5.9-11.164z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-400">
                            <path fill="currentColor" d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-.93 14.563L6.637 12.25l1.837-1.23 2.595 1.01 2.57-1.01 1.836 1.23-4.545 2.313zM7.408 9.35l1.32 3.572 4.464-2.29L7.408 9.35zm9.184 2.29l1.32-3.572-5.784 1.282 4.464 2.29zm-9.184-4.29l-1.32-3.572 5.784 1.282-4.464 2.29zm9.184-2.29L7.408 6.65l5.784-1.282-4.464 2.29z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-text-primary">{sdk.name}</h3>
                        <code className="text-sm text-brand-primary">{sdk.package}</code>
                      </div>
                    </div>
                    <Badge variant={sdk.versionStatus === 'stable' ? 'success' : 'warning'}>
                      {sdk.version}
                    </Badge>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${sdk.versionStatus === 'stable' ? 'bg-success' : 'bg-warning'}`} />
                      {sdk.versionStatus === 'stable' ? 'Stable' : 'Legacy'}
                    </span>
                    <span>·</span>
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

                  {/* Install Command */}
                  <div className="mt-auto">
                    <div className="relative">
                      <code className="block text-xs font-mono text-text-primary bg-surface-deep p-3 rounded-lg break-all">
                        {sdk.installCommand}
                      </code>
                      <button
                        onClick={() => copyToClipboard(sdk.installCommand, sdk.package)}
                        className="absolute top-2 right-2 p-1.5 rounded bg-surface-overlay text-text-muted hover:text-text-primary transition-colors"
                      >
                        {copiedPackage === sdk.package ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-success-text">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </svg>
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
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-default">
                    <a href={sdk.links.docs} className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Docs
                    </a>
                    <a href={sdk.links.github} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                    <a href={sdk.links.npm} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M0 7.334v8h6.666v1.332H12h5.334V24h6.666V0H12V4.001H6.666V0H0v7.334zM6.666 6.668h5.334V12h1.334V6.668H18.668V5.335H6.666v1.333zm0 14.664V24h5.334v-2.668H6.666zm6.668 0V24h5.334v-2.668h-5.334z" />
                      </svg>
                      npm
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Community Libraries Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-text-primary">Community Libraries</h2>
              <Badge variant="info">Not officially maintained</Badge>
            </div>
            <p className="text-sm text-text-muted">
              Built by the community. Not officially maintained by Creditax.ai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communitySDKs.map((sdk, index) => (
              <motion.div
                key={sdk.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-text-primary mb-1">{sdk.name}</h3>
                      <p className="text-sm text-text-muted">by {sdk.author}</p>
                    </div>
                    <a
                      href={sdk.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">{sdk.description}</p>
                  <div className="relative">
                    <code className="block text-xs font-mono text-text-primary bg-surface-deep p-3 rounded-lg break-all">
                      {sdk.installCommand}
                    </code>
                    <button
                      onClick={() => copyToClipboard(sdk.installCommand, sdk.package)}
                      className="absolute top-2 right-2 p-1.5 rounded bg-surface-overlay text-text-muted hover:text-text-primary transition-colors"
                    >
                      {copiedPackage === sdk.package ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-success-text">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Request CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <Card className="p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-text-primary mb-2">Missing your language?</h3>
            <p className="text-text-secondary mb-6">
              Request an SDK or contribute to an existing one. We welcome community contributions.
            </p>
            <Button variant="secondary" size="xl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Request Library
            </Button>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}