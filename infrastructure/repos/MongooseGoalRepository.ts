import DailyTaskModel from "@/infrastructure/models/DailyTaskModel";
import UpcomingResponsibilityModel from "@/infrastructure/models/UpcomingResponsibilityModel";
import MidTermGoalModel from "@/infrastructure/models/MidTermGoalModel";
import LongTermGoalModel from "@/infrastructure/models/LongTermGoalModel";
import { GoalRepository } from "@/core/ports/GoalRepository";
import {
  GoalCreateInput,
  GoalItem,
  GoalQuery,
  GoalUpdateInput,
} from "@/core/usecases/types/GoalQuery";

type GoalType =
  | "Daily Tasks"
  | "Upcoming Responsibility"
  | "Mid Term Goal"
  | "Long Term Goal";

export class MongooseGoalRepository implements GoalRepository {
  private normalizeCompletedValue(
    value: GoalCreateInput["completed"]
  ): "Not Started" | "In Progress" | "Completed" {
    if (value === "Completed" || value === "In Progress" || value === "Not Started") {
      return value;
    }

    if (value === true || value === "true" || value === "on") {
      return "Completed";
    }

    return "Not Started";
  }

  private generateId(prefix: string): string {
    const randomPart =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    return `${prefix}-${randomPart}`;
  }

  private requireCategory(value: string | null | undefined, goalType: GoalType): string {
    if (!value?.trim()) {
      throw new Error(`goal_category is required for ${goalType}`);
    }

    return value;
  }

  async addGoals(input: GoalCreateInput): Promise<GoalItem> {
    const goalType = input.goal_type as GoalType;
    const completedValue = this.normalizeCompletedValue(input.completed);

    const base = {
      user_id: input.user_id,
      name: input.name,
      from: input.from || null,
      to: input.to,
      completed: completedValue,
    };

    if (goalType === "Daily Tasks") {
      const created = await DailyTaskModel.create({
        ...base,
        task_id: input.task_id ?? this.generateId("task"),
        ur_id: input.ur_id ?? this.generateId("ur"),
        category: this.requireCategory(input.goal_category, goalType),
      });

      return this.mapDoc(created.toObject(), goalType);
    }

    if (goalType === "Upcoming Responsibility") {
      const created = await UpcomingResponsibilityModel.create({
        ...base,
        ur_id: input.ur_id ?? this.generateId("ur"),
        mtg_id: input.mtg_id ?? this.generateId("mtg"),
        category: this.requireCategory(input.goal_category, goalType),
      });

      return this.mapDoc(created.toObject(), goalType);
    }

    if (goalType === "Mid Term Goal") {
      const created = await MidTermGoalModel.create({
        ...base,
        mtg_id: input.mtg_id ?? this.generateId("mtg"),
        ltg_id: input.ltg_id,
        category: this.requireCategory(input.goal_category, goalType),
      });

      return this.mapDoc(created.toObject(), goalType);
    }

    if (goalType === "Long Term Goal") {
      const created = await LongTermGoalModel.create({
        ...base,
        ltg_id: input.ltg_id ?? this.generateId("ltg"),
      });

      return this.mapDoc(created.toObject(), goalType);
    }

    throw new Error(`Unsupported goal type: ${input.goal_type}`);
  }

  async updateGoal(input: GoalUpdateInput): Promise<GoalItem | null> {
    const goalType = input.goal_type as GoalType;
    const models = this.getModels(goalType);
    const model = models[0][1];

    const fieldMap: Record<string, string> = {
      goal_category: "category",
    };

    const targetField = fieldMap[input.field] ?? input.field;
    const allowedFields = new Set(["name", "from", "to", "completed", "category"]);

    if (!allowedFields.has(targetField)) {
      throw new Error(`Unsupported goal field update: ${input.field}`);
    }

    const idField = MongooseGoalRepository.goalIdFieldMap[goalType];
    const updatedDoc = await model
      .findOneAndUpdate(
        { [idField]: input.goal_id },
        { [targetField]: input.value },
        { new: true }
      )
      .lean();

    if (!updatedDoc) {
      return null;
    }

    return this.mapDoc(updatedDoc, goalType);
  }

  private getModels(goalType: string | null) {
    const all: Record<GoalType, any> = {
      "Daily Tasks": DailyTaskModel,
      "Upcoming Responsibility": UpcomingResponsibilityModel,
      "Mid Term Goal": MidTermGoalModel,
      "Long Term Goal": LongTermGoalModel,
    };

    if (!goalType) {
      return Object.entries(all) as Array<[GoalType, any]>;
    }

    const model = all[goalType as GoalType];
    if (!model) {
      throw new Error(`Unsupported goal type: ${goalType}`);
    }

    return [[goalType as GoalType, model]];
  }

  private static readonly goalIdFieldMap: Record<GoalType, string> = {
    "Long Term Goal": "ltg_id",
    "Mid Term Goal": "mtg_id",
    "Upcoming Responsibility": "ur_id",
    "Daily Tasks": "task_id",
  };

  private buildFilter(query: GoalQuery) {
    const filter: Record<string, unknown> = {
      user_id: query.user_id,
    };

    if (query.goal_id) {
      const idField = query.goal_type
        ? (MongooseGoalRepository.goalIdFieldMap[query.goal_type as GoalType] ?? "_id")
        : "_id";
      filter[idField] = query.goal_id;
    }
    if (query.ltg_id) filter.ltg_id = query.ltg_id;
    if (query.mtg_id) filter.mtg_id = query.mtg_id;
    if (query.ur_id) filter.ur_id = query.ur_id;

    if (query.goal_category) {
      filter.category = query.goal_category;
    }

    if (query.start_date && query.end_date) {
      filter.from = { $lte: query.end_date };
      filter.to = { $gte: query.start_date };
    } else if (query.start_date) {
      filter.to = { $gte: query.start_date };
    } else if (query.end_date) {
      filter.from = { $lte: query.end_date };
    }

    return filter;
  }

  private mapDoc(doc: any, goalType: GoalType): GoalItem {
    const mongoId = doc._id?.toString();
    return {
      id: mongoId,
      _id: mongoId,
      user_id: doc.user_id,
      goal_type: goalType,
      name: doc.name,
      goal_category: doc.category ?? "",
      from: doc.from ? new Date(doc.from) : new Date(doc.to),
      to: new Date(doc.to),
      completed: this.normalizeCompletedValue(doc.completed),
      ltg_id: doc.ltg_id ?? null,
      mtg_id: doc.mtg_id ?? null,
      ur_id: doc.ur_id ?? null,
      task_id: doc.task_id ?? null,
    };
  }

  async findSpecificGoal(query: GoalQuery): Promise<GoalItem | null> {
    const goals = await this.getGoals(query);
    return goals.length > 0 ? goals[0] : null;
  }

  async getGoals(query: GoalQuery): Promise<GoalItem[]> {
    const models = this.getModels(query.goal_type);
    const filter = this.buildFilter(query);

    const goalsByModel = await Promise.all(
      models.map(async ([goalType, model]) => {
        const docs = await model.find(filter).sort({ from: 1 }).lean();
        return docs.map((doc: any) => this.mapDoc(doc, goalType));
      })
    );

    return goalsByModel.flat().sort((a, b) => a.from.getTime() - b.from.getTime());
  }

  async deleteGoal(query: GoalQuery): Promise<number> {
    const models = this.getModels(query.goal_type);
    const filter = this.buildFilter(query);

    const results = await Promise.all(models.map(([, model]) => model.deleteMany(filter)));

    return results.reduce((acc: number, result: any) => acc + (result.deletedCount ?? 0), 0);
  }
}
