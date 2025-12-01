// Helper to load and add Vietnamese font to jsPDF
export async function addVietnameseFont(doc: any): Promise<void> {
    try {
        // Try multiple font sources for better reliability
        const fontUrls = [
            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
            'https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf',
        ];

        let fontArrayBuffer: ArrayBuffer | null = null;

        // Try each URL until one works
        for (const fontUrl of fontUrls) {
            try {
                const response = await fetch(fontUrl);
                if (response.ok) {
                    fontArrayBuffer = await response.arrayBuffer();
                    console.log(`Font loaded successfully from: ${fontUrl}`);
                    break;
                }
            } catch (err) {
                console.warn(`Failed to load from ${fontUrl}:`, err);
                continue;
            }
        }

        if (!fontArrayBuffer) {
            throw new Error('All font sources failed');
        }

        // Convert ArrayBuffer to base64
        const fontBase64 = arrayBufferToBase64(fontArrayBuffer);

        // Add font to jsPDF
        doc.addFileToVFS('Roboto-Regular.ttf', fontBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto', 'normal');

        console.log('Vietnamese font loaded and set successfully');
    } catch (error) {
        console.error('Failed to load Vietnamese font:', error);
        // Fallback: use Times which has better Unicode support than Helvetica
        doc.setFont('times', 'normal');
        console.log('Using fallback font: Times');
    }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000; // Process in chunks to avoid call stack size exceeded

    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
    }

    return btoa(binary);
}
