import mongoose from "mongoose";

const dailyTaskSchema = new mongoose.Schema({
  task_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
    completed: { 
    type: String, 
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
    default: "Not Started"
  },
  ur_id: { type: String, required: false },
  
  category: {
    type: String,
    enum: ["problems", "learning sub-sections", "exercises", "pages", "tasks"],
    required: true,
  },
});

const DailyTaskModel =
  mongoose.models.DailyTask || mongoose.model("DailyTask", dailyTaskSchema);

export default DailyTaskModel;
