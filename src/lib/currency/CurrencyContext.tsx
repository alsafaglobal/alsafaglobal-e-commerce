'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: string;
  rate: number;
  detectedCountry: string;
  formatPrice: (aedAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'AED',
  rate: 1,
  detectedCountry: 'United Arab Emirates',
  formatPrice: (amount) => `AED ${amount.toFixed(2)}`,
} as CurrencyContextType);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState(() => {
    if (typeof window === 'undefined') return 'AED';
    try { return localStorage.getItem('detected_currency') || 'AED'; } catch { return 'AED'; }
  });
  const [rate, setRate] = useState(() => {
    if (typeof window === 'undefined') return 1;
    try { return parseFloat(localStorage.getItem('detected_rate') || '1') || 1; } catch { return 1; }
  });
  const [detectedCountry, setDetectedCountry] = useState(() => {
    if (typeof window === 'undefined') return 'United Arab Emirates';
    try { return localStorage.getItem('detected_country_name') || 'United Arab Emirates'; } catch { return 'United Arab Emirates'; }
  });

  useEffect(() => {
    async function init() {
      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const userCurrency = geoData.currency || 'AED';
        const userCountryName = geoData.country_name || 'United Arab Emirates';

        let userRate = 1;
        if (userCurrency !== 'AED') {
          const ratesRes = await fetch('https://open.er-api.com/v6/latest/AED');
          const ratesData = await ratesRes.json();
          if (ratesData.rates?.[userCurrency]) {
            userRate = ratesData.rates[userCurrency];
          }
        }

        localStorage.setItem('detected_currency', userCurrency);
        localStorage.setItem('detected_rate', String(userRate));
        localStorage.setItem('detected_country_name', userCountryName);
        setCurrency(userCurrency);
        setRate(userRate);
        setDetectedCountry(userCountryName);
      } catch {
        setCurrency('AED');
        setRate(1);
      }
    }

    init();
  }, []);

  const formatPrice = (aedAmount: number): string => {
    const converted = Math.round(aedAmount * rate);
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, rate, detectedCountry, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
