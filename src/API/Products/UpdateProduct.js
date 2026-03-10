/**
 * تحديث المنتج — body = FormData يحتوي كل بيانات المنتج.
 * الصور: يُرسل picUrls (JSON + picUrls[]) للقائمة الكاملة للصور الحالية، و image للملفات الجديدة فقط.
 * الباك إند يجب أن يدمج: product.picUrls = [...قيمة picUrls المرسلة, ...روابط الملفات المرفوعة الجديدة].
 */
const UpdateProduct = async (
    id,
    data,
    setError,
    setLoading,
    setAddProductModel,
    setShowTable,
    onSuccess,
    isFeatured = false
) => {
    setLoading(true);
    const token = localStorage.getItem("SGI_TOKEN");

    try {
        const response = await fetch(
            `https://sgi-dy1p.onrender.com/api/v1/product/update/${id}`,
            {
                method: "PUT",
                headers: {
                    "x-is-dashboard": true,
                    "authorization": `sgiQ${token}`,
                },
                body: data,
            }
        );

        const result = await response.json();

        if (response.ok) {
            setShowTable(true);
            setAddProductModel(false);
            setLoading(false);
            // Call optional success callback
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess();
            }
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

export default UpdateProduct;
