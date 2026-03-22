import { GoalRepository } from "@/core/ports/GoalRepository";
import { GoalItem, GoalUpdateInput } from "@/core/usecases/types/GoalQuery";

export class UpdateGoal {
  constructor(private goalRepository: GoalRepository) {}

  async execute(input: GoalUpdateInput): Promise<GoalItem | null> {
    return this.goalRepository.updateGoal(input);
  }
}
