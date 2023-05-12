const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin"],
      message: "Please select correct role",
    },
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dj7k0lade/image/upload/v1623344783/avatars/avatar_qkxq8c.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // posts: [{
  //     _id: { type: String, require: true },
  //     title: { type: String, require: true },
  //     description: { type: String, require: true },
  //     createdAt: { type: Date, default: Date.now },
  //     createdby: {type: String, require: true}
  // }],
});

//
// userSchema.pre('save', async function (next) {
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt)
//     next();
// })

module.exports = mongoose.model("User", userSchema);
