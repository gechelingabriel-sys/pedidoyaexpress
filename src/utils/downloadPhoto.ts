/**
 * Helper to download Chinita's photo directly in full resolution
 */

export async function downloadChinitaPhoto(
  url: string = '/assets/chinita.jpg',
  filename: string = 'foto-chinita-pedidosya-cordoba.jpg'
) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 200);
  } catch (err) {
    console.error('Error downloading photo directly, fallback anchor:', err);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
