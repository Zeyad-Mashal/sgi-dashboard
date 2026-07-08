const GetReviews = async (setReviews, setError, setLoading) => {
    const URL = "https://sgi-dy1p.onrender.com/api/v1/rate/get";
    setLoading(true);
    const token = localStorage.getItem("SGI_TOKEN");

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            // The API might return array directly or inside rates/reviews
            const fetchedReviews = result.rates || result.reviews || result.data || (Array.isArray(result) ? result : []);
            setReviews(fetchedReviews);
            setLoading(false);
        } else {
            setError(result.message || 'Failed to fetch reviews');
            setLoading(false);
        }
    } catch (error) {
        setError('An error occurred while fetching reviews');
        setLoading(false);
    }
}

export default GetReviews;
