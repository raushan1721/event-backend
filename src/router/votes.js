const Auth = require("../middleware/Auth");
const Vote = require("../model/votes");

const router = require("express").Router();

router.post("/new", async (req, res) => {
  const { event, coming, notcoming, maybe } = req.body;
  try {
    const vote = await Vote.findOne({ event: event });
    if (vote) {
      vote.coming = Number(coming);
      vote.notcoming = Number(notcoming);
      vote.maybe = Number(maybe);
      await vote.save();
    } else {
      const newVote = {
        event,
        coming,
        notcoming,
        maybe,
      };
      await new Vote(newVote).save();
    }
    return res.status(200).json({ status: 1 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0 });
  }
});

router.get("/:event", async (req, res) => {
  const event = req.params.event;
  try {
    const vote = await Event.findOne({ event: event }).populate({
      path: "user",
      select: "-password -email -_id -createdAt -updatedAt -__v",
    });

    return res.status(200).json({ status: 1, data: vote });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0 });
  }
});

router.get("/count/:id", Auth, async (req, res) => {
  const event = req.params.id;
  console.log(event);
  var votecount = {
    total:0,
    coming: 0,
    notcoming: 0,
    maybe: 0,
  };
  try {
    const vote = await Vote.find({ event: event });
    vote.map((data,ind)=>{
      votecount.total+=1;
      votecount.coming+=data.coming;
      votecount.maybe+=data.maybe;
      votecount.notcoming+=data.notcoming;
    });
    return res.status(200).json({status:1,data:votecount})
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0 });
  }
});
module.exports = router;
