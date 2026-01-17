const URL = "https://sgi-dy1p.onrender.com/api/v1/brand/add/";
const AddBrand = async (formData, setError, setLoading, setOpenBrandModalOrCallback, getAllBrands, companyId) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(`${URL}${companyId}`, {
            method: 'POST',
            headers: {
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            // Handle callback if it's a function, otherwise use as state setter
            if (typeof setOpenBrandModalOrCallback === 'function') {
                setOpenBrandModalOrCallback();
            } else {
                setOpenBrandModalOrCallback(false);
            }
            setLoading(false)
            getAllBrands()
        } else {
            if (response.status == 400) {
                setError(result.message);
                setLoading(false)
                console.log(result.message);
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
export default AddBrand;