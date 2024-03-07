const HomeFeedModel = require("../model/HomeFeed");

async function getHomeFeed(req, res) {
  try {
    const skip = req.params.skip || 0;
    const limit = req.query.limit;

    const matchQuery = {
      is_active: true
    }

    const aggregationPipeline = [
      {
        $match: matchQuery
      },
      {
        $skip: skip
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]

    if (limit) {
      aggregationPipeline.push({ $limit: limit });
    }

    const homeFeedRes = await HomeFeedModel.aggregate(aggregationPipeline);

    if (homeFeedRes)
      res.status(200).send({
        body: {
          homeFeedRes
        },
        success: true,
      });
    else
      res.status(404).send({
        error: `Homefeed not found`,
        success: false,
      })
  } catch (error) {
    await session.abortTransaction();
    res.status(502).send({
      error: `Error in fetching Home Feed`,
      success: false,
    });
  } finally {
    session.endSession();
  }
}

module.exports = { getHomeFeed };
