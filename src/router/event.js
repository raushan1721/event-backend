const Auth = require("../middleware/Auth");
const Event = require("../model/event");
const router = require("express").Router();
const Guest = require("../model/event");

router.get("/", Auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user });
    var result = { current: [], past: [], upcoming: [] };

    var date = new Date().toISOString().slice(0, 10);

    events.map((d) => {
      if (d.date === String(date)) {
        result.current.push(d);
      }
      if (d.date < String(date)) {
        result.past.push(d);
      }
      if (d.date > String(date)) {
        result.upcoming.push(d);
      }
    });

    return res.status(200).json({ status: 1, data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: err });
  }
});
router.get("/:id", Auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id).populate({
      path: "guests",
      model: "Guest",
    });

    return res.status(200).json({ status: 1, data: event });
  } catch (err) {
    return res.status(200).json({ status: 0, data: {} });
  }
});
router.post("/", Auth, async (req, res) => {
  let newEvents = req.body;
  newEvents.user = req.user;
  try {
    const event = await new Event(newEvents).save();
    return res.status(200).json({ status: 1, data: event });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: err });
  }
});
router.post("/guest", Auth, async (req, res) => {
  let guests = req.body.guests;
  let event = req.body.eventId;
  console.log(req.body);
  try {
    let guest = await Guest.findOne({ event: event });

    if (guest) {
      guest.guests = guests;
      await guest.save();
      return res.status(200).json({ status: 1, msg: "updated" });
    } else {
      await new Guest({ event, guests }).save();
      return res.status(200).json({ status: 1, msg: "updated" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: err });
  }
});
router.put("/:id", Auth, async (req, res) => {
  const { title, address, date } = req.body;
  try {
    const currDate = new Date().toISOString().split("T")[0];
    if (currDate < date) {
      let guest = await Guest.findByIdAndUpdate(
        req.params.id,
        { title: title, address: address, date: date },
        { new: true }
      );
      return res.status(200).json({ status: 1, data: guest });
    } else {
      return res
        .status(400)
        .json({ status: 0, data: [], msg: "sorry you can't update" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: err });
  }
});

router.delete("/:id", Auth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: 1, msg: "event deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: err });
  }
});

module.exports = router;
