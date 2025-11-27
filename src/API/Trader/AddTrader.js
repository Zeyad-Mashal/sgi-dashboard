const URL = "https://sgi-dy1p.onrender.com/api/v1/user/merchant/add";
const AddTrader = async (data, setError, setLoading, setOpenTraderModal, getAllMerchants) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(URL, {
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
            setOpenTraderModal(false);
            setLoading(false)
            getAllMerchants()
        } else {
            if (response.status == 404) {
                setError(result.message);
                setLoading(false)
                console.log(result.message);
            } else if (response.status == 500) {
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
export default AddTrader;