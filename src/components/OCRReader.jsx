import Tesseract from "tesseract.js";

export const readImageText =
  async (file) => {
    const result =
      await Tesseract.recognize(
        file,
        "eng"
      );

    return result.data.text;
  };