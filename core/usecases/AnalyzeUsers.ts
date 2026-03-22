import { Metric } from "@/core/entities/Metric";
import { GoalRepository } from "@/core/ports/GoalRepository";
import { GoalItem, GoalQuery } from "@/core/usecases/types/GoalQuery";

type TimePeriod = "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface GraphResult {
  x_label: string;
  y_label: string;
  x_values: Record<TimePeriod, string[]>;
  y_values: Record<TimePeriod, number[]>;
}

export class AnalyzeUsers {
  constructor(private goalRepository: GoalRepository) {}

  async constructGraph(metric: Metric): Promise<GraphResult> {
    const x_values: Record<TimePeriod, string[]> = {
      Daily: [],
      Weekly: [],
      Monthly: [],
      Yearly: [],
    };
    const y_values: Record<TimePeriod, number[]> = {
      Daily: [],
      Weekly: [],
      Monthly: [],
      Yearly: [],
    };
    const allPeriods = this.getAllTimePeriods();

    for (const period of allPeriods) {
      const dates_list = this.getDates(period);

      for (const date of dates_list) {
        const range = this.getPeriodRange(date, period);

        const goals_criteria: GoalQuery = {
          user_id: metric.user_id,
          goal_type: metric.goal_type,
          goal_category: metric.goal_category ?? null,
          start_date: range.start,
          end_date: range.end,
        };

        const goals = await this.goalRepository.getGoals(goals_criteria);
        y_values[period].push(this.calculateYValues(goals, metric.type));
        x_values[period].push(this.toLabel(date, period));
      }
    }

    return {
      x_label: metric.x_label,
      y_label: metric.y_label,
      x_values,
      y_values,
    };
  }

  private getAllTimePeriods(): TimePeriod[] {
    return ["Daily", "Weekly", "Monthly", "Yearly"];
  }

  calculateYValues(goals: GoalItem[], metric_option: string): number {
    const completed = goals.filter((goal) => goal.completed === "Completed").length;
    console.log(goals)
    const normalizedMetricOption = metric_option.toLowerCase();

    if (normalizedMetricOption === "task efficiency" || normalizedMetricOption === "efficiency") {
      if (goals.length === 0) {
        return 0;
      }

      return completed * 100 / goals.length ;
    }

    if (normalizedMetricOption === "task output" || normalizedMetricOption === "output") {
      return completed;
    }

    throw new Error(`Unsupported metric option: ${metric_option}`);
  }

  getDates(time_period: string): Date[] {
    const now = new Date();
    const dates: Date[] = [];

    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(now);

      if (time_period === "Daily") {
        date.setDate(now.getDate() - i);
      } else if (time_period === "Weekly") {
        date.setDate(now.getDate() - i * 7);
      } else if (time_period === "Monthly") {
        date.setMonth(now.getMonth() - i);
      } else if (time_period === "Yearly") {
        date.setFullYear(now.getFullYear() - i);
      } else {
        throw new Error(`Unsupported time period: ${time_period}`);
      }

      dates.push(date);
    }

    return dates;
  }

  private getPeriodRange(date: Date, time_period: string): { start: Date; end: Date } {
    const start = new Date(date);
    const end = new Date(date);

    if (time_period === "Daily") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (time_period === "Weekly") {
      end.setDate(end.getDate() + 6);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (time_period === "Monthly") {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (time_period === "Yearly") {
      start.setMonth(0, 1);
      end.setMonth(11, 31);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      throw new Error(`Unsupported time period: ${time_period}`);
    }

    return { start, end };
  }

  private toLabel(date: Date, time_period: string): string {
    if (time_period === "Daily") {
      return date.toISOString().slice(0, 10);
    }

    if (time_period === "Weekly") {
      return `Week of ${date.toISOString().slice(0, 10)}`;
    }

    if (time_period === "Monthly") {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    return String(date.getFullYear());
  }
}
