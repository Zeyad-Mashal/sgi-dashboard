const URL = "https://sgi-dy1p.onrender.com/api/v1/dashboard/kpis";
const Kpis = async (setKpis, setError, setLoading, startDate, endDate) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(`${URL}?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setKpis(result)
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
export default Kpis;