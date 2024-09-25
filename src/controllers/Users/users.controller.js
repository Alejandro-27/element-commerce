import Users from "../../models/Users/Users";
import jwt from "jsonwebtoken";
import config from "../../config";
import { generateImages } from "../../middleware/libs/process";
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { photo, deleteFiles } = await generateImages(
      req.files,
      "photo"
    );
    deleteImages(deleteFiles);

    if (!name || !email || !password) {
      return res
        .status(404)
        .json({ message: "Complete los datos", status: false });
    }

    var usuario = await Users.findOne({ email });
    if (usuario) {
      return res.status(200).json({
        message: "Ese correo ya se encuentra registrado",
        status: false,
      });
    }

    const passwordd = await Users.encryptPassword(passwordd);
    const newUser = Users({
      name,
      email,
      password: passwordd, //passwordd es la contraseña encriptada
      photo,
    });

    const user = await newUser.save();

    res.status(200).json({ message: "Cuenta creada", status: true, user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error interno en el servidor", status: false });
  }
};
