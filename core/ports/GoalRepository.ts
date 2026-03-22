import {
  GoalCreateInput,
  GoalItem,
  GoalQuery,
  GoalUpdateInput,
} from "@/core/usecases/types/GoalQuery";

export interface GoalRepository {
  addGoals(input: GoalCreateInput): Promise<GoalItem>;
  updateGoal(input: GoalUpdateInput): Promise<GoalItem | null>;
  findSpecificGoal(query: GoalQuery): Promise<GoalItem | null>;
  getGoals(query: GoalQuery): Promise<GoalItem[]>;
  deleteGoal(query: GoalQuery): Promise<number>;
}
