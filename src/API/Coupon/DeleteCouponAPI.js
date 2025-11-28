const URL = "https://sgi-dy1p.onrender.com/api/v1/coupon/delete/";
const DeleteCouponAPI = async (setError,
    setLoading,
    setOpenDeleteModal,
    getAllCoupons, id) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setOpenDeleteModal(false);
            setLoading(false)
            getAllCoupons()
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
export default DeleteCouponAPI;