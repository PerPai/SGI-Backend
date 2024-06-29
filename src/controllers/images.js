// uploadController.js
import multer from 'multer';
import path from 'path';

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Asignar un nombre único al archivo
  },
});

const upload = multer({ storage: storage });

export const uploadImages = (req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error al subir imágenes', error: err });
    }

    res.status(200).json({
      message: 'Imágenes subidas exitosamente',
      files: req.files,
    });
  });
};
