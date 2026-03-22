import mongoose from "mongoose";

const metricSchema = new mongoose.Schema({
  metric_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["Task Efficiency", "Task Output"], required: true },

  goal_type: {
    type: String,
    enum: ["Daily Tasks", "Upcoming Responsibility", "Mid Term Goal", "Long Term Goal"],
    required: true,
  },
  goal_category: { type: String, required: false },
  x_label: { type: String, required: true, default: "time" },
  y_label: { type: String, required: true },
});

const MetricModel = mongoose.models.Metric || mongoose.model("Metric", metricSchema);

export default MetricModel;
