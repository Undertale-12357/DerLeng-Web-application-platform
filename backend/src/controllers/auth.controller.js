
import authService from "../services/auth.service.js";


export const login = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const sendVerificationCode = async (req, res) => {
  try {
    await authService.sendCode(req.body.email);
    res.status(200).json({ message: "Verification code sent to email" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyCodeAndRegister = async (req, res) => {
  try {
    const user = await authService.verifyCodeAndRegister(req.body);
    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
