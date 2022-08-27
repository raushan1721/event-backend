const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
var jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: String(email) });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        jwt.sign(
          {
            user: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "240h" },
          (err, token) => {
      
            if (err) throw err;
            if (token) {
              return res
                .status(200)
              .json({
                status: 1,
                msg: "logged In",
                token:token,
                data: {user: user._id,email:user.email,image:user.image,name:user.name },
              });    
            }
          }
        );

      } else {
        return res.status(200).json({
          status: 0,
          msg: "Please provide a valid email address and password",
        });
      }
    } else {
      return res.status(200).json({ status: 0, msg: "user not registered" });
    }
  } catch (err) {
    return res.status(500).json({ status: 0, msg: "Something went wrong!" });
  }
});

// router.get("/logout",(req, res) => {

//     return res
//       .clearCookie("access_token")
//       .status(200)
//       .json({ status:1 });

// })
router.get("/isloggedin", async (req, res) => {
  var token = req.headers.authorization;
  token=token.split(" ")[1];
  if (token) {
    jwt
    .verify(token, process.env.JWT_SECRET, (err,decoder) => {
      if (err) {
        return res.status(500).json(false);
      }
      if (decoder) {
        return res.status(200).json(true);
      }
    })
  }
  else {
    return res.status(200).json(false);
  }
});
router.post("/newpassword", async (req, res) => {});

module.exports = router;
