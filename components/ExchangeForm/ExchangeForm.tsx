'use client';

import { RiExchangeDollarFill } from 'react-icons/ri';

import styles from './ExchangeForm.module.css';
import { useCurrencyStore } from '@/lib/stores/currencyStore';
import { exchangeCurrency } from '@/lib/service/exchangeAPI';

export default function ExchangeForm() {
  const { setExchangeInfo, setIsLoading, setIsError } = useCurrencyStore();

  const handleSubmit = async (formData: FormData) => {
    const value = formData.get('currency') as string;
    const [amount, from, , to] = value.split(' ');

    try {
      setIsLoading(true);
      setIsError(null);
      const data = await exchangeCurrency({ amount, from, to });
      setExchangeInfo(data);
    } catch (error) {
      setIsError('Failed to exchange');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className={styles.form}>
      <button className={styles.button} type="submit">
        <RiExchangeDollarFill className={styles.icon} />
      </button>

      <input
        type="text"
        pattern="^\d+(\.\d{1,2})?\s[a-zA-Z]{3}\sin\s[a-zA-Z]{3}$"
        placeholder="15 USD in UAH"
        title="Request format 15 USD in UAH"
        className={styles.input}
        name="currency"
        required
      />
    </form>
  );
}
