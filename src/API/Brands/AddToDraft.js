const URL = "https://sgi-dy1p.onrender.com/api/v1/brand/draft/";
const AddToDraft = async (setError, setLoading, setOpenAddToDraftModal, getAllBrands, draftBrandId) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(`${URL}${draftBrandId}`, {
            method: 'PUT',
            headers: {
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setOpenAddToDraftModal(false);
            setLoading(false)
            getAllBrands()
        } else {
            if (response.status == 400) {
                setError(result.message);
                setLoading(false)

            } else if (response.status == 404) {
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
export default AddToDraft; 