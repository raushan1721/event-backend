const router = require("express").Router();
var jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const client = new OAuth2Client(process.env.CLIENT_ID);

router.post("/google", async (req, res) => {
  const token = req.body.token;
  let gProfile;

  await client
    .verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID })
    .then(function (response) {
      gProfile = response.payload;
    })
    .catch(function (error) {
      console.log(error);
      return res.status(500).json({ error: "invalid token" });
    });

  if (gProfile.email_verified) {
    const user = await User.findOne({ email: gProfile.email });
    if (user) {
      await jwt.sign(
        {
          user: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "240h" },
        (err, token) => {
          if (err) throw err;
          if (token) {
            return res
              .cookie("access_token", token, {
                maxAge: 24 * 60 * 60 * 100,
                httpOnly: true,
              })
              .json({
                status: 1,
                msg: "logged In",
                data: {
                  data: {
                    user: user._id,
                    email: user.email,
                    image: user.image,
                    name: user.name,
                  },
                },
              });
          }
        }
      );
    } else {
      const newUser = {
        name: gProfile.name,
        email: gProfile.email,
      };
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(gProfile.sub, salt);
      newUser.image = gProfile.picture;
      const _user = await new User(newUser).save();
      await jwt.sign(
        {
          user: _user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "240h" },
        (err, token) => {
          if (err) throw err;
          if (token) {
            return res
              .cookie("access_token", token, {
                maxAge: 24 * 60 * 60 * 100,
                httpOnly: true,
              })
              .json({
                status: 1,
                msg: "created and logged In",
                data: {
                  user: _user._id,
                  email: _user.email,
                  image: _user.image,
                  name: _user.name,
                },
              });
          }
        }
      );
    }
  } else {
    return res.status(200).json({
      status: 0,
      msg: "invalid credentials",
    });
  }
});

module.exports = router;
