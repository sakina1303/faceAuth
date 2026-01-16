import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

// Improved face matching: compare pixels (MSE)
export async function compareFaces(uri1, uri2) {
  console.log('Starting compareFaces with pixel comparison...');
  try {
    // 1. Resize to small size (32x32) for performance and alignment tolerance
    // 32x32 is sufficient for general structure matching
    const size = 32;

    const manip1 = await ImageManipulator.manipulateAsync(uri1, [{ resize: { width: size, height: size } }], { base64: true });
    const manip2 = await ImageManipulator.manipulateAsync(uri2, [{ resize: { width: size, height: size } }], { base64: true });

    // 2. Decode JPEGs to get raw pixel data
    const buffer1 = Buffer.from(manip1.base64, 'base64');
    const buffer2 = Buffer.from(manip2.base64, 'base64');

    const data1 = jpeg.decode(buffer1, { useTArray: true });
    const data2 = jpeg.decode(buffer2, { useTArray: true });

    if (data1.width !== data2.width || data1.height !== data2.height) {
      console.warn('Image dimensions mismatch');
      return false;
    }

    // 3. Calculate Mean Squared Error (MSE)
    let mse = 0;
    const pixels = data1.width * data1.height;
    // data.data is RGBA (4 bytes per pixel)
    const len = pixels * 4;

    for (let i = 0; i < len; i++) {
      // Skip Alpha channel (every 4th byte) if we want, but usually it's 255
      if ((i + 1) % 4 === 0) continue;

      const diff = data1.data[i] - data2.data[i];
      mse += diff * diff;
    }

    // Average per color channel (R,G,B) = 3 channels
    mse = mse / (pixels * 3);

    console.log('MSE:', mse);

    // Threshold: Lower MSE means more similar.
    // 0 = identical. 
    // Typical values for same face often < 500-1000 depending on lighting.
    // Different faces often > 2000-3000.
    // Let's pick a conservative threshold first.
    const threshold = 1500;

    return mse < threshold;

  } catch (e) {
    console.error('Error in compareFaces:', e);
    return false;
  }
}

export async function saveEnrolledImage(uri) {
  console.log('Saving enrolled image from:', uri);
  try {
    const dest = FileSystem.documentDirectory + 'enrolled_face.jpg';
    await FileSystem.copyAsync({ from: uri, to: dest });
    console.log('Image saved to:', dest);
    return dest;
  } catch (e) {
    console.error('Error saving enrolled image:', e);
    throw e;
  }
}

export async function getEnrolledImageUri() {
  try {
    const dest = FileSystem.documentDirectory + 'enrolled_face.jpg';
    const info = await FileSystem.getInfoAsync(dest);
    console.log('Getting enrolled image info:', info);
    return info.exists ? dest : null;
  } catch (e) {
    console.error('Error getting enrolled image:', e);
    return null;
  }
}
