const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(200)
        .json({ status: 0, msg: "user with same credentials already exist!!" });
    } else {
      const userFields = {
        name,
        email,password
      };
      const salt = await bcrypt.genSalt(10);
      userFields.password = await bcrypt.hash(password, salt);
      await new User(userFields).save();
      return res
        .status(200)
        .json({ status: 1, msg: "user registered successfully!!" });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
