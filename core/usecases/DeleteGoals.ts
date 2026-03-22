import { GoalRepository } from "@/core/ports/GoalRepository";
import { GoalQuery } from "@/core/usecases/types/GoalQuery";

export class DeleteGoals {
  constructor(private goalRepository: GoalRepository) {}

  async execute(query: GoalQuery): Promise<number> {
    return this.goalRepository.deleteGoal(query);
  }
}
