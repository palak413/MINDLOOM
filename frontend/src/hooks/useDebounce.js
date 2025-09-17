import { useState, useEffect } from 'react';

// value: The value to debounce (e.g., a search query)
// delay: The time to wait in milliseconds (e.g., 500)
function useDebounce(value, delay) {
    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if the value or delay changes before the timer runs out
        // This is the core of the debounce logic
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run the effect if value or delay changes

    return debouncedValue;
}

export default useDebounce;