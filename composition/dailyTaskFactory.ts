import connectDB from "@/infrastructure/db/mongoose";
import { MongooseGoalRepository } from "@/infrastructure/repos/MongooseGoalRepository";
import { GetSpecificGoals } from "@/core/usecases/GetSpecificGoals";
import { GetGoals } from "@/core/usecases/GetGoals";
import { DeleteGoals } from "@/core/usecases/DeleteGoals";
import { AnalyzeUsers } from "@/core/usecases/AnalyzeUsers";
import { AddGoals } from "@/core/usecases/AddGoals";
import { UpdateGoal } from "@/core/usecases/UpdateGoal";

export async function createDailyTaskGoalComposition() {
  await connectDB();
  const repository = new MongooseGoalRepository();

  return {
    defaultGoalType: "Daily Tasks" as const,
    addGoals: new AddGoals(repository),
    updateGoal: new UpdateGoal(repository),
    getSpecificGoals: new GetSpecificGoals(repository),
    getGoals: new GetGoals(repository),
    deleteGoals: new DeleteGoals(repository),
    analyzeUsers: new AnalyzeUsers(repository),
  };
}
