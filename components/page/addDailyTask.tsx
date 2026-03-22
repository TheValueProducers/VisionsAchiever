"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { handleAddTask, handleGetGoals } from "@/app/actions/tasks";
import { useLanguageContext } from "@/components/context/languageWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddTaskPage() {
  const { t } = useLanguageContext();
  const [task, setTask] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("");
    const [upcomingRes, setUpcomingRes] = useState<{ _id: string; name: string }[]>([]);
    const [linkedUR, setLinkedUR] = useState("");
     useEffect(() => {
      const getLTG = async () => {
        try {
          let upcomingResList = await handleGetGoals("Upcoming Responsibility");
    
          if (!upcomingResList) {
            throw new Error("Mid Term Goals are fetched unsuccessfully");
          }

              const mappedUpcomingResponsibilities = upcomingResList
                .filter((goal) => goal._id && goal.name)
                .map((goal) => ({
                  _id: goal._id as string,
                  name: goal.name as string,
                }));
              setUpcomingRes(mappedUpcomingResponsibilities);
        } catch (error) {
          console.error(error);
        }
      };
    
      getLTG();
    }, []);

  const handleSubmit = async () => {
    try {
      if (!task.trim()) {
        alert("Please enter a task name.")
        return
      }

      if (!from || !to) {
        alert("Please select both from and to times.")
        return
      }

      if (!type) {
        alert("Please select a category.")
        return
      }

      const fromDate = new Date(from)
      const toDate = new Date(to)

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        alert("Invalid date format.")
        return
      }

      if (toDate <= fromDate) {
        alert("To date must be after from date.")
        return
      }

      await handleAddTask({
        goal_type: "Daily Tasks",
        name: task.trim(),
        from: fromDate,
        to: toDate,
        goal_category: type,
      })

      alert("✅ Daily Task added successfully!")
      setTask("")
      setFrom("")
      setTo("")
      setType("")
    } catch (error) {
      console.error(error)
      alert("❌ Failed to add task. Please try again.")
    }
  }

  return (
    <div className="min-h-screen  px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-black tracking-tight text-slate-950">
              {t("dailyTask")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr]">
              <Label htmlFor="task" className="text-xl font-semibold text-slate-900">
                {t("task")}:
              </Label>
              <Input
                id="task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder={t("enterTaskName")}
                className="h-12 rounded-xl text-base"
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr]">
              <Label htmlFor="from" className="text-xl font-semibold text-slate-900">
                {t("from")}:
              </Label>
              <Input
                id="from"
                type="datetime-local"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-12 rounded-xl text-base"
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr]">
              <Label htmlFor="to" className="text-xl font-semibold text-slate-900">
                {t("to")}:
              </Label>
              <Input
                id="to"
                type="datetime-local"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-12 rounded-xl text-base"
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr]">
              <Label className="text-xl font-semibold text-slate-900">{t("category")}:</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-12 rounded-xl text-base">
                  <SelectValue placeholder={t("chooseTaskType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="problems">Problems</SelectItem>
                  <SelectItem value="learning sub-sections">Learning Sub-Sections</SelectItem>
                  <SelectItem value="exercises">Exercises</SelectItem>
                  <SelectItem value="pages">Pages</SelectItem>
                  <SelectItem value="tasks">Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr]">
              <Label className="text-xl font-semibold text-slate-900">{t("mtgLink")}:</Label>
              <Select value={linkedUR} onValueChange={setLinkedUR}>
                <SelectTrigger className="h-12 rounded-xl text-base">
                  <SelectValue placeholder={t("chooseMidTermGoal")} />
                </SelectTrigger>
                <SelectContent>
                  {upcomingRes.map((goal) => (
                    <SelectItem key={goal._id} value={goal._id}>
                      {goal.name}
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-2">
              <Button className="rounded-xl px-6" onClick={() => handleSubmit()}>
                {t("addTaskLabel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
