import { useEffect, useState } from "react";

const useFetch = (fetchFn, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await fetchFn();
                if (!cancelled) {
                    setData(result);
                }
            }
            catch(err) {
                if (!cancelled) {
                    setError(err.message || "Unknown error");
                }
            }
            finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, deps);

    return { data, loading, error };
};

export default useFetch;