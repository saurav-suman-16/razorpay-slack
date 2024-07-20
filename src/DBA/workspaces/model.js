const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { Schema } = mongoose;

const workspacesSchema = new Schema(
  {
    teamID: { type: String, index: true, required: true },
    memberId: { type: String, index: true, required: true },
    botUserID: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    teamName: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    razorpayKeySecret: { type: String },
    razorpayKeyId: { type: String },
    scopes: { type: String },
    paymentStatus: { type: String, enum: ["free", "paid"], default: "free" },
  },
  { timestamps: true }
);

workspacesSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

module.exports = mongoose.model("workspaces", workspacesSchema);
