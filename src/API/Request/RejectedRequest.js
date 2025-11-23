const RejectedRequest = async (setAllRequests, setError, setLoading) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/user/merchant/get?page=1&type=rejected`;
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
            setAllRequests(result.merchants)
            setLoading(false)
        } else {
            if (response.status == 401) {
                setError(result.message);
                setLoading(false)
                console.log(result.message);

            } else if (response.status == 400) {
                setError(result.message);
                setLoading(false)
                console.log(result.message);

            } else {
                setError(result.message);
                setLoading(false)
            }
        }
    } catch (error) {
        setError('An error occurred');
        setLoading(false)
    }
}
export default RejectedRequest;