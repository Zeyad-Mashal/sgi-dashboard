const URL = "https://sgi-dy1p.onrender.com/api/v1/product/get?page=1";
const GetProducts = async (setAllProducts, setError, setLoading) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`,
                // 'accept-language': "en"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setAllProducts(result.products)
            setLoading(false)

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
export default GetProducts;