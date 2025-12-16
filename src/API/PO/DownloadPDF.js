const DownloadPDF = async (setError, setLoading, poId) => {
    const URL = `https://sgi-dy1p.onrender.com/api/files/${poId}`;
    setLoading(true)
    const token = localStorage.getItem("SGI_TOKEN")
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                "x-is-dashboard": true,
                "authorization": `sgiQ${token}`
            },
        });

        if (response.ok) {
            // Check if response is a PDF file (binary) or JSON
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/pdf")) {
                // Handle PDF file as blob
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                setLoading(false);
                return blobUrl;
            } else if (contentType && contentType.includes("application/json")) {
                // Handle JSON response (if API returns JSON with file URL)
                const result = await response.json();
                setLoading(false);
                return result.file || result.url || result;
            } else {
                // Try to get as blob by default
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                setLoading(false);
                return blobUrl;
            }
        } else {
            // Try to get error message from response
            let errorMessage = "Failed to download file";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If response is not JSON, use status text
                errorMessage = response.statusText || errorMessage;
            }

            if (response.status == 400) {
                setError(errorMessage);
                setLoading(false);
                console.log(errorMessage);
            } else if (response.status == 403) {
                setError(errorMessage);
                setLoading(false);
            } else {
                setError(errorMessage);
                setLoading(false);
            }
        }
    } catch (error) {
        setError(error.message || "An error occurred while downloading the file");
        setLoading(false);
    }
}
export default DownloadPDF;

