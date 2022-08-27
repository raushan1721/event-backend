const Auth = require("../middleware/Auth")

const router = require("express").Router();

router.get("/", Auth, (req, res) => {
    const google = JSON.parse(process.env.GOOGLE_SECRET);
    res.send(google)
})


module.exports = router;