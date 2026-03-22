"use server"

import { createDailyTaskGoalComposition } from "@/composition/dailyTaskFactory"
import { Metric, MetricTimePeriod } from "@/core/entities/Metric"
import { GraphResult } from "@/core/usecases/AnalyzeUsers"
import { auth } from "@/lib/auth"

async function getAuthedUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function getTasksCompletedGraph(time_period: string): Promise<GraphResult> {
  const userId = await getAuthedUserId()
  const usecase = await createDailyTaskGoalComposition()

  const metric = new Metric({
    metric_id: `tasks-completed-${userId}`,
    user_id: userId,
    name: "Tasks Completed",
    type: "Output",
    time_period: time_period as MetricTimePeriod,
    goal_type: "Daily Tasks",
    x_label: "Time",
    y_label: "Completed Tasks",
  })

  return usecase.analyzeUsers.constructGraph(metric)
}

export async function getProductivityGraph(time_period: string): Promise<GraphResult> {
  const userId = await getAuthedUserId()
  const usecase = await createDailyTaskGoalComposition()

  const metric = new Metric({
    metric_id: `productivity-${userId}`,
    user_id: userId,
    name: "Daily Productivity Score",
    type: "Efficiency",
    time_period: time_period as MetricTimePeriod,
    goal_type: "Daily Tasks",
    x_label: "Time",
    y_label: "Efficiency",
  })

  return usecase.analyzeUsers.constructGraph(metric)
}
