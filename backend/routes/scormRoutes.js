import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer (file upload)
// We'll save to 'backend/uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure it exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// --- SCORM Upload Route ---
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path; // Path to the uploaded zip in 'uploads/'
    const folderId = Date.now().toString();
    const extractDir = path.join(__dirname, '..', 'public', 'scorm_packages', folderId);

    // Create folder
    fs.mkdirSync(extractDir, { recursive: true });

    // Extract ZIP
    const zip = new AdmZip(filePath);
    zip.extractAllTo(extractDir, true);

    // Clean up uploaded zip from 'uploads/'
    fs.unlinkSync(filePath);

    // Assume main file is "index.html"
    const launchUrl = `/scorm_packages/${folderId}/index.html`;

    return res.status(200).json({
      message: 'SCORM uploaded successfully',
      launchUrl: launchUrl,
      folderId: folderId // Send this to the frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;