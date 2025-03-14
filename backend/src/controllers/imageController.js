import { uploadSingleImage } from "../services/imageService.js";

export const uploadImage = (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    
    res.status(200).json({ 
      success: true,
      message: "이미지 업로드 성공", 
      imageUrl 
    });
  });
};