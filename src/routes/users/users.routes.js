import { Router } from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../../middleware/tokenValitador";

import {
  register,
  login,
  logout,
} from "../../controllers/Users/users.controller";
const router = Router();

const upload = multer({
  dest: path.join("storage/user"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.post("/register", upload.single("photo"), register); //! Crear cuenta

router.post("/login", login); //! Inniciar sección

router.post("/logout", logout) //! Cerrar sección

export default router;
