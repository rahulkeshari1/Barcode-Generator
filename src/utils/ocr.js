
import Tesseract from "tesseract.js";

export const readImageText = async (file) => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Convert to image URL for Tesseract
    const imageUrl = URL.createObjectURL(file);
    
    const result = await Tesseract.recognize(imageUrl, "eng", {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });

    // Clean up
    URL.revokeObjectURL(imageUrl);

    const text = result.data.text;
    
    // If no text found, try with different language
    if (!text.trim()) {
      const result2 = await Tesseract.recognize(imageUrl, "eng+hin", {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress (multi-lang): ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      URL.revokeObjectURL(imageUrl);
      return result2.data.text;
    }

    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to read text from image. Please try again.");
  }
};