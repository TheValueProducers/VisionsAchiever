import mongoose from "mongoose";

const upcomingResponsibilitySchema = new mongoose.Schema({
  ur_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  to: { type: Date, required: true },
    completed: { 
    type: String, 
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
    default: "Not Started"
  },
  mtg_id: { type: String, required: false },
  category: {
    type: String,
    enum: [
      "problem sets",
      "learning sections",
      "workouts",
      "chapters",
      "upcoming responsibilities",
    ],
    required: true,
  },
});

const UpcomingResponsibilityModel =
  mongoose.models.UpcomingResponsibility ||
  mongoose.model("UpcomingResponsibility", upcomingResponsibilitySchema);

export default UpcomingResponsibilityModel;
