import { useState } from 'react';
import { searchFlights } from '../services/flightService';
import useStore from '../store/useStore';

export const useFlights = () => {
    const { setFlights, setLoading, loading } = useStore();
    const [error, setError] = useState(null);

    const getFlights = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const results = await searchFlights(params);
            setFlights(results);
            return results;
        } catch (err) {
            setError('Failed to search flights. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { getFlights, loading, error };
};
