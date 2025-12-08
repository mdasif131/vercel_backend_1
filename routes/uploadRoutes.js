import express from "express";
import multer from "multer";
import path from "path";
import fs from 'fs'; 
const router = express.Router();

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);

    // Create a readable timestamp
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const readableTimestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    cb(null, `${file.fieldname}-${readableTimestamp}${extname}`);
  },
})

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/; 
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype; 
  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Images only!'), false)
}
}
const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');
router.post('/', (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
      // console.log(err);
    } else if (req.file) {
      res.status(200).send({
        message: 'Image uploaded successfully',
        image: `/${req.file.path }`
      })
    } else {
      res.status(400).send({ message: 'No image file uploaded' });
    }
  });
});


export default router;