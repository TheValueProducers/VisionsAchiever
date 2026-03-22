import mongoose from "mongoose";

const longTermGoalSchema = new mongoose.Schema({
  ltg_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  to: { type: Date, required: true },
  completed: { 
    type: String, 
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
    default: "Not Started"
},
});

const LongTermGoalModel =
  mongoose.models.LongTermGoal || mongoose.model("LongTermGoal", longTermGoalSchema);

export default LongTermGoalModel;
