const URL = "https://sgi-dy1p.onrender.com/api/v1/coupon/disable/";
const UpdateCouponStatus = async (setError, setCouponToggleLoading, getAllCoupons, id) => {
    setCouponToggleLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setCouponToggleLoading(false)
            getAllCoupons()
        } else {
            if (response.status == 400) {
                setError(result.message);
                setCouponToggleLoading(false)

            } else if (response.status == 403) {
                setError(result.message);
                setCouponToggleLoading(false)
            } else {
                setError(result.message);
                setCouponToggleLoading(false)
            }
        }
    } catch (error) {
        setError('An error occurred');
        setCouponToggleLoading(false)
    }
}
export default UpdateCouponStatus;