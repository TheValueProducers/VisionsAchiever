import { GoalRepository } from "@/core/ports/GoalRepository";
import { GoalItem, GoalQuery } from "@/core/usecases/types/GoalQuery";

export class GetSpecificGoals {
  constructor(private goalRepository: GoalRepository) {}

  async execute(query: GoalQuery): Promise<GoalItem | null> {
    return this.goalRepository.findSpecificGoal(query);
  }
}
