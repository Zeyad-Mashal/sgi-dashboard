const GetProducts = async (setAllProducts, setError, setLoading, page = 1, setPaginationInfo = null) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    const URL = `https://sgi-dy1p.onrender.com/api/v1/product/get?page=${page}`;

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
            // Set pagination info if available and callback provided
            if (setPaginationInfo && result) {
                setPaginationInfo({
                    currentPage: result.currentPage || page,
                    totalPages: result.totalPages || null,
                    totalProducts: result.totalProducts || result.total || null,
                    hasNextPage: result.hasNextPage !== undefined ? result.hasNextPage : (result.products && result.products.length > 0),
                    hasPrevPage: result.hasPrevPage !== undefined ? result.hasPrevPage : (page > 1)
                })
            }
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