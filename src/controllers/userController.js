const User = require("../model/User");

async function signUp(req, res) {
  try {
    const {
      uid,
      email,
      rollNumber,
      role,
      fullName,
      fromCollege,
      collegeName,
      phone,
      profileImage,
    } = req.body;
    if (!uid || !email || !collegeName || !role || !fullName || !phone) {
      return res
        .status(400)
        .send({ error: "please_provide_required_field", success: false });
    }

    const newUser = new User({
      uid,
      email,
      rollNumber,
      role,
      fullName,
      fromCollege,
      collegeName,
      phone,
      profileImage,
    });
    const response = await newUser.save();
    console.log(response._id);
    res.status(201).send({
      userId: response._id,
      message: "Successfully_created",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      error: "error occured while signing please try again",
      success: false,
    });
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
        collegeName: userDetails.collegeName,
        photoUrl: userDetails.profileImage,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      error: "Error while fecthing details ,please try again",
      success: false,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const uid = req.params.uid;
    const user = await User.findOneAndUpdate(
      { uid, isActive: true },
      { isActive: false },
      { success: true }
    );
    if (!user) {
      return res.status(404).send({ error: "user_not_found", success: false });
    }
    res.status(200).send({ userId: user._id, success: true });
  } catch (error) {
    res
      .status(500)
      .send({ error: "could not able to delete ,try again", success: false });
  }
}

async function handleQuery(req, res) {
  console.log("inside handleQuery");
  const searchKey = req.query["search-key"];
  const num = req.query.num ? parseInt(req.query.num) : null;
  const sortField = req.query.sort;
  const sortOrder = req.query.order ? parseInt(req.query.order) : null;

  const aggregationPipeline = [];

  if (searchKey) {
    aggregationPipeline.push({
      $match: {
        $and: [
          { fullName: new RegExp(searchKey, "i") },
          { isActive: true },
          { role: "user" },
        ],
      },
    });
  }

  if (num) {
    if (isNaN(num) || num <= 0) {
      return res
        .status(400)
        .send({ error: "Invalid limit value", success: false });
    }
    aggregationPipeline.push({ $limit: num });
  }
  if (sortField) {
    const sortObj = {};
    sortObj[sortField] = sortOrder === null ? 1 : sortOrder;
    aggregationPipeline.push({ $sort: sortObj });
  }

  try {
    const results =
      aggregationPipeline.length !== 0
        ? await User.aggregate(aggregationPipeline)
        : await User.find({ isActive: true, role: "user" }).sort({
            fullName: 1,
          });
    res.status(200).send({ results, success: true });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error while resolving query try again", success: false }); // Handle errors appropriately
  }
}

async function shopSignUp(req, res) {
  const { uid, email, role, fullName, points, password, pointsArray } =
    req.body;
  const shops = req.body.shops;

  try {
    if (!Array.isArray(shops)) {
      return res.status(404).send({
        error:
          "Wrong format ,We need array of shops with given details uid,email,fullName,points,passwrod,pointsArray",
      });
    }

    const shopsDetails = await User.insertMany(shops);
    res.status(200).send({ shopsDetails, success: true });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error while inserting,try again ", success: false });
  }
}

async function getAllShops(req, res) {
  try {
    const shops = await find({ role: "shop" });
    if (!shops) {
      res.status("No shops are found ");
    }
    res.status(200).send({ shops, success: true });
  } catch (error) {
    res.status(500).send("Error while fectching ,please try again");
  }
}

async function updateShopPassword(req, res) {
  const { uid, newPassword } = req.body;

  const filter = { uid: uid };
  const update = { $set: { password: newPassword } };
  const option = { new: true };
  try {
    const updatedShop = User.findOneAndUpdate(filter, update, option);
    if (!updatedShop) {
      return res
        .status(404)
        .send({ error: "no_such_shops_exits", success: false });
    }

    res.status(200).send({ updatedShop, success: true });
  } catch (error) {
    res.status(500).send({
      error: `someting_went_wrong :${error.message} ! try again`,
      success: false,
    });
  }
}

module.exports = {
  signUp,
  getAllDetailsOfUser,
  deleteUser,
  handleQuery,
  getAllShops,
  shopSignUp,
  updateShopPassword
};
