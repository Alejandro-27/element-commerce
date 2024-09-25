import bcrypt from "bcrypt";
const randomstring = require("randomstring");

export const generateRandomPassword = async () => {
  try {
    const randomPassword = randomstring.generate({
      length: 10,
      charset: "alphanumeric",
    });

    // Encripta la contraseña aleatoria
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    return {
      password: randomPassword,
      hashedPassword: hashedPassword,
    };
  } catch (error) {
    throw error;
  }
};
