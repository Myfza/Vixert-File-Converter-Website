/**
 * Download utility functions for file downloads
 */

/**
 * Downloads a file from the given URL
 * @param url - The URL of the file to download
 * @param filename - The name to save the file as
 */
export const downloadFile = async (url: string, filename: string): Promise<void> => {
  try {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✅ Download initiated: ${filename}`);
  } catch (error) {
    console.error('❌ Download failed:', error);
    throw new Error(`Failed to download ${filename}`);
  }
};

/**
 * Downloads the file organizer script
 */
export const downloadFileOrganizer = async (): Promise<void> => {
  const filename = 'file-organizer-v1.0.0.zip';
  const url = `/zip/${filename}`;
  
  try {
    // Check if file exists by making a HEAD request
    const response = await fetch(url, { method: 'HEAD' });
    
    if (!response.ok) {
      throw new Error(`File not found: ${filename}`);
    }
    
    // Proceed with download
    await downloadFile(url, filename);
  } catch (error) {
    console.error('❌ File organizer download failed:', error);
    
    // Show user-friendly error message
    alert('Sorry, the download file is currently unavailable. Please try again later or contact support.');
    
    throw error;
  }
};

/**
 * Handles download with loading state
 * @param setLoading - Function to set loading state
 */
export const handleDownloadWithLoading = async (
  setLoading: (loading: boolean) => void
): Promise<void> => {
  try {
    setLoading(true);
    await downloadFileOrganizer();
  } catch (error) {
    // Error is already handled in downloadFileOrganizer
    console.error('Download process failed:', error);
  } finally {
    setLoading(false);
  }
};