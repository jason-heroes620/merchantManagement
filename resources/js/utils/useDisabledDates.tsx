import axios from 'axios'; // Or your preferred HTTP client
import { useEffect, useState } from 'react';

const useDisabledDates = (proposalId: string, locationId: []) => {
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDisabledDates = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    route('proposal.getDisabledDates', proposalId),
                    {
                        params: {
                            locationId: locationId,
                        },
                    },
                ); // Replace with your API endpoint
                setDisabledDates(response.data); // Assuming the API returns an array of numbers
            } catch (err: any) {
                setError(err.message || 'Failed to fetch disabled days.');
            } finally {
                setLoading(false);
            }
        };

        fetchDisabledDates();
    }, []);

    return { disabledDates, loading, error };
};

export default useDisabledDates;
