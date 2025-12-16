const RejectMerchant = async (setError, setLoading, id) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/user/merchant/rejected/`;
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(URL + id, {
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
export default RejectMerchant; 