import axios from "axios";

interface UploadFileResponse {
    fileName: string;
    uploadedAt: string;
}

interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

const fileApi = {
    // Upload multiple files
    uploadFiles: async (
        files: File[],
        folder: string = "books"
    ): Promise<ApiResponse<UploadFileResponse[]>> => {
        const formData = new FormData();

        // Append all files
        files.forEach((file) => {
            formData.append("files", file);
        });

        // Append folder parameter
        formData.append("folder", folder);

        const token = localStorage.getItem("token");

        console.log("=== UPLOAD FILES DEBUG ===");
        console.log("Files count:", files.length);
        console.log("Folder:", folder);
        console.log("Token:", token ? "exists" : "none");
        console.log("URL:", "http://localhost:8080/api/files");

        try {
            const response = await axios.post<
                ApiResponse<UploadFileResponse[]>
            >("http://localhost:8080/api/files", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            console.log("=== UPLOAD SUCCESS ===");
            console.log("Response:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("=== UPLOAD ERROR ===");
            console.error("Error:", error);
            console.error("Response:", error.response?.data);
            console.error("Status:", error.response?.status);
            throw error;
        }
    },
};

export default fileApi;
