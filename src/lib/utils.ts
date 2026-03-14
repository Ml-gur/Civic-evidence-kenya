import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Network quality helpers
// ---------------------------------------------------------------------------
export function getEffectiveNetworkType(): '4g' | '3g' | '2g' | 'slow-2g' | 'unknown' {
  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  return conn?.effectiveType ?? 'unknown';
}

export function isLowBandwidth(): boolean {
  const type = getEffectiveNetworkType();
  return type === '2g' || type === 'slow-2g';
}

// ---------------------------------------------------------------------------
// Resumable / chunked upload to Cloudinary
// ---------------------------------------------------------------------------
const CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

export interface UploadResult {
  media_url: string;
  thumbnail_url: string;
  duration?: number;
}

export async function uploadToCloudinary(
  file: Blob,
  type: 'image' | 'video',
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary config missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file to enable evidence uploads.');
  }

  // Size validation
  if (type === 'image' && file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 10MB.`);
  }
  if (type === 'video' && file.size > MAX_VIDEO_SIZE) {
    throw new Error(`Video too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 50MB.`);
  }

  // Helper to generate versioned transformation URLs
  const getTransformUrl = (url: string, transform: string) => {
    return url.replace('/upload/', `/upload/${transform}/`);
  };

  // For images or small blobs (<= 4 MB) use single-shot for speed
  if (type === 'image' || file.size <= 4 * 1024 * 1024) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    // Add transformations for images to optimize storage
    if (type === 'image') {
      formData.append('transformation', 'c_limit,w_1280,h_1280,q_auto,f_auto');
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    onProgress?.(100);

    return {
      media_url: data.secure_url,
      thumbnail_url: type === 'image' 
        ? getTransformUrl(data.secure_url, 'c_fill,g_auto,h_300,w_300,q_auto,f_auto')
        : getTransformUrl(data.secure_url, 'so_1,c_fill,g_auto,h_300,w_300,q_auto,f_jpg'),
      duration: data.duration
    };
  }

  // --- Chunked upload for videos ---
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const uniqueUploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let finalData: any = null;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: 'POST',
      headers: {
        'X-Unique-Upload-Id': uniqueUploadId,
        'Content-Range': `bytes ${start}-${end - 1}/${file.size}`,
      },
      body: formData,
    });

    if (!res.ok && res.status !== 308) {
      const errData = await res.json();
      throw new Error(errData?.error?.message || `Chunk upload failed at byte ${start}`);
    }

    const pct = Math.round(((i + 1) / totalChunks) * 100);
    onProgress?.(pct);

    if (res.status !== 308) {
      finalData = await res.json();
    }
  }

  if (!finalData) throw new Error('Upload failed: No response from server.');

  return {
    media_url: finalData.secure_url,
    thumbnail_url: getTransformUrl(finalData.secure_url, 'so_1,c_fill,g_auto,h_300,w_300,q_auto,f_jpg'),
    duration: finalData.duration
  };
}

// ---------------------------------------------------------------------------
// Reverse geocode (Nominatim / OpenStreetMap) — with retry + timeout for flaky networks
// ---------------------------------------------------------------------------
export async function getReverseGeocode(lat: number, lon: number) {
  const MAX_RETRIES = 2;
  const TIMEOUT_MS = 5000;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'en' },
          signal: controller.signal,
        }
      );
      clearTimeout(timer);

      const data = await response.json();
      if (data?.address) return data.address;
    } catch (error: any) {
      if (attempt === MAX_RETRIES) {
        console.error('Geocoding failed after retries:', error?.message || error);
        return null;
      }
      // Wait briefly before retrying
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Haversine distance (km) between two GPS coords
// ---------------------------------------------------------------------------
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
