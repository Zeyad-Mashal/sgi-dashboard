const DeleteTrader = async (
    id,
    setError,
    setLoading,
    setOpenDeleteModal,
    getAllMerchants
) => {
    setLoading(true);
    const token = localStorage.getItem("SGI_TOKEN");

    try {
        const response = await fetch(
            `https://sgi-dy1p.onrender.com/api/v1/user/merchant/delete/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-is-dashboard": true,
                    authorization: `sgiQ${token}`,
                },
            }
        );

        const result = await response.json();

        if (response.ok) {
            setOpenDeleteModal(false);
            setLoading(false);
            getAllMerchants();
        } else {
            if (response.status == 404) {
                setError(result.message);
                setLoading(false)
                console.log(result.message);
            }
        }
    } catch (error) {
        setError("An error occurred");
        setLoading(false);
    }
};

export default DeleteTrader;
