'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: string;
  formatPrice: (aedAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'AED',
  formatPrice: (amount) => `AED ${amount.toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState(() => {
    if (typeof window === 'undefined') return 'AED';
    try { return localStorage.getItem('detected_currency') || 'AED'; } catch { return 'AED'; }
  });
  const [rate, setRate] = useState(() => {
    if (typeof window === 'undefined') return 1;
    try { return parseFloat(localStorage.getItem('detected_rate') || '1') || 1; } catch { return 1; }
  });

  useEffect(() => {
    async function init() {
      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const userCurrency = geoData.currency || 'AED';

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
        setCurrency(userCurrency);
        setRate(userRate);
      } catch {
        setCurrency('AED');
        setRate(1);
      }
    }

    init();
  }, []);

  const formatPrice = (aedAmount: number): string => {
    const converted = aedAmount * rate;
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
