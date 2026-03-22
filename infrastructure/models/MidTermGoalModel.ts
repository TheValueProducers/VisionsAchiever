import mongoose from "mongoose";

const midTermGoalSchema = new mongoose.Schema({
  mtg_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  to: { type: Date, required: true },
   completed: { 
    type: String, 
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
    default: "Not Started"
  },
  ltg_id: { type: String, required: false },
  category: {
    type: String,
    enum: ["classes", "courses", "work out goals", "books", "mid term goals"],
    required: true,
  },
});

const MidTermGoalModel =
  mongoose.models.MidTermGoal || mongoose.model("MidTermGoal", midTermGoalSchema);

export default MidTermGoalModel;
