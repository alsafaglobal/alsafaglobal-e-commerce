'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface FormErrors {
  [key: string]: string;
}

interface CheckoutFormProps {
  onOrderComplete: (data: FormData, paymentIntentId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onOrderComplete }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United Arab Emirates',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState('');
  const [isElementReady, setIsElementReady] = useState(false);

  // CMS content
  const stepPersonal = useSiteContent('checkout_step_personal', 'Personal Info');
  const stepShipping = useSiteContent('checkout_step_shipping', 'Shipping');
  const stepPayment = useSiteContent('checkout_step_payment', 'Payment');
  const headingPersonal = useSiteContent('checkout_heading_personal', 'Personal Information');
  const headingShipping = useSiteContent('checkout_heading_shipping', 'Shipping Address');
  const headingPayment = useSiteContent('checkout_heading_payment', 'Payment Information');
  const labelFirstName = useSiteContent('checkout_label_first_name', 'First Name *');
  const labelLastName = useSiteContent('checkout_label_last_name', 'Last Name *');
  const labelEmail = useSiteContent('checkout_label_email', 'Email Address *');
  const labelPhone = useSiteContent('checkout_label_phone', 'Phone Number *');
  const labelAddress = useSiteContent('checkout_label_address', 'Street Address *');
  const labelCity = useSiteContent('checkout_label_city', 'City *');
  const labelState = useSiteContent('checkout_label_state', 'State / Emirate *');
  const labelZip = useSiteContent('checkout_label_zip', 'ZIP / Postal Code *');
  const labelCountry = useSiteContent('checkout_label_country', 'Country *');
  const securityText = useSiteContent('checkout_security_text', 'Your payment is processed securely by Stripe. We never see or store your card details.');
  const btnPrevious = useSiteContent('checkout_btn_previous', 'Previous');
  const btnNext = useSiteContent('checkout_btn_next', 'Next');
  const btnPlaceOrder = useSiteContent('checkout_btn_place_order', 'Place Order');
  const btnProcessing = useSiteContent('checkout_btn_processing', 'Processing...');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => phone.replace(/\D/g, '').length >= 7;

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State / Emirate is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleNextStep = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    if (isValid && currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setStripeError('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
        payment_method_data: {
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode || '00000',
              country: 'AE',
            },
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      setStripeError(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onOrderComplete(formData, paymentIntent.id);
    }

    setIsProcessing(false);
  };

  const inputCls = (hasError: boolean) =>
    `w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${hasError ? 'border-error' : 'border-border'}`;

  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: stepPersonal },
      { number: 2, label: stepShipping },
      { number: 3, label: stepPayment },
    ];
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-data text-sm font-medium transition-luxury ${
                  currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-secondary'
                }`}>
                  {currentStep > step.number ? (
                    <Icon name="CheckIcon" size={20} className="text-primary-foreground" />
                  ) : step.number}
                </div>
                <span className="mt-2 hidden font-body text-xs text-text-secondary sm:block">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 transition-luxury ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="mb-4 font-heading text-xl font-semibold text-text-primary">{headingPersonal}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-2 block font-body text-sm font-medium text-text-primary">{labelFirstName}</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputCls(!!errors.firstName)} placeholder="John" />
          {errors.firstName && <p className="mt-1 caption text-error">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block font-body text-sm font-medium text-text-primary">{labelLastName}</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className={inputCls(!!errors.lastName)} placeholder="Doe" />
          {errors.lastName && <p className="mt-1 caption text-error">{errors.lastName}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block font-body text-sm font-medium text-text-primary">{labelEmail}</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={inputCls(!!errors.email)} placeholder="john@example.com" />
        {errors.email && <p className="mt-1 caption text-error">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block font-body text-sm font-medium text-text-primary">{labelPhone}</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={inputCls(!!errors.phone)} placeholder="+971 50 123 4567" />
        {errors.phone && <p className="mt-1 caption text-error">{errors.phone}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="mb-4 font-heading text-xl font-semibold text-text-primary">{headingShipping}</h3>
      <div>
        <label htmlFor="address" className="mb-2 block font-body text-sm font-medium text-text-primary">{labelAddress}</label>
        <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className={inputCls(!!errors.address)} placeholder="123 Main Street, Apt 4" />
        {errors.address && <p className="mt-1 caption text-error">{errors.address}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="mb-2 block font-body text-sm font-medium text-text-primary">{labelCity}</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} className={inputCls(!!errors.city)} placeholder="Dubai" />
          {errors.city && <p className="mt-1 caption text-error">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="state" className="mb-2 block font-body text-sm font-medium text-text-primary">{labelState}</label>
          <input type="text" id="state" name="state" value={formData.state} onChange={handleInputChange} className={inputCls(!!errors.state)} placeholder="Dubai" />
          {errors.state && <p className="mt-1 caption text-error">{errors.state}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="zipCode" className="mb-2 block font-body text-sm font-medium text-text-primary">{labelZip}</label>
          <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className={inputCls(!!errors.zipCode)} placeholder="Optional" />
          {errors.zipCode && <p className="mt-1 caption text-error">{errors.zipCode}</p>}
        </div>
        <div>
          <label htmlFor="country" className="mb-2 block font-body text-sm font-medium text-text-primary">{labelCountry}</label>
          <select id="country" name="country" value={formData.country} onChange={handleInputChange}
            className="w-full rounded-md border border-border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Qatar">Qatar</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Oman">Oman</option>
            <option value="India">India</option>
            <option value="Pakistan">Pakistan</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="mb-4 font-heading text-xl font-semibold text-text-primary">{headingPayment}</h3>

      <PaymentElement
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
        }}
        onReady={() => setIsElementReady(true)}
      />

      {stripeError && (
        <div className="flex items-center gap-2 rounded-md border border-error/30 bg-error/10 p-3">
          <Icon name="ExclamationCircleIcon" size={18} className="flex-shrink-0 text-error" />
          <p className="caption text-error">{stripeError}</p>
        </div>
      )}

      <div className="mt-4 flex items-start gap-3 rounded-md bg-muted p-4">
        <Icon name="ShieldCheckIcon" size={20} className="mt-0.5 flex-shrink-0 text-success" />
        <p className="caption text-text-secondary">{securityText}</p>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-card p-6 shadow-luxury">
      {renderProgressBar()}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        {currentStep > 1 && (
          <button type="button" onClick={handlePrevStep} disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">
            <Icon name="ArrowLeftIcon" size={16} />
            {btnPrevious}
          </button>
        )}
        {currentStep < 3 ? (
          <button type="button" onClick={handleNextStep}
            className="ml-auto flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90">
            {btnNext}
            <Icon name="ArrowRightIcon" size={16} />
          </button>
        ) : (
          <button type="submit" disabled={isProcessing || !stripe || !elements || !isElementReady}
            className="ml-auto flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                {btnProcessing}
              </>
            ) : (
              <>
                <Icon name="LockClosedIcon" size={16} />
                {btnPlaceOrder}
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default CheckoutForm;
