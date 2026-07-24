import {
  registerUserService,
  loginUserService,
  getUserProfileService,
} from "../services/user.service.js";
import { sendTokenCookie } from "../services/auth.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const register = catchAsync(async (req, res, next) => {
  const user = await registerUserService(req.body, req.file);
  sendTokenCookie(user, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await loginUserService(email, password);
  sendTokenCookie(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ status: "success", message: "Sesión cerrada exitosamente" });
};

export const getProfile = catchAsync(async (req, res, next) => {
  const user = await getUserProfileService(req.user.id);
  res.status(200).json({
    status: "success",
    data: { user },
  });
});
