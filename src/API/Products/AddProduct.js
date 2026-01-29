const AddProduct = async (data, setError, setLoading, setShowTable, setAddProductModel) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    const URL = "https://sgi-dy1p.onrender.com/api/v1/product/add";
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            setShowTable(true);
            setAddProductModel(false);
            setLoading(false)
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
export default AddProduct;