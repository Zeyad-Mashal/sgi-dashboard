const AllRequest = async (setAllRequests, setError, setLoading, currentFilter) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/user/merchant/get?page=1&type=${currentFilter}`;
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
            console.log(currentFilter);


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
export default AllRequest;