import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage, ref as storageRef } from 'firebase/storage';
import { getStorageInstance } from './firebase';

// Voice file upload with custom metadata
export const uploadVoiceFile = async (
  blob: Blob, 
  ticketNumber: string, 
  sender: 'client' | 'admin' = 'client'
): Promise<{ storagePath: string; downloadUrl: string }> => {
  try {
    console.log('=== STORAGE: Starting upload ===');
    console.log('Blob details:', {
      size: blob.size,
      type: blob.type
    });
    console.log('Upload parameters:', {
      ticketNumber,
      sender
    });
    
    const storage = getStorageInstance();
    console.log('✓ Storage instance obtained');
    
    const timestamp = Date.now();
    const filename = `${timestamp}.webm`;
    const storagePath = `tickets/${ticketNumber}/${filename}`;
    console.log('Storage path:', storagePath);
    
    const storageRef = ref(storage, storagePath);
    console.log('✓ Storage reference created');
    
    // Upload the blob with custom metadata
    console.log('Starting upload to Firebase Storage...');
    const uploadResult = await uploadBytes(storageRef, blob, {
      customMetadata: {
        sender: sender,
        ticket_number: ticketNumber.toString(),
        timestamp: new Date().toISOString()
      }
    });
    
    console.log('✓ Upload to storage completed');
    console.log('Upload result:', {
      totalBytes: uploadResult.metadata.size,
      contentType: uploadResult.metadata.contentType,
      timeCreated: uploadResult.metadata.timeCreated
    });
    
    // Get the download URL
    console.log('Getting download URL...');
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    console.log('✓ Download URL obtained');
    
    const result = {
      storagePath,
      downloadUrl
    };
    
    console.log('=== STORAGE: Upload successful ===');
    console.log('Final result:', result);
    return result;
  } catch (error) {
    console.error('=== STORAGE: Upload failed ===');
    console.error('Error object:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Provide more specific error messages
      if (error.message.includes('unauthorized') || error.message.includes('permission')) {
        throw new Error('Storage permission denied - check Firebase rules');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error during storage upload');
      } else if (error.message.includes('quota')) {
        throw new Error('Storage quota exceeded');
      } else if (error.message.includes('invalid')) {
        throw new Error('Invalid file or storage path');
      }
    }
    
    console.error('Original error:', error);
    throw new Error(`Storage upload failed: ${error}`);
  }
};

// Voice file download with CORS workaround
export const downloadVoiceFile = async (storagePath: string): Promise<string> => {
  try {
    console.log('Storage: Downloading voice file from path:', storagePath);
    
    const storage = getStorageInstance();
    const fileRef = ref(storage, storagePath);
    
    console.log('Storage: Getting download URL...');
    const downloadURL = await getDownloadURL(fileRef);
    
    console.log('Storage: Download URL obtained:', downloadURL);
    
    // Create a blob URL to avoid CORS issues
    try {
      console.log('Storage: Fetching file to create blob URL...');
      const response = await fetch(downloadURL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      console.log('Storage: Blob URL created successfully:', blobUrl);
      return blobUrl;
      
    } catch (fetchError) {
      console.warn('Storage: Failed to create blob URL, falling back to direct URL:', fetchError);
      // Return the direct URL without corrupting it with invalid tokens
      return downloadURL;
    }
  } catch (error) {
    console.error('Storage: Error downloading voice file:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('object does not exist')) {
        throw new Error('Audio file not found');
      } else if (error.message.includes('unauthorized')) {
        throw new Error('Not authorized to access audio file');
      }
    }
    
    throw new Error(`Failed to download voice file: ${error}`);
  }
};

// Delete voice file from storage
export const deleteVoiceFile = async (storagePath: string): Promise<void> => {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, storagePath);
    
    await deleteObject(storageRef);
    console.log('Voice file deleted successfully:', storagePath);
  } catch (error) {
    console.error('Error deleting voice file:', error);
    throw error;
  }
};

// Get voice file metadata
export const getVoiceFileMetadata = async (storagePath: string) => {
  try {
    const storage = getStorageInstance();
    const storageRef = ref(storage, storagePath);
    
    // Get metadata using getMetadata
    const { getMetadata } = await import('firebase/storage');
    const metadata = await getMetadata(storageRef);
    
    return {
      name: metadata.name,
      size: metadata.size,
      timeCreated: metadata.timeCreated,
      customMetadata: metadata.customMetadata
    };
  } catch (error) {
    console.error('Error getting voice file metadata:', error);
    throw error;
  }
};