const URL = "https://sgi-dy1p.onrender.com/api/v1/category/add/";
const AddCategory = async (data, setError, setLoading, setOpenAddModalOrCallback, getAllCategories, company) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(`${URL}${company}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Handle callback if it's a function, otherwise use as state setter
            if (typeof setOpenAddModalOrCallback === 'function') {
                setOpenAddModalOrCallback();
            } else {
                setOpenAddModalOrCallback(false);
            }
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
export default AddCategory;