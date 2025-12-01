const updateOrderStatus = async (setError, setLoading, setShowStatusModal, getAllOrders, orderId, orderStatus) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/order/status?orderId=${orderId}&status=${orderStatus}`;
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
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
            setShowStatusModal(false);
            setLoading(false)
            getAllOrders()
        } else {
            if (response.status == 400) {
                setError(result.message);
                setLoading(false)

            } else if (response.status == 403) {
                setError(result.message);
                setLoading(false)
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
export default updateOrderStatus;