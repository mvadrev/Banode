const mongoose = require("mongoose");

const dataModelSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  measurements: [Number],
});

const dataModel = mongoose.model("dataModel", dataModelSchema);

module.exports = dataModel;
