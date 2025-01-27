// Function to encode ID to a string
export const encodeId = (id: number): string => {
    // Convert ID to base36 and add some random chars
    const encoded = id.toString(36);
    const randomChars = Math.random().toString(36).substring(2, 6);
    const timestamp = Date.now().toString(36).substring(-4);
    return `${randomChars}${encoded}${timestamp}`.toUpperCase();
};

// Function to decode string back to ID
export const decodeId = (encoded: string): number => {
    // Extract the actual ID part (remove random chars and timestamp)
    const cleanEncoded = encoded.toLowerCase().slice(4, -4);
    return parseInt(cleanEncoded, 36);
};