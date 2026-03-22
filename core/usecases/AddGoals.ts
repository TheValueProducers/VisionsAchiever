import { GoalRepository } from "@/core/ports/GoalRepository";
import { GoalCreateInput, GoalItem } from "@/core/usecases/types/GoalQuery";

export class AddGoals {
  constructor(private goalRepository: GoalRepository) {}

  async execute(input: GoalCreateInput): Promise<GoalItem> {
    return this.goalRepository.addGoals(input);
  }
}
