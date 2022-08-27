const Auth = require("../middleware/Auth");
const router = require("express").Router();
const Guest = require("../model/guest");
router.get("/", Auth, async (req, res) => {
  try {
    const guests = await Guest.find({ user: req.user });
    return res.status(200).json({ status: 1, data: guests });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg:err ,data:[] });
  }
});

router.post("/", Auth, async (req, res) => {
  let newGuest = req.body;
  newGuest.user = req.user;

  try {
    const guests = await new Guest(newGuest).save();
    return res.status(200).json({ status: 1, data: guests });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: err });
  }
});

router.put("/:id", Auth, async (req, res) => {
  const { name, address, members } = req.body;
  try {
    let guest = await Guest.findByIdAndUpdate(req.params.id, {members: 
        members,address:address,name:name}, {new: true})
    return res.status(200).json({ status: 1, data: guest });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: err });
  }
});

router.post("/:id", Auth,async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: 1, msg: "guest deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: err });
  }
});
module.exports = router;
