const User = require("../model/User");

async function signUp(req, res) {
  try {
    const { uid, email, rollNumber, role, fullName, fromCollege, collegeName, phone } = req.body;
    if (!uid || !email || !collegeName || !role || !fullName || !phone) {
      return res.status(400).send({ error: "please_provide_required_field", success: false });
    }

    const newUser = new User({
      uid, email, rollNumber, role, fullName, fromCollege, collegeName, phone
    });
    const response = await newUser.save();
    console.log(response._id);
    res.status(201).send({ userId: response._id, message: "Successfully_created", success: true });
  } catch (error) {
    return res.status(500).send({ error: "something_went_wrong_please_try_again", success: false });
  }
}



async function getAllDetailsOfUser(req, res) {
  try {
    const uid = req.params.uid;
    console.log("insidegetAllDetails");
    let userDetails = await User.findOne({ uid, isActive: true }).exec();
    if (!userDetails) {
      return res.status(404).send({ error: "user_not_found", success: false });
    }

    res.status(200).send({
      user: {
        uid: userDetails.uid,
        role: userDetails.role,
        fullName: userDetails.fullName,
        rollNumber: userDetails.rollNumber,
        fromCollege: userDetails.fromCollege,
        email: userDetails.email,
        points: userDetails.points,
        phone: userDetails.phone,
        collegeName: userDetails.collegeName
      }, success: true
    });
  } catch (error) {
    res.status(500).send({ error: "something_went_wrong_please_try_again", success: false });
  }
}

async function deleteUser(req, res) {
  try {
    const uid = req.params.uid;
    const user = await User.findOneAndUpdate({ uid, isActive: true }, { isActive: false }, { success: true });
    if (!user) {
      return res.status(404).send({ error: "user_not_found", success: false })

    }
    res.status(200).send({ userId: user._id, success: true })

  } catch (error) {
    res.status(500).send({ error: "something_went_wrong_please_try_again", success: false })

  }
}



async function handleQuery(req, res) {
  console.log("inside handleQuery")
  const searchKey = req.query['search-key'];
  const num = req.query.num ? parseInt(req.query.num) : null;
  const sortField = req.query.sort;
  const sortOrder = req.query.order ? parseInt(req.query.order) : null;

  const aggregationPipeline = [];

  if (searchKey) {
    aggregationPipeline.push({
      $match: {
        $and: [
          { fullName: new RegExp(searchKey, 'i') },
          { isActive: true },
          { role: "user" }
        ]
      }
    });
  }

  if (num) {

    if (isNaN(num) || num <= 0) {
      return res.status(400).send({ error: 'Invalid limit value', success: false });
    }
    aggregationPipeline.push({ $limit: num });
  }
  if (sortField) {
    const sortObj = {}
    sortObj[sortField] = sortOrder === null ? 1 : sortOrder;
    aggregationPipeline.push({ $sort: sortObj })
  }

  try {

    const results = aggregationPipeline.length !== 0 ? await User.aggregate(aggregationPipeline) : await User.find({ isActive: true, role: "user" }).sort({ fullName: 1 });
    res.status(200).send({ results, success: true });
  } catch (error) {

    res.status(500).send({ error: "something_went_wrong_please_try_again", success: false }); // Handle errors appropriately
  }
}






module.exports = { signUp, getAllDetailsOfUser, deleteUser, handleQuery };
