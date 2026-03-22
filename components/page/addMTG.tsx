"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { handleAddTask, handleGetGoals, handleUpdateGoal } from "@/app/actions/tasks";
import { useLanguageContext } from "@/components/context/languageWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddMTG() {
  const { t } = useLanguageContext();
  const [task, setTask] = useState("");
  const [longTermGoals, setLongTermGoals] = useState<{ _id: string; name: string }[]>([]);
  const [due, setDue] = useState("");
  const [type, setType] = useState("");
  const [linkedLTG, setLinkedLTG] = useState("");

 useEffect(() => {
  const getLTG = async () => {
    try {
      let longTermGoalList = await handleGetGoals("Long Term Goal");

      if (!longTermGoalList) {
        throw new Error("Long Term Goals are fetched unsuccessfully");
      }

      const mappedLongTermGoals = longTermGoalList
        .filter((goal) => goal._id && goal.name)
        .map((goal) => ({
          _id: goal._id as string,
          name: goal.name as string,
        }));
      setLongTermGoals(mappedLongTermGoals);
    } catch (error) {
      console.error(error);
    }
  };

  getLTG();
}, []);

  const handleSubmit = async () => {
    try {
      if (!task.trim()) {
        alert("Please enter a goal name.")
        return
      }

      if (!due) {
        alert("Please select a due date.")
        return
      }

      if (!type) {
        alert("Please select a category.")
        return
      }

      const parsedDate = new Date(due)

      if (isNaN(parsedDate.getTime())) {
        alert("Invalid date format.")
        return
      }

      if (parsedDate < new Date()) {
        alert("Due date cannot be in the past.")
        return
      }

      await handleAddTask({
        goal_type: "Mid Term Goal",
        name: task.trim(),
        to: parsedDate,
        goal_category: type,
        ltg_id: linkedLTG
      })

      alert("✅ Mid Term Goal added successfully!")
      setTask("")
      setDue("")
      setType("")
    } catch (error) {
      console.error(error)
      alert("❌ Failed to add goal. Please try again.")
    }
  }

  return (
    <div className="min-h-screen  px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-black tracking-tight text-slate-950">
              {t("addMidTermGoal")}
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
                {t("due")}:
              </Label>
              <Input
                id="from"
                type="datetime-local"
                value={due}
                onChange={(e) => setDue(e.target.value)}
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
                  <SelectItem value="classes">Classes</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                  <SelectItem value="work out goals">Work Out Goals</SelectItem>
                  <SelectItem value="mid term goals">Mid Term Goals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr]">
              <Label className="text-xl font-semibold text-slate-900">{t("ltgLink")}:</Label>
              <Select value={linkedLTG} onValueChange={setLinkedLTG}>
                <SelectTrigger className="h-12 rounded-xl text-base">
                  <SelectValue placeholder={t("chooseLongTermGoal")} />
                </SelectTrigger>
                <SelectContent>
                  {longTermGoals.map((goal) => (
                    <SelectItem key={goal._id} value={goal._id}>
                      {goal.name}
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-2">
              <Button className="rounded-xl px-6" onClick={() => handleSubmit()}>
                {t("addMidTermGoal")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
