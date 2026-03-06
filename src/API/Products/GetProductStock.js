const ODOO_API_BASE = import.meta.env.DEV
    ? '/api/odoo'  // في التطوير: يستخدم proxy الـ Vite (يتجنب CORS)
    : 'https://sgicompany.odoo.com/api';

const GetProductStock = async (setProductStock, setError, setLoading) => {
    setLoading(true)
    const URL = `${ODOO_API_BASE}/products`;

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'X-API-KEY': "BF1S2rHF6qv/+9IGg3KXgJ7FCNXjfHcd2Cky7qk+SlUOvLVks6GZxieEdyE="
            },
        });

        const result = await response.json();

        if (response.ok) {
            setProductStock(result.products)
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
export default GetProductStock;