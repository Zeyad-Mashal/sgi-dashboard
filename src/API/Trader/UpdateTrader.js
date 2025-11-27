const UpdateTrader = async (
    id,
    data,
    setError,
    setLoading,
    setOpenEditModal,
    getAllMerchants
) => {
    setLoading(true);
    const token = localStorage.getItem("SGI_TOKEN");

    try {
        const response = await fetch(
            `https://sgi-dy1p.onrender.com/api/v1/user/merchant/update/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-is-dashboard": true,
                    "authorization": `sgiQ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (response.ok) {
            setOpenEditModal(false);
            setLoading(false);
            getAllMerchants();
        } else {
            setError(result.message);
            setLoading(false);
            console.log(result.message);
        }
    } catch (error) {
        setError("An error occurred");
        setLoading(false);
    }
};

export default UpdateTrader;
