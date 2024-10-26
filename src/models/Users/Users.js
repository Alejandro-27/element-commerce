import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userShema = new Schema(
  {
    token_temp: { type: String, default: "" }, 
    name: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String },
    photo: { type: Array },
    login_code: { type: String, default: "" },
    login_code_confirmed: { type: String, default: "" }, 
    codeNewPassMail: { type: String, default: "" },
    codeNewPassConfirm: { type: String, default: "" },
    phone: [
      {
        nationalidad: { type: String, default: "" },
        dateNumber: { type: String, default: "" },
      },
    ],
    identification: [
      {
        typeIdent: { type: String, default: "" },
        nationalidad: { type: String, default: "" },
        dateNumber: { type: String, default: "" },
      },
    ],
    //admin: { type: String, default: "usuario" },
    role: { type: String, enum: ["usuario", "admin"], default: "usuario" },
  },
  { timestamps: true }
);

userShema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userShema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

const Users = mongoose.model("Users", userShema);
export default Users;
