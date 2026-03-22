"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import { handleGetGoals, handleUpdateGoal } from "@/app/actions/tasks"
import { type DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { useLanguageContext } from "@/components/context/languageWrapper"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type DisplayMode = "list" | "hierarchy"

type Goal = {
  id?: string
  _id?: string
  name: string
  goal_type: string
  goal_category?: string | null
  from?: string | Date
  to: string | Date
  completed?: GoalProgressStatus
  ltg_id?: string | null
  mtg_id?: string | null
  ur_id?: string | null
  task_id?: string | null
}

type GoalProgressStatus = "Not Started" | "In Progress" | "Completed"
type TimeAdjective = "after" | "before" | "between"
type TimePreset = "all" | "today" | "yesterday" | "tomorrow" | "custom"

type SectionFilter = {
  category: string
  completed: string
  timeAdjective: TimeAdjective
  timePreset: TimePreset
  timePresetEnd: TimePreset
  customDate?: Date
  customDateEnd?: Date
  customDateRange?: DateRange
}

const listSections = [
  ["Long Term Goal", "/create-task/add-long-term-goal"],
  ["Mid Term Goal", "/create-task/add-mid-term-goal"],
  ["Upcoming Responsibilities", "/create-task/add-upcoming-responsibility"],
  ["Daily Task", "/create-task/add-daily-task"],
] as const

const DEFAULT_FILTER: SectionFilter = {
  category: "all",
  completed: "all",
  timeAdjective: "before",
  timePreset: "all",
  timePresetEnd: "all",
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

function dateForPreset(preset: TimePreset, customDate?: Date) {
  const now = new Date()

  if (preset === "today") {
    return now
  }

  if (preset === "yesterday") {
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    return yesterday
  }

  if (preset === "tomorrow") {
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    return tomorrow
  }

  if (preset === "custom") {
    return customDate
  }

  return undefined
}

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
function isAfterPreset(
  startDateRaw: Date | undefined,
  endDateRaw: Date,
  presetDate: Date
): boolean {
  const start = toStartOfDay(startDateRaw ?? endDateRaw)
  const end = toStartOfDay(endDateRaw)
  const preset = toStartOfDay(presetDate)

  return start > preset && end > preset
}
function isBeforePreset(
  startDateRaw: Date | undefined,
  endDateRaw: Date,
  presetDate: Date
): boolean {
  const start = toStartOfDay(startDateRaw ?? endDateRaw)
  const end = toStartOfDay(endDateRaw)
  const preset = toStartOfDay(presetDate)

  return start < preset && end < preset
}
function isBetweenPreset(
  startDateRaw: Date | undefined,
  endDateRaw: Date,
  presetDate: Date,
  presetEndDate: Date
): boolean {
  const start = toStartOfDay(startDateRaw ?? endDateRaw)
  const end = toStartOfDay(endDateRaw)

  const p1 = toStartOfDay(presetDate)
  const p2 = toStartOfDay(presetEndDate)

  const from = p1 <= p2 ? p1 : p2
  const to = p1 <= p2 ? p2 : p1

  return (
    start >= from &&
    start <= to &&
    end >= from &&
    end <= to
  )
}

function NodeCard({
  label,
  className = "",
}: {
  label: string
  className?: string
}) {
  return (
    <Card
      className={[
        "rounded-2xl border-2 border-slate-900 bg-white shadow-md",
        className,
      ].join(" ")}
    >
      <CardContent className="px-5 py-3">
        <div className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {label}
        </div>
      </CardContent>
    </Card>
  )
}

function Line({ className = "" }: { className?: string }) {
  return (
    <div className={["absolute rounded-full bg-slate-900", className].join(" ")} />
  )
}

function formatDate(to: string | Date, from?: string | Date) {
  const toDate = new Date(to);
  if (isNaN(toDate.getTime())) return "Invalid date";

  if (from) {
    const fromDate = new Date(from);
    if (isNaN(fromDate.getTime())) return "Invalid date";

    const sameDay =
      fromDate.getFullYear() === toDate.getFullYear() &&
      fromDate.getMonth() === toDate.getMonth() &&
      fromDate.getDate() === toDate.getDate();

    if (sameDay) {
      return `${fromDate.toLocaleString()} - ${toDate.toLocaleTimeString()}`;
    }

    return `${fromDate.toLocaleString()} - ${toDate.toLocaleString()}`;
  }

  return toDate.toLocaleString();
}
function toInputDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function CreateTaskPage() {
  const { t } = useLanguageContext()
  const [displayMode, setDisplayMode] = useState<DisplayMode>("list")
  const [tasks, setTasks] = useState<Record<string, Goal[]>>({})
  const [goalStatuses, setGoalStatuses] = useState<Record<string, GoalProgressStatus>>({})
  const [sectionFilters, setSectionFilters] = useState<Record<string, SectionFilter>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  })

  const getGoalKey = (sectionName: string, goal: Goal, idx: number) =>
    goal._id ?? goal.id ?? `${sectionName}-${idx}`

  const toGoalType = (sectionName: string, goal: Goal): string => {
    if (goal.goal_type?.trim()) {
      return goal.goal_type
    }

    if (sectionName === "Upcoming Responsibilities") {
      return "Upcoming Responsibility"
    }

    if (sectionName === "Daily Task") {
      return "Daily Tasks"
    }

    return sectionName
  }

  const getStatusForGoal = (sectionName: string, goal: Goal, idx: number): GoalProgressStatus => {
    const key = getGoalKey(sectionName, goal, idx)
    return goalStatuses[key] ?? goal.completed ?? "Not Started"
  }

  const cycleStatus = (currentStatus: GoalProgressStatus): GoalProgressStatus => {
    if (currentStatus === "Not Started") return "In Progress"
    if (currentStatus === "In Progress") return "Completed"
    return "Not Started"
  }

  const getStatusClasses = (status: GoalProgressStatus) => {
    if (status === "Not Started") {
      return "bg-red-100 text-red-800 hover:bg-red-200"
    }

    if (status === "In Progress") {
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    }

    return "bg-green-100 text-green-800 hover:bg-green-200"
  }

  const getSectionFilter = (sectionName: string): SectionFilter => {
    return sectionFilters[sectionName] ?? DEFAULT_FILTER
  }

  const updateSectionFilter = (
    sectionName: string,
    patch: Partial<SectionFilter>
  ) => {
    setSectionFilters((prev) => ({
      ...prev,
      [sectionName]: {
        ...(prev[sectionName] ?? DEFAULT_FILTER),
        ...patch,
      },
    }))
  }

  const applySectionFilters = (goals: Goal[], filter: SectionFilter): Goal[] => {
    const presetDate = dateForPreset(filter.timePreset, filter.customDate)
    const presetEndDate = dateForPreset(filter.timePresetEnd, filter.customDateEnd)

    return goals.filter((goal) => {
      const categoryValue = goal.goal_category?.trim() || "Uncategorized"
      if (filter.category !== "all" && categoryValue !== filter.category) {
        return false
      }

      const completedValue = goal.completed ?? "Not Started"
      if (filter.completed !== "all" && completedValue !== filter.completed) {
        return false
      }

      const startDateRaw = goal.from ? new Date(goal.from) : new Date(goal.to)
      const endDateRaw = new Date(goal.to)

      if (isNaN(startDateRaw.getTime()) || isNaN(endDateRaw.getTime())) {
        return false
      }

        if (filter.timeAdjective === "after" && presetDate) {
          if (!isAfterPreset(startDateRaw, endDateRaw, presetDate)) {
            return false
          }
        }

        if (filter.timeAdjective === "before" && presetDate) {
          if (!isBeforePreset(startDateRaw, endDateRaw, presetDate)) {
            return false
          }
        }

        if (filter.timeAdjective === "between") {
          if (!filter.customDate || !filter.customDateEnd) {
            return true
          }

          if (
            !isBetweenPreset(
              startDateRaw,
              endDateRaw,
              filter.customDate,
              filter.customDateEnd
            )
          ) {
            return false
          }
        }

      return true
    })
  }

  const persistCompletedToggle = async (
    sectionName: string,
    goal: Goal,
    idx: number,
    previousStatus: GoalProgressStatus,
    nextStatus: GoalProgressStatus
  ) => {
    const goalId = goal._id ?? goal.id

    if (!goalId) {
      return
    }

    try {
      await handleUpdateGoal({
        goal_id: goalId,
        goal_type: toGoalType(sectionName, goal),
        field: "completed",
        value: nextStatus,
      })
    } catch (err) {
      console.error(err)
      setError("Failed to update goal status.")
      const key = getGoalKey(sectionName, goal, idx)
      setGoalStatuses((prev) => ({
        ...prev,
        [key]: previousStatus,
      }))
    }
  }

  useEffect(() => {
    const updateTasks = async () => {
      try {
        setLoading(true)
        setError(null)

        const results = await Promise.all(
          listSections.map(async ([goalType]) => {
            const result = await handleGetGoals(goalType)

            let goalsArray: Goal[] = []

            if (Array.isArray(result)) {
              goalsArray = result as Goal[]
            } else if (Array.isArray((result as any)?.goals)) {
              goalsArray = (result as any).goals as Goal[]
            } else if (Array.isArray((result as any)?.data)) {
              goalsArray = (result as any).data as Goal[]
            }

            return [goalType, goalsArray] as const
          })
        )

        const groupedTasks: Record<string, Goal[]> = {}
        const initialStatuses: Record<string, GoalProgressStatus> = {}
        for (const [goalType, goals] of results) {
          groupedTasks[goalType] = goals
          goals.forEach((goal, idx) => {
            initialStatuses[getGoalKey(goalType, goal, idx)] = goal.completed ?? "Not Started"
          })
        }

        setTasks(groupedTasks)
        setGoalStatuses(initialStatuses)
      } catch (err) {
        console.error(err)
        setError("Failed to load goals.")
      } finally {
        setLoading(false)
      }
    }

    updateTasks()
  }, [])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Task</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="capitalize">
              {t("display")} {displayMode === "list" ? t("list") : t("hierarchy")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDisplayMode("list")}>
              {t("displayList")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDisplayMode("hierarchy")}>
              {t("displayHierarchy")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {displayMode === "list" ? (
        <div className="space-y-6">
          {listSections.map(([sectionName, href]) => {
            const sectionTasks = tasks[sectionName] ?? []
            const sectionFilter = getSectionFilter(sectionName)
            const filteredSectionTasks = applySectionFilters(sectionTasks, sectionFilter)
            const categoryOptions = Array.from(
              new Set(
                sectionTasks
                  .map((goal) => goal.goal_category?.trim() || "Uncategorized")
                  .filter(Boolean)
              )
            )
            const completedOptions = Array.from(
              new Set(sectionTasks.map((goal) => goal.completed ?? "Not Started"))
            )

            return (
              <Card key={sectionName}>
                <CardHeader>
                  <div className="flex flex-row items-center justify-between">
                    <CardTitle>{sectionName === "Long Term Goal" ? t("longTermGoal") : sectionName === "Mid Term Goal" ? t("midTermGoal") : sectionName === "Upcoming Responsibilities" ? t("upcomingResponsibilities") : t("dailyTask")}</CardTitle>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">{t("filter")}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-100">
                          <DropdownMenuLabel>{t("category")}</DropdownMenuLabel>
                          <div className="space-y-2 px-2 pb-2">
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                className="h-9 rounded-md border bg-background px-2 text-sm"
                                value="is"
                                disabled
                              >
                                <option value="is">is</option>
                              </select>
                              <select
                                className="h-9 rounded-md border bg-background px-2 text-sm"
                                value={sectionFilter.category}
                                onChange={(event) => {
                                  updateSectionFilter(sectionName, {
                                    category: event.target.value,
                                  })
                                }}
                              >
                                <option value="all">All</option>
                                {categoryOptions.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <DropdownMenuSeparator />

                          <DropdownMenuLabel>{t("time")}</DropdownMenuLabel>
                          <div className="space-y-2 px-2 pb-2">
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                className="h-9 rounded-md border bg-background px-2 text-sm"
                                value={sectionFilter.timeAdjective}
                                onChange={(event) => {
                                  updateSectionFilter(sectionName, {
                                    timeAdjective: event.target.value as TimeAdjective,
                                  })
                                }}
                              >
                                <option value="after">is after</option>
                                <option value="before">is before</option>
                                <option value="between">is between</option>
                              </select>
                              {sectionFilter.timeAdjective === "between" ? (
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="date"
                                  className="h-9 rounded-md border bg-background px-2 text-sm"
                                  value={sectionFilter.customDate ? toInputDateValue(sectionFilter.customDate) : ""}
                                  onChange={(event) => {
                                    updateSectionFilter(sectionName, {
                                      customDate: event.target.value
                                        ? new Date(`${event.target.value}T00:00:00`)
                                        : undefined,
                                    })
                                  }}
                                />

                                <input
                                  type="date"
                                  className="h-9 rounded-md border bg-background px-2 text-sm"
                                  value={sectionFilter.customDateEnd ? toInputDateValue(sectionFilter.customDateEnd) : ""}
                                  onChange={(event) => {
                                    updateSectionFilter(sectionName, {
                                      customDateEnd: event.target.value
                                        ? new Date(`${event.target.value}T00:00:00`)
                                        : undefined,
                                    })
                                  }}
                                />
                              </div>
                              ) : (
                                <select
                                  className="h-9 rounded-md border bg-background px-2 text-sm"
                                  value={sectionFilter.timePreset}
                                  onChange={(event) => {
                                    const nextPreset = event.target.value as TimePreset
                                    updateSectionFilter(sectionName, {
                                      timePreset: nextPreset,
                                    })
                                  }}
                                >
                                  <option value="all">All</option>
                                  <option value="today">today</option>
                                  <option value="yesterday">yesterday</option>
                                  <option value="tomorrow">tomorrow</option>
                                  <option value="custom">custom date</option>
                                </select>
                              )}
                            </div>

                            {sectionFilter.timeAdjective !== "between" && sectionFilter.timePreset === "custom" && (
                              <div className="rounded-md border p-2">
                                <Calendar
                                  
                                  selected={sectionFilter.customDate}
                                  onSelect={(date) => {
                                    updateSectionFilter(sectionName, {
                                      customDate: date,
                                    })
                                  }}
                                  className="rounded-md"
                                />
                              </div>
                            )}

                            {sectionFilter.timeAdjective === "between" && (
                              <div className="space-y-2">
                                
                                  <div className="rounded-md border p-2">
                                  
                                    <Calendar
                                      mode="range"
                                      selected={sectionFilter.customDateRange}
                                      onSelect={(range) => {
                                        updateSectionFilter(sectionName, {
                                          customDateRange: range,
                                          customDate: range?.from,
                                          customDateEnd: range?.to,
                                        })
                                      }}
                                      className="rounded-md"
                                    />
                                  </div>
                                

                              </div>
                            )}
                          </div>

                          <DropdownMenuSeparator />

                          <DropdownMenuLabel>{t("completed")}</DropdownMenuLabel>
                          <div className="space-y-2 px-2 pb-2">
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                className="h-9 rounded-md border bg-background px-2 text-sm"
                                value="is"
                                disabled
                              >
                                <option value="is">is</option>
                              </select>
                              <select
                                className="h-9 rounded-md border bg-background px-2 text-sm"
                                value={sectionFilter.completed}
                                onChange={(event) => {
                                  updateSectionFilter(sectionName, {
                                    completed: event.target.value,
                                  })
                                }}
                              >
                                <option value="all">All</option>
                                {completedOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button variant="outline" asChild>
                        <Link href={href}>{t("add")} {sectionName === "Long Term Goal" ? t("longTermGoal") : sectionName === "Mid Term Goal" ? t("midTermGoal") : sectionName === "Upcoming Responsibilities" ? t("upcomingResponsibilities") : t("dailyTask")}</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="px-3 py-2 font-medium">{t("task")}</th>
                          {sectionName !== "Long Term Goal" && (
                            <th className="px-3 py-2 font-medium">{t("category")}</th>
                          )}
                          <th className="px-3 py-2 font-medium">
                            {sectionName === "Daily Task" ? t("time") : t("due")}
                          </th>
                          <th className="px-3 py-2 font-medium">{t("completed")}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {loading ? (
                          Array.from({ length: 3 }).map((_, rowIndex) => (
                            <tr key={`${sectionName}-skeleton-${rowIndex}`} className="border-b">
                              <td className="px-3 py-2">
                                <Skeleton className="h-4 w-48" />
                              </td>
                              {sectionName !== "Long Term Goal" && (
                                <td className="px-3 py-2">
                                  <Skeleton className="h-4 w-36" />
                                </td>
                              )}
                              <td className="px-3 py-2">
                                <Skeleton className="h-4 w-40" />
                              </td>
                              <td className="px-3 py-2">
                                <Skeleton className="h-8 w-28 rounded-md" />
                              </td>
                            </tr>
                          ))
                        ) : filteredSectionTasks.length === 0 ? (
                          <tr>
                            <td
                              colSpan={sectionName !== "Long Term Goal" ? 4 : 3}
                              className="px-3 py-4 text-slate-500"
                            >
                              {t("noItemsFound")}
                            </td>
                          </tr>
                        ) : (
                          filteredSectionTasks.map((goal, idx) => (
                            <tr key={getGoalKey(sectionName, goal, idx)} className="border-b">
                              <td className="px-3 py-2">
                                {sectionName === "Long Term Goal" && goal.ltg_id ? (
                                  <Link
                                    href={`/create-task/edit-long-term-goal/${goal.ltg_id}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {goal.name}
                                  </Link>
                                ) : sectionName === "Mid Term Goal" && goal.mtg_id ? (
                                  <Link
                                    href={`/create-task/edit-mid-term-goal/${goal.mtg_id}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {goal.name}
                                  </Link>
                                ) : sectionName === "Upcoming Responsibilities" && goal.ur_id ? (
                                  <Link
                                    href={`/create-task/edit-upcoming-responsibility/${goal.ur_id}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {goal.name}
                                  </Link>
                                ) : sectionName === "Daily Task" && goal.task_id ? (
                                  <Link
                                    href={`/create-task/edit-daily-task/${goal.task_id}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {goal.name}
                                  </Link>
                                ) : (
                                  goal.name
                                )}
                              </td>
                              {sectionName !== "Long Term Goal" && (
                                <td className="px-3 py-2">
                                  {goal.goal_category ?? "-"}
                                </td>
                              )}
                              <td className="px-3 py-2">
                                {sectionName === "Daily Task"
                                  ? formatDate(goal.to, goal.from)
                                  : formatDate(goal.to)}
                              </td>
                              <td className="px-3 py-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className={[
                                    "h-8 rounded-md px-3 text-xs font-semibold",
                                    getStatusClasses(getStatusForGoal(sectionName, goal, idx)),
                                  ].join(" ")}
                                  onClick={() => {
                                    const key = getGoalKey(sectionName, goal, idx)
                                    const currentStatus = getStatusForGoal(sectionName, goal, idx)
                                    const nextStatus = cycleStatus(currentStatus)

                                    setGoalStatuses((prev) => ({
                                      ...prev,
                                      [key]: nextStatus,
                                    }))

                                    void persistCompletedToggle(
                                      sectionName,
                                      goal,
                                      idx,
                                      currentStatus,
                                      nextStatus
                                    )
                                  }}
                                >
                                  {getStatusForGoal(sectionName, goal, idx)}
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Hierarchy View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <NodeCard label="LTG" className="w-[150px]" />
            </div>

            <div className="overflow-x-auto">
              <div className="relative h-[560px] min-w-[950px]">
                <Line className="left-[78px] top-[34px] h-[370px] w-[5px]" />
                <Line className="left-[78px] top-[92px] h-[5px] w-[210px]" />
                <div className="absolute left-[288px] top-[58px]">
                  <NodeCard label="MTG₁" />
                </div>

                <Line className="left-[436px] top-[150px] h-[200px] w-[5px]" />
                <Line className="left-[436px] top-[180px] h-[5px] w-[185px]" />
                <div className="absolute left-[621px] top-[146px]">
                  <NodeCard label="UR₁" />
                </div>

                <Line className="left-[436px] top-[300px] h-[5px] w-[185px]" />
                <div className="absolute left-[621px] top-[280px]">
                  <NodeCard label="UR₂" />
                </div>

                <Line className="left-[78px] top-[404px] h-[5px] w-[210px]" />
                <div className="absolute left-[288px] top-[370px]">
                  <NodeCard label="MTG₂" />
                </div>

                <Line className="left-[436px] top-[492px] h-[5px] w-[185px]" />
                <div className="absolute left-[621px] top-[458px]">
                  <NodeCard label="UR₁" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}