export type MetricType = "Efficiency" | "Output";

export type MetricTimePeriod = "Daily" | "Weekly" | "Monthly" | "Yearly";

export type MetricGoalType =
  | "Daily Tasks"
  | "Upcoming Responsibility"
  | "Mid Term Goal"
  | "Long Term Goal";

export interface MetricProps {
  _id?: string;
  metric_id: string;
  user_id: string;
  name: string;
  type: MetricType;
  time_period: MetricTimePeriod;
  goal_type: MetricGoalType;
  goal_category?: string | null;
  x_label?: string;
  y_label: string;
}

export class Metric {
  public readonly _id?: string;
  public readonly metric_id: string;
  public readonly user_id: string;
  public name: string;
  public type: MetricType;
  public time_period: MetricTimePeriod;
  public goal_type: MetricGoalType;
  public goal_category: string | null;
  public x_label: string;
  public y_label: string;

  constructor(props: MetricProps) {
    if (!props.metric_id) {
      throw new Error("metric_id is required");
    }

    if (!props.user_id) {
      throw new Error("user_id is required");
    }

    if (!props.name.trim()) {
      throw new Error("name is required");
    }

    if (!props.y_label.trim()) {
      throw new Error("y_label is required");
    }

    this._id = props._id;
    this.metric_id = props.metric_id;
    this.user_id = props.user_id;
    this.name = props.name;
    this.type = props.type;
    this.time_period = props.time_period;
    this.goal_type = props.goal_type;
    this.goal_category = props.goal_category ?? null;
    this.x_label = props.x_label ?? "time";
    this.y_label = props.y_label;
  }
}
