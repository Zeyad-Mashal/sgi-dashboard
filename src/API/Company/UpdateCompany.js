const URL = "https://sgi-dy1p.onrender.com/api/v1/company/update/";
const UpdateCompany = async (data, setError, setLoading, setOpenEditModal, getAllCompanies, companyId) => {
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(`${URL}${companyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            setOpenEditModal(false);
            setLoading(false)
            getAllCompanies()
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
export default UpdateCompany;