const RejectReview = async (setError, setLoading, id) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/rate/reject/${id}`;
    setLoading(true);
    const token = localStorage.getItem("SGI_TOKEN");

    try {
        const response = await fetch(URL, {
            method: 'DELETE',
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
            setError(result.message || 'Failed to reject review');
            setLoading(false);
            return false;
        }
    } catch (error) {
        setError('An error occurred while rejecting review');
        setLoading(false);
        return false;
    }
}

export default RejectReview;
