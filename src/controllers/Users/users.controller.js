import Users from "../../models/Users/Users";
import jwt from "jsonwebtoken";
import config from "../../config";
import { uploadFile } from "../../middleware/tools/firebase";
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file; // Archivo recibido

    if (!name || !email || !password) {
      return res
        .status(404)
        .json({ message: "Complete los datos", status: false });
    }

    // Verifica si el usuario ya existe
    const usuario = await Users.findOne({ email });
    if (usuario) {
      return res.status(200).json({
        message: "Ese correo ya se encuentra registrado",
        status: false,
      });
    }

    // Sube la imagen a Firebase Storage
    let photoUrl = "";
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`; // Define un nombre único para el archivo
      photoUrl = await uploadFile(file.buffer, fileName); // Sube el archivo y recibe la URL
    }

    // Encripta la contraseña
    const encryptedPassword = await Users.encryptPassword(password);

    // Crea un nuevo usuario
    const newUser = new Users({
      name,
      email,
      password: encryptedPassword, // Usa la contraseña encriptada
      photo: photoUrl, // Guarda la URL de la foto subida
    });

    const user = await newUser.save();
    return res
      .status(200)
      .json({ message: "Cuenta creada", status: true, user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor", status: false });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(403)
        .json({ message: "Falta el correo o la ocntraseña", status: false });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(203)
        .json({ message: "Coorreo inexistente", status: false });
    }

    const verifiquePass = await Users.comparePassword(password, user.password);
    if (!verifiquePass) {
      return res
        .status(404)
        .json({ message: "Contraseña incorrecta", status: false });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
      config.SECRET,
      {
        expiresIn: "365d",
      }
    );

    const newUser = {
      id: user.id,
      token_temp: token,
    };

    await Users.updateOne({ _id: user.id }, newUser);

    res.status(200).json({
      message: "Bienvenido",
      status: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor", status: false });
  }
};

