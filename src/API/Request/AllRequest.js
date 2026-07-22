const AllRequest = async (setAllRequests, setError, setLoading) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/user/merchant/get?page=1&type=all`;
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
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
            setAllRequests(Array.isArray(result.merchants) ? result.merchants : [])
            setLoading(false)
        } else {
            setAllRequests([])
            setError(result.message);
            setLoading(false)
            console.log(result.message);
        }
    } catch (error) {
        setAllRequests([])
        setError('An error occurred');
        setLoading(false)
    }
}
export default AllRequest;
