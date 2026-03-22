import { GoalRepository } from "@/core/ports/GoalRepository";
import { GoalItem, GoalQuery } from "@/core/usecases/types/GoalQuery";

export class GetGoals {
  constructor(private goalRepository: GoalRepository) {}

  async execute(query: GoalQuery): Promise<GoalItem[]> {
    return this.goalRepository.getGoals(query);
  }
}
