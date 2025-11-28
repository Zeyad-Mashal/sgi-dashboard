const AddSubCategoryApi = async (data, setError, setLoading, setOpenSubModal, getAllCategories, selectedCompanyId, selectedCategoryId) => {
    const URL = `https://sgi-dy1p.onrender.com/api/v1/category/sub/add/${selectedCompanyId}/${selectedCategoryId}`;
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                "authorization": `sgiQ${token} `
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            setOpenSubModal(false);
            setLoading(false)
            getAllCategories()
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
export default AddSubCategoryApi;