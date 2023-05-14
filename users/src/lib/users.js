const bcrypt = require("bcryptjs");

const User = require("../model/User");
const AppError = require("../middlewares/error");

const lib = {
  async registerUser(params) {
    // validate user input
    const { error } = validateUser(params);

    if (error) {
      throw new AppError(400, error.details[0].message);
    }

    const { name, email, password, role } = params;

    if (emailExist) {
      throw new AppError(400, "Email already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = createToken({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    return token;
  },
};

module.exports = lib;
