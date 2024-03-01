const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ["sticker", "t_shirt"],
    required: true, // Corrected typo: 'required' instead of 'require'
  },
  itemImageUrl: {
    type: String,
    required: true, // Corrected typo: 'required' instead of 'require'
  },
  itemCost: {
    type: Number,
    required: true, // Corrected typo: 'required' instead of 'require'
  }
});

shopSchema.pre('save', async function (next) {
  if (this.itemCost < 0) {
    next(new Error("Please provide a valid cost for the item."));
  } else {
    next();
  }
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
