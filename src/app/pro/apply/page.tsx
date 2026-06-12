'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function ProApplyPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [cacVerified, setCacVerified] = useState(false);
  const [cacBusinessName, setCacBusinessName] = useState('');

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

  const verifyCAC = () => {
    // Simulate CAC verification
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
        return formData.businessName && formData.ownerName && formData.cacRegNumber && cacVerified;
      case 2:
        return formData.selectedServices.length > 0;
      case 3:
        return formData.address && formData.city && formData.state;
      case 4:
        return formData.phone && formData.email;
      case 5:
        return formData.cacCertificate && formData.firsCertificate && formData.validId;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'var(--ambient-glow)' }} />

      <div className="relative max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge variant="brand" className="mb-4">PRO PORTAL</Badge>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-text-primary mb-2">
            Apply as a Tax Professional
          </h1>
          <p className="text-text-secondary">
            Join our marketplace and connect with clients who need your expertise
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
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

            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-200 z-10
                    ${
                      step.number < currentStep
                        ? 'bg-brand-primary text-text-inverse'
                        : step.number === currentStep
                        ? 'bg-brand-primary text-text-inverse ring-4 ring-brand-primary/30'
                        : 'bg-surface-inset text-text-muted'
                    }
                  `}
                >
                  {step.number < currentStep ? '✓' : step.number}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${step.number === currentStep ? 'text-text-primary' : 'text-text-muted'}
                  `}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
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
            <Card className="p-8">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1">Basic Information</h2>
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
                        size="sm"
                        onClick={verifyCAC}
                        disabled={formData.cacRegNumber.length < 5}
                      >
                        Verify via API
                      </Button>
                    </div>
                    {cacVerified && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-2 text-success text-sm"
                      >
                        <span>✓</span> Verified! {cacBusinessName}
                      </motion.div>
                    )}
                  </div>

                  <Input
                    label="FIRS TIN (optional)"
                    placeholder="1234567-0001"
                    value={formData.firsTin}
                    onChange={(e) => updateFormData('firsTin', e.target.value)}
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
                    <h2 className="text-xl font-bold text-text-primary mb-1">Services</h2>
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
                              : 'border-border-default hover:border-[var(--color-border-strong)]'
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
                    <h2 className="text-xl font-bold text-text-primary mb-1">Location</h2>
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
                      <div className="text-4xl mb-2">📍</div>
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
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Kano">Kano</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Kaduna">Kaduna</option>
                        <option value="Enugu">Enugu</option>
                        <option value="Delta">Delta</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Contact */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1">Contact Information</h2>
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
                    <h2 className="text-xl font-bold text-text-primary mb-1">Verification Documents</h2>
                    <p className="text-text-muted text-sm">Upload required documents to verify your practice</p>
                  </div>

                  <div className="space-y-4">
                    {/* CAC Certificate */}
                    <div className="p-4 rounded-card border border-border-default">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.cacCertificate ? 'border-success bg-success' : 'border-border-strong'}`}>
                            {formData.cacCertificate && <span className="text-text-inverse text-xs">✓</span>}
                          </div>
                          <div>
                            <p className="text-text-primary text-sm font-medium">CAC Certificate *</p>
                            <p className="text-text-muted text-xs">PDF format, max 10MB</p>
                          </div>
                        </div>
                        <Button
                          variant={formData.cacCertificate ? 'ghost' : 'secondary'}
                          size="sm"
                          onClick={() => updateFormData('cacCertificate', !formData.cacCertificate as unknown as string)}
                        >
                          {formData.cacCertificate ? '✓ Uploaded' : 'Upload'}
                        </Button>
                      </div>
                    </div>

                    {/* FIRS Certificate */}
                    <div className="p-4 rounded-card border border-border-default">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.firsCertificate ? 'border-success bg-success' : 'border-border-strong'}`}>
                            {formData.firsCertificate && <span className="text-text-inverse text-xs">✓</span>}
                          </div>
                          <div>
                            <p className="text-text-primary text-sm font-medium">FIRS Certificate *</p>
                            <p className="text-text-muted text-xs">PDF format, max 10MB</p>
                          </div>
                        </div>
                        <Button
                          variant={formData.firsCertificate ? 'ghost' : 'secondary'}
                          size="sm"
                          onClick={() => updateFormData('firsCertificate', !formData.firsCertificate as unknown as string)}
                        >
                          {formData.firsCertificate ? '✓ Uploaded' : 'Upload'}
                        </Button>
                      </div>
                    </div>

                    {/* Valid ID */}
                    <div className="p-4 rounded-card border border-border-default">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.validId ? 'border-success bg-success' : 'border-border-strong'}`}>
                            {formData.validId && <span className="text-text-inverse text-xs">✓</span>}
                          </div>
                          <div>
                            <p className="text-text-primary text-sm font-medium">Valid ID *</p>
                            <p className="text-text-muted text-xs">Passport, NIN, or Driver License</p>
                          </div>
                        </div>
                        <Button
                          variant={formData.validId ? 'ghost' : 'secondary'}
                          size="sm"
                          onClick={() => updateFormData('validId', !formData.validId as unknown as string)}
                        >
                          {formData.validId ? '✓ Uploaded' : 'Upload'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-default">
                    <p className="text-text-muted text-sm">
                      By submitting, you agree to our{' '}
                      <a href="#" className="text-brand-primary hover:underline">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-brand-primary hover:underline">Verification Policy</a>.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-default">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  ← Back
                </Button>

                {currentStep < 5 ? (
                  <Button
                    variant="primary"
                    onClick={nextStep}
                    disabled={!canProceed()}
                  >
                    Continue →
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    disabled={!canProceed()}
                  >
                    Submit Application
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
            <a href="#" className="text-brand-primary hover:underline">
              Contact support
            </a>{' '}
            or read our{' '}
            <a href="#" className="text-brand-primary hover:underline">
              verification guide
            </a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}