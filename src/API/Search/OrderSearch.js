const OrderSearch = async (setAllOrders, setError, setLoading, query) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/order/get?q=${query}`;
    setLoading(true)
    // const token = localStorage.getItem("SGI_TOKEN")

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                // "authorization": `sgiQ${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setAllOrders(Array.isArray(result.orders) ? result.orders : [])
            setLoading(false)
        } else {
            setAllOrders([])
            setError(result.message);
            setLoading(false)
            console.log(result.message);
        }
    } catch (error) {
        setAllOrders([])
        setError('An error occurred');
        setLoading(false)
    }
}
export default OrderSearch;