const HomeFeed = require("../model/HomeFeed");
// const sendNotification = require("../utils/firebaseMessaging");

async function getHomeFeed(req, res) {
  try {
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const matchQuery = {
      isActive: true
    }

    const aggregationPipeline = [
      {
        $match: matchQuery
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]

    if (skip) {
      aggregationPipeline.push({ $skip: skip });
    }
    if (limit) {
      aggregationPipeline.push({ $limit: limit });
    }

    const homeFeedRes = await HomeFeed.aggregate(aggregationPipeline);

    if (homeFeedRes)
      res.status(200).send({
        body: homeFeedRes,
        success: true,
      });
    else
      res.status(404).send({
        error: `Could not load Home Feed. Please try again later.`,
        success: false,
      })
  } catch (error) {
    res.status(502).send({
      error: `Failed to load the home feed. Please try again later.`,
      success: false,
      message: error.message
    });
  }
}

async function insertHomeFeed(req, res) {
  try {
    const feedInfo = req.body.feeds;

    if (!Array.isArray(feedInfo))
      return res.status(404).send({
        error: `Incorrect feed information format. 'feeds' should be an array of objects.`,
        success: false,
      });

    let insertRes;
    try {
      insertRes = await HomeFeed.insertMany(feedInfo);
    } catch (error) {
      return res.status(400).send({
        error: `Error inserting fields. Please check your input data.`,
        success: false,
        message: error.message
      });

    }
    // for (const feed of insertRes) {
    //   try {
    //     if (feed.priority === true)
    //       await sendNotification(feed);
    //   } catch (error) {
    //     return res.status(400).send({
    //       error: `Error sending notification.`,
    //       success: false,
    //       message: error.message
    //     });
    //   }
    // }
    res.status(200).send({
      body: {
        insertRes
      },
      success: true,
      message: `${insertRes.length} documents inserted out of ${feedInfo.length}`
    });

  } catch (error) {
    res.status(500).send({
      error: `Internal Server Error. If the issue persists, please contact the app administrator.`,
      success: false,
      message: error.message
    });
  }
}

async function updateHomeFeed(req, res) {
  const id = req.params.id;
  const { detailsToUpdate } = req.body;
  try {
    const updateDetails = { $set: detailsToUpdate };
    const option = { new: true };
    const response = await HomeFeed.findOneAndUpdate({ _id: id }, updateDetails, option);
    res.status(200).send({ updatedDetails: response, success: true })
  } catch (error) {
    res.status(500).send({ error: "Updation failed ,please try again", success: false })
  }
}

async function deleteHomeFeed(req,res) {
  const { feedsToDelete } = req.body;
  try {
    if (!Array.isArray(feedsToDelete)) {
      return res.status(409).send({ error: "Expected array of IDs to be passed ", success: false });
    }
    const deletedFeeds =await  HomeFeed.deleteMany({ _id: { $in: feedsToDelete } });
    res.status(200).send({deletedFeeds,success:true})
  } catch (error) {
    res.status(500).send({ error: "Deletion failed ,please try again " });
  }
}

module.exports = { getHomeFeed, insertHomeFeed,updateHomeFeed ,deleteHomeFeed};
