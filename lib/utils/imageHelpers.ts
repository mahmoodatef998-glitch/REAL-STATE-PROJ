/**
 * Helper function to check if image should use unoptimized
 * @param {string} imageUrl - The image URL
 * @returns {boolean} - Whether to use unoptimized
 */
export function shouldUnoptimizeImage(imageUrl: string | undefined | null): boolean {
    if (!imageUrl) return false;

    return (
        imageUrl.startsWith('http://localhost') ||
        imageUrl.startsWith('http://127.0.0.1') ||
        imageUrl.startsWith('https://picsum.photos')
    );
}
