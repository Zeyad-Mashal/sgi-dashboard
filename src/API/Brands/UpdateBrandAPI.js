const URL = "https://sgi-dy1p.onrender.com/api/v1/brand/update/";

const UpdateBrandAPI = async (
    brandId,
    formData,
    setLoading,
    setError,
    onSuccess
) => {
    setLoading(true);
    try {
        const token = localStorage.getItem("SGI_TOKEN");

        const response = await fetch(URL + brandId, {
            method: "PUT",
            headers: {
                authorization: `sgiQ${token}`,
                "x-is-dashboard": true,
            },
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            onSuccess();
        } else {
            setError(result.message);
        }
    } catch (error) {
        setError("Error updating brand");
    } finally {
        setLoading(false);
    }
};

export default UpdateBrandAPI;
