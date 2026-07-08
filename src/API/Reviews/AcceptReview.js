const AcceptReview = async (setError, setLoading, id) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/rate/accept/${id}`;
    setLoading(true);
    const token = localStorage.getItem("SGI_TOKEN");

    try {
        const response = await fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            return true;
        } else {
            setError(result.message || 'Failed to accept review');
            setLoading(false);
            return false;
        }
    } catch (error) {
        setError('An error occurred while accepting review');
        setLoading(false);
        return false;
    }
}

export default AcceptReview;
