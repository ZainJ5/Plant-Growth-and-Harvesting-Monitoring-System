import express from "express";
import multer from "multer";
import { convertBufferToBase64, identifyPlantHealth } from "../services/plantApiService.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/plant/check", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const buffer = req.file.buffer;

    // 3. Pass the buffer to your service
    const base64 = convertBufferToBase64(buffer);
    const result = await identifyPlantHealth(base64);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;