import mongoose from "mongoose";
const { Schema } = mongoose;

const AppSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "login",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    sourcePlatform: {
        type: String,
        enum: ["GitHub", "Discord"],
        required: true,
    },
    destination: {
        type: String,
        enum: ["Algorand"],
        required: true,
    },
    webhookSecret: {
        type: String,
        required: true,
    },
    webhookurl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
});

AppSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model("projects", AppSchema);
