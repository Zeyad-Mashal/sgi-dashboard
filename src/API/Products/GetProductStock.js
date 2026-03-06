// في التطوير: Vite proxy. في الإنتاج (Vercel): serverless function في api/odoo/products.js
const ODOO_API_BASE = '/api/odoo';

const GetProductStock = async (setProductStock, setError, setLoading) => {
    setLoading(true)
    const URL = `${ODOO_API_BASE}/products`;

    const headers = {};
    // في التطوير فقط: أرسل المفتاح (الـ proxy لا يضيفه). في الإنتاج الـ Vercel function يضيفه من env
    if (import.meta.env.DEV) {
        headers['X-API-KEY'] = import.meta.env.VITE_ODOO_API_KEY || "BF1S2rHF6qv/+9IGg3KXgJ7FCNXjfHcd2Cky7qk+SlUOvLVks6GZxieEdyE=";
    }

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers,
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