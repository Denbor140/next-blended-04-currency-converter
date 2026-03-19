'use client';

import { Wave } from 'react-animated-text';

import Container from '@/components/Container/Container';
import Section from '@/components/Section/Section';
import Heading from '@/components/Heading/Heading';

import css from './RatesPage.module.css';
import { useCurrencyStore } from '@/lib/stores/currencyStore';
import RatesList from '@/components/RatesList/RatesList';
import { useEffect } from 'react';
import { latestRates } from '@/lib/service/exchangeAPI';
import Loader from '@/components/Loader/Loader';
import Filter from '@/components/Filter/Filter';

export default function RatesPage() {
  const {
    isError,
    setIsError,
    isLoading,
    setIsLoading,
    baseCurrency,
    rates,
    setRates,
    hasHydrated,
    filter,
  } = useCurrencyStore();

  const fileredRates = rates
    .filter(([key]) => key !== baseCurrency && key.toLowerCase().includes(filter))
    .map(([key, value]) => ({ key, value: (1 / value).toFixed(2) }));

  useEffect(() => {
    if (!baseCurrency) return;

    const fetchRates = async () => {
      setIsLoading(true);
      setIsError(null);
      try {
        const data = await latestRates(baseCurrency);
        setRates(data);
      } catch (error) {
        setIsError('Failed to fetch rates');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency, setRates, setIsLoading, setIsError]);

  if (!hasHydrated) return null;

  return (
    <main className={css.main}>
      <Section>
        <Container>
          <Heading
            info
            bottom
            title={
              <Wave
                text={`$ $ $ Current exchange rate for 1 ${baseCurrency} $ $ $`}
                effect="fadeOut"
                effectChange={4.0}
              />
            }
          />

          {isLoading && <Loader />}

          <Filter />

          {fileredRates.length > 0 && <RatesList rates={fileredRates} />}

          {isError && (
            <Heading error title="Something went wrong...😐 We cannot show current rates!" />
          )}
        </Container>
      </Section>
    </main>
  );
}
