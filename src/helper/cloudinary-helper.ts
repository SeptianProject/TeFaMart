export const getPublicIdFromUrl = (url: string) => {
    try {
        const parts = url.split("/");
        const fileWithExtension = parts.pop();
        const folder = parts.pop();
        if(!fileWithExtension || !folder) return null;

        const publicId = fileWithExtension.split(".")[0];
        return `${folder}/${publicId}`;
    } catch (error) {
        console.error("Error extracting public ID Cloudinary: ", error);
        return null;
    }
}