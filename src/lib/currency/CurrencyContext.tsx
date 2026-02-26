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
  const [currency, setCurrency] = useState('AED');
  const [rate, setRate] = useState(1);

  useEffect(() => {
    async function init() {
      try {
        // Detect user country via IP
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const userCurrency = geoData.currency || 'AED';

        if (userCurrency !== 'AED') {
          // Fetch AED exchange rates (free, no API key)
          const ratesRes = await fetch('https://open.er-api.com/v6/latest/AED');
          const ratesData = await ratesRes.json();
          if (ratesData.rates?.[userCurrency]) {
            setRate(ratesData.rates[userCurrency]);
          }
        }

        setCurrency(userCurrency);
      } catch {
        // Default to AED on any error
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
