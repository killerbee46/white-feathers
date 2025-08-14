import Upload from "../models/Upload.js";

export const uploadedFile = async (req, res) => {
  try {
    const users = await Upload.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const uploadFile = async (req, res,) => {
  const image = req.file.filename;
 return res.status(201).json({
          message:"Image uploaded successfully!",
          url:image
         })
}

export const uploadMultiFile = async (req, res,) => {
  // const images = req.file.filename;
 return res.status(201).json({
          message:"Image uploaded successfully!",
          images:"got images"
         })
}