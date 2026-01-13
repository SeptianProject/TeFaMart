export async function fileToBase64(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
}