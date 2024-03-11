const HomeFeed = require("../model/HomeFeed");

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
        error: `Homefeed not found`,
        success: false,
      })
  } catch (error) {
    res.status(502).send({
      error: `Error in fetching Home Feed`,
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
        error: `Wrong Feed info format, 'feeds' should be an array of objects`,
        success: false,
      });

    let insertRes;
    try {
      insertRes = await HomeFeed.insertMany(feedInfo);
    } catch (error) {
      return res.status(400).send({
        error: `Error inserting Fields, Check input data`,
        success: false,
        message: error.message
      });
    }
    res.status(200).send({
      body: {
        insertRes
      },
      success: true,
      message: `${insertRes.length} documents inserted out of ${feedInfo.length}`
    });

  } catch (error) {
    res.status(500).send({
      error: `Internal Server Error`,
      success: false,
      message: error.message
    });
  }
}

module.exports = { getHomeFeed, insertHomeFeed };
