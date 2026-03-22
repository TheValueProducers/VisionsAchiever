"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { getTasksCompletedGraph, getProductivityGraph } from "@/app/actions/progress";
import { useLanguageContext } from "@/components/context/languageWrapper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

// ------------------------------------------------------------------
// Sample data
// ------------------------------------------------------------------
type MetricView = "12-days" | "12-weeks" | "12-months" | "max-years";

type MetricPoint = {
  label: string;
  value: number;
};

type TimePeriod = "Daily" | "Weekly" | "Monthly" | "Yearly";

type GroupedGraphValues = Record<TimePeriod, string[] | number[]>;

const metricViewOptions: Array<{ value: MetricView; label: string }> = [
  { value: "12-days", label: "12 days view" },
  { value: "12-weeks", label: "12 weeks view" },
  { value: "12-months", label: "12 months view" },
  { value: "max-years", label: "max years view" },
];

const emptyMetricViewData: Record<MetricView, MetricPoint[]> = {
  "12-days": [],
  "12-weeks": [],
  "12-months": [],
  "max-years": [],
};

const completionRateData = [
  { name: "Completed", value: 74, fill: "hsl(var(--color-completed))" },
  { name: "Pending", value: 26, fill: "hsl(var(--color-pending))" },
];

const chartConfig = {
  completed: {
    theme: { light: "hsl(220 90% 56%)", dark: "hsl(220 80% 60%)" },
  },
  pending: {
    theme: { light: "hsl(0 0% 80%)", dark: "hsl(0 0% 40%)" },
  },
  score: {
    theme: { light: "hsl(142 72% 42%)", dark: "hsl(142 60% 50%)" },
  },
};

// ------------------------------------------------------------------
// Initial statistics items
// ------------------------------------------------------------------
const defaultStats = [
  "74% of this week's tasks were completed on time.",
  "Average daily task count: 6 tasks per day.",
  "Highest productivity recorded on Thursday this week.",
  "You have 3 upcoming tasks due within the next 24 hours.",
  "Streak: 5 consecutive days with at least 1 completed task.",
];

const metricViewPeriodMap: Record<MetricView, TimePeriod> = {
  "12-days": "Daily",
  "12-weeks": "Weekly",
  "12-months": "Monthly",
  "max-years": "Yearly",
};

function buildMetricViewData(
  xValuesByPeriod: GroupedGraphValues,
  yValuesByPeriod: GroupedGraphValues
): Record<MetricView, MetricPoint[]> {
  const viewData = { ...emptyMetricViewData };

  for (const [view, period] of Object.entries(metricViewPeriodMap) as Array<[MetricView, TimePeriod]>) {
    const labels = (xValuesByPeriod[period] ?? []) as string[];
    const values = (yValuesByPeriod[period] ?? []) as number[];

    viewData[view] = labels.map((label, index) => ({
      label,
      value: values[index] ?? 0,
    }));
  }

  return viewData;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function ProgressPage() {
  const { t, language } = useLanguageContext();
  const [metrics, setMetrics] = useState<string[]>([]);
  const [stats, setStats] = useState<string[]>(
    language === "vietnamese"
      ? [
          "74% cong viec tuan nay da hoan thanh dung han.",
          "So cong viec trung binh moi ngay: 6.",
          "Ngay nang suat cao nhat trong tuan la Thu nam.",
          "Ban co 3 cong viec sap den han trong 24 gio toi.",
          "Chuoi: 5 ngay lien tiep co it nhat 1 cong viec hoan thanh.",
        ]
      : language === "spanish"
        ? [
            "El 74% de las tareas de esta semana se completaron a tiempo.",
            "Promedio diario: 6 tareas por dia.",
            "La mayor productividad fue el jueves.",
            "Tienes 3 tareas proximas dentro de 24 horas.",
            "Racha: 5 dias consecutivos con al menos 1 tarea completada.",
          ]
        : language === "chinese"
          ? [
              "本周 74% 的任务按时完成。",
              "平均每天任务数：6。",
              "本周最高效率出现在周四。",
              "未来 24 小时内有 3 个即将到期的任务。",
              "连续 5 天至少完成 1 个任务。",
            ]
          : defaultStats
  );
  const [tasksMetricView, setTasksMetricView] = useState<MetricView>("12-days");
  const [productivityMetricView, setProductivityMetricView] = useState<MetricView>("12-days");
  const [tasksCompletedDataByView, setTasksCompletedDataByView] =
    useState<Record<MetricView, MetricPoint[]>>(emptyMetricViewData);
  const [productivityDataByView, setProductivityDataByView] =
    useState<Record<MetricView, MetricPoint[]>>(emptyMetricViewData);
  const [isLoadingGraphs, setIsLoadingGraphs] = useState(true);
  const [graphError, setGraphError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasksGraph = async () => {
      try {
        setIsLoadingGraphs(true);
        setGraphError(null);
        const period = metricViewPeriodMap[tasksMetricView];
        const tasksCompletedGraph = await getTasksCompletedGraph(period);
        setTasksCompletedDataByView(
          buildMetricViewData(tasksCompletedGraph.x_values, tasksCompletedGraph.y_values)
        );
      } catch (error) {
        console.error(error);
        setGraphError(t("failedLoadTasksGraph"));
      } finally {
        setIsLoadingGraphs(false);
      }
    };
    void loadTasksGraph();
  }, [tasksMetricView]);

  useEffect(() => {
    const loadProductivityGraph = async () => {
      try {
        setIsLoadingGraphs(true);
        setGraphError(null);
        const period = metricViewPeriodMap[productivityMetricView];
        const productivityGraph = await getProductivityGraph(period);
        setProductivityDataByView(
          buildMetricViewData(productivityGraph.x_values, productivityGraph.y_values)
        );
      } catch (error) {
        console.error(error);
        setGraphError(t("failedLoadProductivityGraph"));
      } finally {
        setIsLoadingGraphs(false);
      }
    };
    void loadProductivityGraph();
  }, [productivityMetricView]);

  return (
    <div className="min-h-screen w-full p-6 md:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-12">
        {/* ── Metrics ─────────────────────────────────────────────── */}
        <section className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight">{t("metrics")}</h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Tasks completed per day – Bar */}
            <Card className="border-border/60 bg-card/70 md:col-span-3 xl:col-span-3">
              <CardHeader>
                <div className="space-y-3">
                  <CardTitle className="text-base">{t("tasksCompletedPerDay")}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {metricViewOptions.map((option) => (
                      <Button
                        key={`tasks-${option.value}`}
                        type="button"
                        size="sm"
                        variant={tasksMetricView === option.value ? "default" : "outline"}
                        onClick={() => setTasksMetricView(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                  <BarChart data={tasksCompletedDataByView[tasksMetricView]}>
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(220 90% 56%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Weekly productivity score – Line */}
            <Card className="border-border/60 bg-card/70 md:col-span-3 xl:col-span-3">
              <CardHeader>
                <div className="space-y-3">
                  <CardTitle className="text-base">{t("dailyProductivityScore")}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {metricViewOptions.map((option) => (
                      <Button
                        key={`productivity-${option.value}`}
                        type="button"
                        size="sm"
                        variant={productivityMetricView === option.value ? "default" : "outline"}
                        onClick={() => setProductivityMetricView(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                  <LineChart data={productivityDataByView[productivityMetricView]}>
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(142 72% 42%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

          </div>

          {isLoadingGraphs && <p className="text-sm text-muted-foreground">{t("loadingMetricGraphs")}</p>}
          {graphError && <p className="text-sm text-red-600">{graphError}</p>}

          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => setMetrics((prev) => [...prev, `Metric ${prev.length + 1}`])}
          >
            <Plus className="size-4" />
            {t("createMetric")}
          </Button>
        </section>

        {/* ── Statistics ──────────────────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">{t("statistics")}</h2>

          <Card className="border-border/60 bg-card/70">
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {stats.map((phrase, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    {phrase}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() =>
              setStats((prev) => [...prev, `New statistic ${prev.length - defaultStats.length + 1}`])
            }
          >
            <Plus className="size-4" />
            Create Statistics
          </Button>
        </section>
      </div>
    </div>
  );
}
