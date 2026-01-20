import userService from "../services/user.service.js";

export const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
