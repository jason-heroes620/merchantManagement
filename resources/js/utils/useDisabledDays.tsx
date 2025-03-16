import axios from 'axios'; // Or your preferred HTTP client
import { useEffect, useState } from 'react';

const useDisabledDays = (proposalId: string) => {
    const [disabledDays, setDisabledDays] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDisabledDays = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    route('proposal.getDisabledDays', proposalId),
                ); // Replace with your API endpoint
                setDisabledDays(response.data); // Assuming the API returns an array of numbers
            } catch (err: any) {
                setError(err.message || 'Failed to fetch disabled days.');
            } finally {
                setLoading(false);
            }
        };

        fetchDisabledDays();
    }, []);

    return { disabledDays, loading, error };
};

export default useDisabledDays;
