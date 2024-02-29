const User = require("../model/User");

async function signUp(req, res) {
  try {
    console.log("signUp page is called");
    const { uid, email, rollNumber, role, fullName } = req.body;

    if (!uid || !email || !rollNumber || !role || !fullName) {
      return res.status(400).send({ message: "Please provide required field", success: false });
    }

    const newUser = new User({
      uid, email, rollNumber, role, fullName
    });
    const response = await newUser.save();
    res.status(201).send({ data: response, message: "Successfully created", success: true });
  } catch (error) {
    return res.status(400).send({ message: `Something went wrong: ${error.message}`, success: false });
  }
}



async function getAllDetailsOfUser(req, res) {
  try {
    const uid = req.params.uid;
    console.log("called", uid);
    let userDetails = await User.findOne({ uid }).exec();
    if (!userDetails) {
      return res.status(404).send({ message: "Please signUp first", sucess: false });
    }
    res.status(200).send({ data: userDetails, status: true });
  } catch (error) {
    res.status(400).send({ message: `Something went wrong: ${error.message}`, success: true });
  }
}

module.exports = { signUp, getAllDetailsOfUser };
