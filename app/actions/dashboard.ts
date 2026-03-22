"use server"

import { createDailyTaskGoalComposition } from "@/composition/dailyTaskFactory"
import { createUpcomingResponsibilityGoalComposition } from "@/composition/upcomingResponsibilityFactory"
import { auth } from "@/lib/auth"
import { GoalItem } from "@/core/usecases/types/GoalQuery"

export interface TodayTasksResult {
  dailyTasks: GoalItem[]
  upcomingResponsibilities: GoalItem[]
  pastResponsibilities: GoalItem[]
}

export async function getTodayTasks(): Promise<TodayTasksResult> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0)
  const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999)
  const startOfOneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0)

  const [dailyTaskUsecase, urUsecase] = await Promise.all([
    createDailyTaskGoalComposition(),
    createUpcomingResponsibilityGoalComposition(),
  ])

  const [dailyTasks, upcomingResponsibilities, recentPastResponsibilities] = await Promise.all([
    dailyTaskUsecase.getGoals.execute({
      user_id: session.user.id,
      goal_type: "Daily Tasks",
      goal_category: null,
      start_date: startOfToday,
      end_date: endOfToday,
    }),
    urUsecase.getGoals.execute({
      user_id: session.user.id,
      goal_type: "Upcoming Responsibility",
      goal_category: null,
      start_date: startOfToday,
      end_date: endOfToday,
    }),
    urUsecase.getGoals.execute({
      user_id: session.user.id,
      goal_type: "Upcoming Responsibility",
      goal_category: null,
      start_date: startOfOneWeekAgo,
      end_date: endOfYesterday,
    }),
  ])

  const pastResponsibilities = (recentPastResponsibilities ?? []).filter(
    (item) => item.completed === "Not Started" || item.completed === "In Progress"
  )

  return {
    dailyTasks: dailyTasks ?? [],
    upcomingResponsibilities: upcomingResponsibilities ?? [],
    pastResponsibilities,
  }
}