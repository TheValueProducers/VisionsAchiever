"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getTodayTasks } from "@/app/actions/dashboard";
import { handleUpdateGoal } from "@/app/actions/tasks";
import { GoalItem } from "@/core/usecases/types/GoalQuery";
import { useLanguageContext } from "@/components/context/languageWrapper";

type TaskItem = {
  id: string;
  label: string;
  time: string;
  date: string;
  goal_type: string;
  completed: boolean;
};

type ViewMode = "list" | "calendar";

function mapGoalToTaskItem(item: GoalItem, index: number): TaskItem {
  const from = new Date(item.from);
  return {
    id: item._id ?? item.id ?? `${item.goal_type}-${index}`,
    label: item.name ?? "",
    time: from.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    date: from.toISOString().split("T")[0],
    goal_type: item.goal_type,
    completed: item.completed === "Completed",
  };
}

export default function DashboardPage() {
  const { t } = useLanguageContext();
  const [todayView, setTodayView] = useState<ViewMode>("list");
  const [upcomingView, setUpcomingView] = useState<ViewMode>("list");
  const [pastView, setPastView] = useState<ViewMode>("list");
  const [todayDate, setTodayDate] = useState<Date>(new Date());
  const [upcomingDate, setUpcomingDate] = useState<Date>(new Date());
  const [pastDate, setPastDate] = useState<Date>(new Date());
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [todayTasks, setTodayTasks] = useState<TaskItem[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<TaskItem[]>([]);
  const [pastTasks, setPastTasks] = useState<TaskItem[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoadingTasks(true);
        const { dailyTasks, upcomingResponsibilities, pastResponsibilities } = await getTodayTasks();

        const mappedTodayTasks = dailyTasks.map(mapGoalToTaskItem);
        const mappedUpcomingTasks = upcomingResponsibilities.map(mapGoalToTaskItem);
        const mappedPastTasks = pastResponsibilities.map(mapGoalToTaskItem);

        setTodayTasks(mappedTodayTasks);
        setUpcomingTasks(mappedUpcomingTasks);
        setPastTasks(mappedPastTasks);

        const initialChecked: Record<string, boolean> = {};
        mappedTodayTasks.forEach((task) => {
          initialChecked[`today-${task.id}`] = task.completed;
        });
        mappedUpcomingTasks.forEach((task) => {
          initialChecked[`upcoming-${task.id}`] = task.completed;
        });
        mappedPastTasks.forEach((task) => {
          initialChecked[`past-${task.id}`] = task.completed;
        });

        setCheckedTasks(initialChecked);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    void loadTasks();
  }, []);

  const allTasks = [...todayTasks, ...upcomingTasks, ...pastTasks];

  const toggleTask = async (prefixedId: string, checked: boolean) => {
    setCheckedTasks((prev) => ({ ...prev, [prefixedId]: checked }));

    const rawId = prefixedId.replace(/^(today|upcoming|past)-/, "");
    const task = allTasks.find((t) => t.id === rawId);
    if (!task) return;

    try {
      await handleUpdateGoal({
        goal_id: task.id,
        goal_type: task.goal_type,
        field: "completed",
        value: checked ? "Completed" : "Not Started",
      });
    } catch {
      // Revert UI state if persisting the toggle fails.
      setCheckedTasks((prev) => ({ ...prev, [prefixedId]: !checked }));
    }
  };

  const renderList = (tasks: TaskItem[], prefix: "today" | "upcoming" | "past") => {
    if (isLoadingTasks) {
      return Array.from({ length: 4 }).map((_, idx) => (
        <div key={`${prefix}-skeleton-${idx}`} className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-64" />
        </div>
      ));
    }

    return tasks.map((task) => {
      const id = `${prefix}-${task.id}`;
      return (
        <div key={id} className="flex items-center gap-3">
          <Checkbox
            id={id}
            checked={!!checkedTasks[id]}
            onCheckedChange={(checked) => toggleTask(id, checked === true)}
          />
          <Label htmlFor={id} className="text-sm leading-relaxed">
            <span className="font-medium">{task.time}</span> - {task.label}
          </Label>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen w-full p-6 md:p-8 z-1 ">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <section className="space-y-4">
          <Card className="border-border/60 bg-card/70 z-1">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b">
              <CardTitle className="text-lg">{t("todaysTaskList")}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onSelect={() => setTodayView("list")}>
                    {t("viewInList")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setTodayView("calendar")}>
                    {t("viewInCalendar")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">{renderList(todayTasks, "today")}</CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <Card className="border-border/60 bg-card/70 z-1">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b">
              <CardTitle className="text-lg">{t("upcomingResponsibilities")}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onSelect={() => setUpcomingView("list")}>
                    {t("viewInList")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setUpcomingView("calendar")}>
                    {t("viewInCalendar")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">{renderList(upcomingTasks, "upcoming")}</CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <Card className="border-border/60 bg-card/70 z-1">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b">
              <CardTitle className="text-lg">{t("pastResponsibilities")}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onSelect={() => setPastView("list")}>
                    {t("viewInList")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setPastView("calendar")}>
                    {t("viewInCalendar")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">{renderList(pastTasks, "past")}</CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
