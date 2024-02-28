const User = require("../model/User");

async function signUp(req, res) {
  try {
    console.log("Called");
    const { uid, email, rollNumber, role, fullName } = req.body;

    if (!uid || !email || !rollNumber || !role || !fullName) {
      return res.status(400).send({ message: "Please provide required field" });
    }

    const newUser = new User({
      uid, email, rollNumber, role, fullName
    });
    const response = await newUser.save();
    res.status(201).send({ data: response, message: "Successfully created" });
  } catch (error) {
    return res.status(400).send({ message: `Something went wrong: ${error.message}` });
  }
}

async function signIn(req, res) {
  console.log("signIn method is called");
  try {
    // this uid is inserted by middleware in the req 
    const uid = req.uid || req.body.uid;
    if (!uid) {
      return res.status(400).send({ message: "Please provide the uid" });
    }
    const response = await User.find({ uid }).exec();
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: `something went wrong: ${error.message}` });
  }
}

async function getAllDetailsOfUser(req, res) {
  try {
    const uid = req.params.uid;
    console.log("called", uid);
    let userDetails = await User.findOne({ uid }).exec();
    if (!userDetails) {
      return res.status(404).send({ message: "Please signUp first", status: false });
    }
    res.status(200).send({ data: userDetails, status: true });
  } catch (error) {
    res.status(400).send({ message: `Something went wrong: ${error.message}` });
  }
}

module.exports = { signUp, signIn, getAllDetailsOfUser };
