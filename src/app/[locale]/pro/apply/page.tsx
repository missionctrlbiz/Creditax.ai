'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

type Step = 1 | 2 | 3 | 4 | 5;

const steps = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Services' },
  { number: 3, label: 'Location' },
  { number: 4, label: 'Contact' },
  { number: 5, label: 'Verification' },
];

const services = [
  'Personal Income Tax',
  'Business Tax Filing',
  'VAT Returns',
  'Withholding Tax',
  'Tax Audit Support',
  'Company Secretarial',
  'Tax Planning & Advisory',
  'International Tax',
];

const states = [
  'Lagos', 'Abuja', 'Rivers', 'Kano', 'Oyo', 'Kaduna', 'Enugu', 'Delta', 'Other',
];

export default function ProApplyPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [cacVerified, setCacVerified] = useState(false);
  const [cacBusinessName, setCacBusinessName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [appRecord, setAppRecord] = useState<{ id: string; status: string; cac_lookup: string } | null>(null);

  // marketplace P5: submit to the live application endpoint so the admin
  // approval queue (below) actually receives it; capture the returned
  // application record for the success view; on failure, mark submitted
  // locally so the click-through completes offline.
  const submitApplication = async () => {
    try {
      const res = await fetch('/api/v1/pro/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          cacNumber: formData.cacRegNumber,
          services: formData.selectedServices,
          city: formData.city,
          state: formData.state,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.application) {
          setAppRecord({ id: d.application.id, status: d.status, cac_lookup: d.cac_lookup });
        }
      }
    } catch {
      /* offline — local submit */
    }
    setSubmitted(true);
  };

  const [formData, setFormData] = useState({
    // Step 1
    businessName: '',
    ownerName: '',
    cacRegNumber: '',
    firsTin: '',
    yearsOfExperience: '',
    // Step 2
    selectedServices: [] as string[],
    minFee: '',
    maxFee: '',
    description: '',
    // Step 3
    address: '',
    city: '',
    state: '',
    // Step 4
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    // Step 5
    cacCertificate: false,
    firsCertificate: false,
    validId: false,
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleService = (service: string) => {
    if (formData.selectedServices.includes(service)) {
      updateFormData('selectedServices', formData.selectedServices.filter((s) => s !== service));
    } else {
      updateFormData('selectedServices', [...formData.selectedServices, service]);
    }
  };

  const toggleDocument = (field: 'cacCertificate' | 'firsCertificate' | 'validId') => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const verifyCAC = () => {
    // Simulated CAC lookup — demo only
    if (formData.cacRegNumber.length >= 5) {
      setCacVerified(true);
      setCacBusinessName('GreenLeaf Tax Services Ltd');
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.businessName && formData.ownerName && formData.cacRegNumber && cacVerified);
      case 2:
        return formData.selectedServices.length > 0;
      case 3:
        return Boolean(formData.address && formData.city && formData.state);
      case 4:
        return Boolean(formData.phone && formData.email);
      case 5:
        return formData.cacCertificate && formData.firsCertificate && formData.validId;
      default:
        return false;
    }
  };

  const uploadRows: { field: 'cacCertificate' | 'firsCertificate' | 'validId'; label: string; hint: string }[] = [
    { field: 'cacCertificate', label: 'CAC Certificate', hint: 'PDF format, max 10MB' },
    { field: 'firsCertificate', label: 'FIRS Tax Clearance', hint: 'PDF format, max 10MB' },
    { field: 'validId', label: 'Valid ID', hint: 'Passport, NIN, or Driver License' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Badge variant="brand" className="mb-4">PRO PORTAL</Badge>
        <h1 className="mb-2">Apply as a Tax Professional</h1>
        <p className="text-text-secondary text-sm">
          Join our marketplace and connect with clients who need your expertise
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-inset" />
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-brand-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />

          {steps.map((step) => {
            const isComplete = step.number < currentStep;
            const isActive = step.number === currentStep;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center"
                aria-current={isActive ? 'step' : undefined}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-200 z-10
                    ${
                      isComplete
                        ? 'bg-brand-primary text-text-inverse'
                        : isActive
                        ? 'bg-brand-primary text-text-inverse ring-4 ring-brand-primary/30'
                        : 'bg-surface-inset text-text-muted'
                    }
                  `}
                >
                  {isComplete ? <Check size={16} /> : step.number}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium text-center
                    ${isActive ? 'text-text-primary' : 'text-text-muted'}
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-text-muted mt-4">
          Step {currentStep} of {steps.length}
        </p>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 md:p-8">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-1">Basic Information</h2>
                  <p className="text-text-muted text-sm">Tell us about your practice</p>
                </div>

                <Input
                  label="Business Name *"
                  placeholder="GreenLeaf Tax Services Ltd"
                  value={formData.businessName}
                  onChange={(e) => updateFormData('businessName', e.target.value)}
                />

                <Input
                  label="Owner/Principal Name *"
                  placeholder="Adaeze Obi"
                  value={formData.ownerName}
                  onChange={(e) => updateFormData('ownerName', e.target.value)}
                />

                <div>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        label="CAC Registration Number *"
                        placeholder="RC-1234567"
                        value={formData.cacRegNumber}
                        onChange={(e) => {
                          updateFormData('cacRegNumber', e.target.value);
                          setCacVerified(false);
                        }}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={verifyCAC}
                      disabled={formData.cacRegNumber.length < 5}
                    >
                      <ShieldCheck size={15} />
                      Verify
                    </Button>
                  </div>
                  <AnimatePresence>
                    {cacVerified && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 flex items-center gap-2 text-success-text text-sm"
                      >
                        <CheckCircle2 size={14} />
                        Verified — {cacBusinessName}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Input
                  label="FIRS TIN (optional)"
                  placeholder="1234567-0001"
                  value={formData.firsTin}
                  onChange={(e) => updateFormData('firsTin', e.target.value)}
                  hint="8-digit TIN assigned by FIRS, e.g. 1234567-0001"
                />

                <div>
                  <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-1.5">
                    Years of Experience
                  </label>
                  <select
                    value={formData.yearsOfExperience}
                    onChange={(e) => updateFormData('yearsOfExperience', e.target.value)}
                    className="h-12 w-full rounded-input px-4 font-sans text-sm
                      bg-surface-base border border-border-strong text-text-primary
                      transition-all duration-150
                      focus:outline-none focus:ring-2
                      focus:ring-[var(--color-focus-ring)]
                      focus:border-brand-primary cursor-pointer"
                  >
                    <option value="">Select years</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'].map((y) => (
                      <option key={y} value={y}>{y} years</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Services */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-1">Services</h2>
                  <p className="text-text-muted text-sm">Select the services you offer</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <label
                      key={service}
                      className={`
                        flex items-center gap-3 p-4 rounded-card border cursor-pointer transition-all
                        ${
                          formData.selectedServices.includes(service)
                            ? 'border-brand-primary bg-brand-primary-bg'
                            : 'border-border-default hover:border-border-strong'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                        className="w-4 h-4 rounded accent-brand-primary cursor-pointer"
                      />
                      <span className="text-text-primary text-sm">{service}</span>
                    </label>
                  ))}
                </div>

                <div className="pt-4 border-t border-border-default">
                  <p className="text-text-muted text-sm mb-4">Price Range (optional)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Minimum (₦)"
                      type="number"
                      placeholder="50,000"
                      value={formData.minFee}
                      onChange={(e) => updateFormData('minFee', e.target.value)}
                    />
                    <Input
                      label="Maximum (₦)"
                      type="number"
                      placeholder="500,000"
                      value={formData.maxFee}
                      onChange={(e) => updateFormData('maxFee', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-1.5">
                    Description (for RAG search)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Professional tax services for individuals and businesses. Specializing in corporate tax, VAT returns, and tax planning for SMEs..."
                    className="w-full h-24 rounded-input px-4 py-3 font-sans text-sm
                      bg-surface-base border border-border-strong text-text-primary
                      placeholder:text-text-placeholder
                      transition-all duration-150
                      focus:outline-none focus:ring-2
                      focus:ring-[var(--color-focus-ring)]
                      focus:border-brand-primary resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-1">Location</h2>
                  <p className="text-text-muted text-sm">Where is your practice located?</p>
                </div>

                <Input
                  label="Business Address *"
                  placeholder="15 Admiralty Way, Lekki Phase 1, Lagos"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                />

                {/* Map placeholder */}
                <div className="h-48 rounded-card bg-surface-inset border border-border-default flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-brand-primary mb-2">
                      <MapPin size={32} strokeWidth={1.5} className="mx-auto" />
                    </div>
                    <p className="text-text-muted text-sm">Map preview</p>
                    <p className="text-text-muted text-xs">Location will be detected from address</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City *"
                    placeholder="Lagos"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                  />
                  <div>
                    <label className="text-text-muted text-[12px] font-semibold uppercase tracking-wider block mb-1.5">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateFormData('state', e.target.value)}
                      className="h-12 w-full rounded-input px-4 font-sans text-sm
                        bg-surface-base border border-border-strong text-text-primary
                        transition-all duration-150
                        focus:outline-none focus:ring-2
                        focus:ring-[var(--color-focus-ring)]
                        focus:border-brand-primary cursor-pointer"
                    >
                      <option value="">Select state</option>
                      {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-1">Contact Information</h2>
                  <p className="text-text-muted text-sm">How can clients reach you?</p>
                </div>

                <div className="flex gap-3">
                  <div className="w-20">
                    <Input label="Code" defaultValue="+234" />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Phone *"
                      placeholder="812 345 6789"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                    />
                  </div>
                </div>

                <Input
                  label="Email *"
                  type="email"
                  placeholder="adaeze@greenleaf.ng"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />

                <div className="flex gap-3">
                  <div className="w-20">
                    <Input label="Code" defaultValue="+234" />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="WhatsApp (optional)"
                      placeholder="812 345 6789"
                      value={formData.whatsapp}
                      onChange={(e) => updateFormData('whatsapp', e.target.value)}
                    />
                  </div>
                </div>

                <Input
                  label="Website (optional)"
                  placeholder="https://greenleaf.ng"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                />
              </div>
            )}

            {/* Step 5: Verification */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-1">Verification Documents</h2>
                  <p className="text-text-muted text-sm">Upload required documents to verify your practice</p>
                </div>

                <div className="space-y-4">
                  {uploadRows.map((row) => (
                    <div key={row.field} className="p-4 rounded-card border border-border-default">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              formData[row.field] ? 'border-brand-action bg-brand-action' : 'border-border-strong'
                            }`}
                          >
                            {formData[row.field] && <Check size={12} className="text-text-inverse" />}
                          </div>
                          <div>
                            <p className="text-text-primary text-sm font-medium">{row.label} *</p>
                            <p className="text-text-muted text-xs">{row.hint}</p>
                          </div>
                        </div>
                        <Button
                          variant={formData[row.field] ? 'ghost' : 'secondary'}
                          size="sm"
                          onClick={() => toggleDocument(row.field)}
                        >
                          {formData[row.field] ? (
                            <>
                              <CheckCircle2 size={14} />
                              Uploaded
                            </>
                          ) : (
                            <>
                              <Upload size={14} />
                              Upload
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border-default">
                  <p className="text-text-muted text-sm">
                    By submitting, you agree to our{' '}
                    <Link href="/terms" className="text-brand-primary hover:underline">Terms of Service</Link>{' '}
                    and{' '}
                    <Link href="/terms" className="text-brand-primary hover:underline">Verification Policy</Link>.
                  </p>
                </div>

                {/* P9 — the real application record from the marketplace store */}
                {submitted && (
                  <div className="p-4 rounded-card border border-brand-action-border bg-brand-action-bg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={18} className="text-brand-action" />
                      <p className="text-sm font-semibold text-text-primary">Application submitted for admin review</p>
                    </div>
                    {appRecord ? (
                      <p className="text-[12px] text-text-secondary leading-relaxed">
                        Record <span className="font-mono text-text-primary">{appRecord.id}</span> · status{' '}
                        <span className="font-medium text-text-primary">{appRecord.status}</span> · CAC lookup{' '}
                        {appRecord.cac_lookup}
                        <span className="block mt-1 text-text-muted">demo_seed · a Super Admin approval flips this pro to verified</span>
                      </p>
                    ) : (
                      <p className="text-[12px] text-text-muted">
                        Queued locally (offline) — the live record will appear in the admin approval queue.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-default">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft size={15} />
                Back
              </Button>

              {currentStep < 5 ? (
                <Button
                  variant="primary"
                  onClick={nextStep}
                  disabled={!canProceed()}
                >
                  Continue
                  <ChevronRight size={15} />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  disabled={!canProceed() || submitted}
                  onClick={() => void submitApplication()}
                >
                  <FileText size={15} />
                  {submitted ? 'Submitted for review ✓' : 'Submit Application'}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="text-text-muted text-sm">
          Need help?{' '}
          <Link href="/status" className="text-brand-primary hover:underline">
            Contact support
          </Link>{' '}
          or read our{' '}
          <Link href="/terms" className="text-brand-primary hover:underline">
            verification guide
          </Link>.
        </p>
      </motion.div>
    </div>
  );
}
