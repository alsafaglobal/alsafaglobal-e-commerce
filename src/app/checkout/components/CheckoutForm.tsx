'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

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
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface FormErrors {
  [key: string]: string;
}

interface CheckoutFormProps {
  onSubmit: (data: FormData) => void;
  isProcessing: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  isProcessing,
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState<number>(1);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(cleanNumber);
  };

  const validateExpiryDate = (expiryDate: string): boolean => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return expiryRegex.test(expiryDate);
  };

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter date in MM/YY format';
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!validateCVV(formData.cvv)) {
      newErrors.cvv = 'Please enter a valid 3 or 4-digit CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setFormData((prev) => ({ ...prev, expiryDate: value }));
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: '' }));
    }
  };

  const handleNextStep = () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep3()) {
      onSubmit(formData);
    }
  };

  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: 'Personal Info' },
      { number: 2, label: 'Shipping' },
      { number: 3, label: 'Payment' },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-data text-sm font-medium transition-luxury ${
                    currentStep >= step.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-text-secondary'
                  }`}
                >
                  {currentStep > step.number ? (
                    <Icon
                      name="CheckIcon"
                      size={20}
                      className="text-primary-foreground"
                    />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="mt-2 hidden font-body text-xs text-text-secondary sm:block">
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 transition-luxury ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="mb-4 font-heading text-xl font-semibold text-text-primary">
        Personal Information
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block font-body text-sm font-medium text-text-primary"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.firstName ? 'border-error' : 'border-border'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 caption text-error">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block font-body text-sm font-medium text-text-primary"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.lastName ? 'border-error' : 'border-border'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 caption text-error">{errors.lastName}</p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-body text-sm font-medium text-text-primary"
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
            errors.email ? 'border-error' : 'border-border'
          }`}
          placeholder="john.doe@example.com"
        />
        {errors.email && (
          <p className="mt-1 caption text-error">{errors.email}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block font-body text-sm font-medium text-text-primary"
        >
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
            errors.phone ? 'border-error' : 'border-border'
          }`}
          placeholder="(555) 123-4567"
        />
        {errors.phone && (
          <p className="mt-1 caption text-error">{errors.phone}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="mb-4 font-heading text-xl font-semibold text-text-primary">
        Shipping Address
      </h3>
      <div>
        <label
          htmlFor="address"
          className="mb-2 block font-body text-sm font-medium text-text-primary"
        >
          Street Address *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={`w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
            errors.address ? 'border-error' : 'border-border'
          }`}
          placeholder="123 Main Street"
        />
        {errors.address && (
          <p className="mt-1 caption text-error">{errors.address}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="city"
            className="mb-2 block font-body text-sm font-medium text-text-primary"
          >
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.city ? 'border-error' : 'border-border'
            }`}
            placeholder="New York"
          />
          {errors.city && (
            <p className="mt-1 caption text-error">{errors.city}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="state"
            className="mb-2 block font-body text-sm font-medium text-text-primary"
          >
            State *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.state ? 'border-error' : 'border-border'
            }`}
            placeholder="NY"
          />
          {errors.state && (
            <p className="mt-1 caption text-error">{errors.state}</p>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="zipCode"
            className="mb-2 block font-body text-sm font-medium text-text-primary"
          >
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className={`w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.zipCode ? 'border-error' : 'border-border'
            }`}
            placeholder="10001"
            maxLength={5}
          />
          {errors.zipCode && (
            <p className="mt-1 caption text-error">{errors.zipCode}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="country"
            className="mb-2 block font-body text-sm font-medium text-text-primary"
          >
            Country *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full rounded-md border border-border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="mb-4 font-heading text-xl font-semibold text-text-primary">
        Payment Information
      </h3>
      <div>
        <label
          htmlFor="cardNumber"
          className="mb-2 block font-body text-sm font-medium text-text-primary"
        >
          Card Number *
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleCardNumberChange}
          className={`w-full rounded-md border bg-input px-4 py-3 font-data text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
            errors.cardNumber ? 'border-error' : 'border-border'
          }`}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />
        {errors.cardNumber && (
          <p className="mt-1 caption text-error">{errors.cardNumber}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="cardName"
          className="mb-2 block font-body text-sm font-medium text-text-primary"
        >
          Cardholder Name *
        </label>
        <input
          type="text"
          id="cardName"
          name="cardName"
          value={formData.cardName}
          onChange={handleInputChange}
          className={`w-full rounded-md border bg-input px-4 py-3 font-body text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
            errors.cardName ? 'border-error' : 'border-border'
          }`}
          placeholder="John Doe"
        />
        {errors.cardName && (
          <p className="mt-1 caption text-error">{errors.cardName}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="expiryDate"
            className="mb-2 block font-body text-sm font-medium text-text-primary"
          >
            Expiry Date *
          </label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleExpiryDateChange}
            className={`w-full rounded-md border bg-input px-4 py-3 font-data text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.expiryDate ? 'border-error' : 'border-border'
            }`}
            placeholder="MM/YY"
            maxLength={5}
          />
          {errors.expiryDate && (
            <p className="mt-1 caption text-error">{errors.expiryDate}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="cvv"
            className="mb-2 block font-body text-sm font-medium text-text-primary"
          >
            CVV *
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            className={`w-full rounded-md border bg-input px-4 py-3 font-data text-sm text-text-primary transition-luxury focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.cvv ? 'border-error' : 'border-border'
            }`}
            placeholder="123"
            maxLength={4}
          />
          {errors.cvv && (
            <p className="mt-1 caption text-error">{errors.cvv}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex items-start gap-3 rounded-md bg-muted p-4">
        <Icon
          name="ShieldCheckIcon"
          size={20}
          className="mt-0.5 flex-shrink-0 text-success"
        />
        <p className="caption text-text-secondary">
          Your payment information is encrypted and secure. We never store your
          full card details.
        </p>
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
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="ArrowLeftIcon" size={16} />
            Previous
          </button>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="ml-auto flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90"
          >
            Next
            <Icon name="ArrowRightIcon" size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isProcessing}
            className="ml-auto flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <Icon name="CheckCircleIcon" size={16} />
                Place Order
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default CheckoutForm;