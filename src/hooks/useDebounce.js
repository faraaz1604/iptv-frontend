import { useEffect, useState } from "react";

/**
 * Custom hook for debouncing values
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 500)
 * @returns {any} - The debounced value
 *
 * @example
 * const searchQuery = 'hello world';
 * const debouncedQuery = useDebounce(searchQuery, 300);
 *
 * // debouncedQuery will only update 300ms after user stops typing
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timer if value changes or component unmounts
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
