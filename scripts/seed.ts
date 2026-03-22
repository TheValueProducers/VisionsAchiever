/**
 * Seed script – populates Daily Tasks, Upcoming Responsibilities,
 * Mid Term Goals, and Long Term Goals for a given user.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires MONGO_URI in .env.local (loaded automatically via dotenv).
 */

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import mongoose from "mongoose";

// ---------------------------------------------------------------------------
// Inline model definitions (avoids Next.js-only module aliases at script time)
// ---------------------------------------------------------------------------

const longTermGoalSchema = new mongoose.Schema({
  ltg_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  to: { type: Date, required: true },
  completed: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
    default: "Not Started",
  },
});

const midTermGoalSchema = new mongoose.Schema({
  mtg_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  to: { type: Date, required: true },
  completed: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
    default: "Not Started",
  },
  ltg_id: { type: String, required: false },
  category: {
    type: String,
    enum: ["classes", "courses", "work out goals", "books", "mid term goals"],
    required: true,
  },
});

const upcomingResponsibilitySchema = new mongoose.Schema({
  ur_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  to: { type: Date, required: true },
  completed: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
    default: "Not Started",
  },
  mtg_id: { type: String, required: false },
  category: {
    type: String,
    enum: [
      "problem sets",
      "learning sections",
      "workouts",
      "chapters",
      "upcoming responsibilities",
    ],
    required: true,
  },
});

const dailyTaskSchema = new mongoose.Schema({
  task_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  completed: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
    default: "Not Started",
  },
  ur_id: { type: String, required: false },
  category: {
    type: String,
    enum: ["problems", "learning sub-sections", "exercises", "pages", "tasks"],
    required: true,
  },
});

const LTGModel =
  mongoose.models.LongTermGoal ||
  mongoose.model("LongTermGoal", longTermGoalSchema);

const MTGModel =
  mongoose.models.MidTermGoal ||
  mongoose.model("MidTermGoal", midTermGoalSchema);

const URModel =
  mongoose.models.UpcomingResponsibility ||
  mongoose.model("UpcomingResponsibility", upcomingResponsibilitySchema);

const DTModel =
  mongoose.models.DailyTask ||
  mongoose.model("DailyTask", dailyTaskSchema);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uid(): string {
  return crypto.randomUUID();
}

/** Returns a Date offset by `days` days from today at midnight. */
function daysFrom(days: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

/** Returns a Date offset by `months` months from today's first day. */
function monthsFrom(months: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  return d;
}

/** Returns a Date offset by `years` years from today. */
function yearsFrom(years: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const USER_ID = "69bdafa12981597b50591d07";

// Long Term Goals
const ltg1Id = `ltg-${uid()}`;
const ltg2Id = `ltg-${uid()}`;

const longTermGoals = [
  {
    ltg_id: ltg1Id,
    user_id: USER_ID,
    name: "Become a Full-Stack Software Engineer",
    to: yearsFrom(3),
    completed: "In Progress",
  },
  {
    ltg_id: ltg2Id,
    user_id: USER_ID,
    name: "Achieve Physical Fitness Peak",
    to: yearsFrom(2),
    completed: "Not Started",
  },
];

// Mid Term Goals (linked to LTGs)
const mtg1Id = `mtg-${uid()}`;
const mtg2Id = `mtg-${uid()}`;
const mtg3Id = `mtg-${uid()}`;
const mtg4Id = `mtg-${uid()}`;

const midTermGoals = [
  {
    mtg_id: mtg1Id,
    user_id: USER_ID,
    name: "Complete Advanced TypeScript Course",
    to: monthsFrom(3),
    completed: "In Progress",
    ltg_id: ltg1Id,
    category: "courses",
  },
  {
    mtg_id: mtg2Id,
    user_id: USER_ID,
    name: "Build and Deploy a SaaS Product",
    to: monthsFrom(9),
    completed: "Not Started",
    ltg_id: ltg1Id,
    category: "mid term goals",
  },
  {
    mtg_id: mtg3Id,
    user_id: USER_ID,
    name: "Complete 12-Week Strength Program",
    to: monthsFrom(3),
    completed: "In Progress",
    ltg_id: ltg2Id,
    category: "work out goals",
  },
  {
    mtg_id: mtg4Id,
    user_id: USER_ID,
    name: "Read 6 Books on Productivity & Health",
    to: monthsFrom(6),
    completed: "Not Started",
    ltg_id: ltg2Id,
    category: "books",
  },
];

// Upcoming Responsibilities (linked to MTGs)
const ur1Id = `ur-${uid()}`;
const ur2Id = `ur-${uid()}`;
const ur3Id = `ur-${uid()}`;
const ur4Id = `ur-${uid()}`;
const ur5Id = `ur-${uid()}`;
const ur6Id = `ur-${uid()}`;

const upcomingResponsibilities = [
  {
    ur_id: ur1Id,
    user_id: USER_ID,
    name: "Complete TypeScript Generics Module",
    to: daysFrom(4),
    completed: "In Progress",
    mtg_id: mtg1Id,
    category: "learning sections",
  },
  {
    ur_id: ur2Id,
    user_id: USER_ID,
    name: "Solve 20 Algorithm Problems on LeetCode",
    to: daysFrom(7),
    completed: "Not Started",
    mtg_id: mtg1Id,
    category: "problem sets",
  },
  {
    ur_id: ur3Id,
    user_id: USER_ID,
    name: "Write SaaS Product Architecture Document",
    to: daysFrom(7),
    completed: "Not Started",
    mtg_id: mtg2Id,
    category: "upcoming responsibilities",
  },
  {
    ur_id: ur4Id,
    user_id: USER_ID,
    name: "Week 4 Strength Training Sessions",
    to: daysFrom(6),
    completed: "In Progress",
    mtg_id: mtg3Id,
    category: "workouts",
  },
  {
    ur_id: ur5Id,
    user_id: USER_ID,
    name: "Finish Reading Atomic Habits",
    to: daysFrom(5),
    completed: "Not Started",
    mtg_id: mtg4Id,
    category: "chapters",
  },
  {
    ur_id: ur6Id,
    user_id: USER_ID,
    name: "Review Deep Work Key Chapters",
    to: daysFrom(3),
    completed: "Not Started",
    mtg_id: mtg4Id,
    category: "chapters",
  },
];

// Daily Tasks (linked to URs, scheduled to today)
const today = new Date();
today.setSeconds(0, 0);

function todayAt(hour: number, minute: number = 0): Date {
  const d = new Date(today);
  d.setHours(hour, minute, 0, 0);
  return d;
}

const dailyTasks = [
  {
    task_id: `task-${uid()}`,
    user_id: USER_ID,
    name: "Study TypeScript Generics – Chapter 4",
    from: todayAt(8),
    to: todayAt(9),
    completed: "Not Started",
    ur_id: ur1Id,
    category: "learning sub-sections",
  },
  {
    task_id: `task-${uid()}`,
    user_id: USER_ID,
    name: "Solve 5 LeetCode problems (arrays)",
    from: todayAt(9, 30),
    to: todayAt(10, 30),
    completed: "Not Started",
    ur_id: ur2Id,
    category: "problems",
  },
  {
    task_id: `task-${uid()}`,
    user_id: USER_ID,
    name: "Draft SaaS product feature list",
    from: todayAt(11),
    to: todayAt(12),
    completed: "Not Started",
    ur_id: ur3Id,
    category: "tasks",
  },
  {
    task_id: `task-${uid()}`,
    user_id: USER_ID,
    name: "Morning strength workout (upper body)",
    from: todayAt(6),
    to: todayAt(7),
    completed: "Completed",
    ur_id: ur4Id,
    category: "exercises",
  },
  {
    task_id: `task-${uid()}`,
    user_id: USER_ID,
    name: "Read Atomic Habits – pages 80–110",
    from: todayAt(20),
    to: todayAt(21),
    completed: "Not Started",
    ur_id: ur5Id,
    category: "pages",
  },
  {
    task_id: `task-${uid()}`,
    user_id: USER_ID,
    name: "Review Deep Work chapter 2 notes",
    from: todayAt(21, 30),
    to: todayAt(22),
    completed: "Not Started",
    ur_id: ur6Id,
    category: "learning sub-sections",
  },
  {
    task_id: `task-${uid()}`,
    user_id: USER_ID,
    name: "Write daily standup summary",
    from: todayAt(17),
    to: todayAt(17, 30),
    completed: "Not Started",
    ur_id: undefined,
    category: "tasks",
  },
  {
    task_id: `task-${uid()}`,
    user_id: USER_ID,
    name: "Plan tomorrow's schedule",
    from: todayAt(22, 30),
    to: todayAt(23),
    completed: "Not Started",
    ur_id: undefined,
    category: "tasks",
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seed() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌  MONGO_URI is not set in .env.local");
    process.exit(1);
  }

  console.log("🔌  Connecting to MongoDB…");
  await mongoose.connect(mongoUri);
  console.log("✅  Connected");

  try {
    console.log("\n📦  Seeding Long Term Goals…");
    const ltgResult = await LTGModel.insertMany(longTermGoals, { ordered: false });
    console.log(`   ✅  Inserted ${ltgResult.length} Long Term Goals`);

    console.log("📦  Seeding Mid Term Goals…");
    const mtgResult = await MTGModel.insertMany(midTermGoals, { ordered: false });
    console.log(`   ✅  Inserted ${mtgResult.length} Mid Term Goals`);

    console.log("📦  Seeding Upcoming Responsibilities…");
    const urResult = await URModel.insertMany(upcomingResponsibilities, { ordered: false });
    console.log(`   ✅  Inserted ${urResult.length} Upcoming Responsibilities`);

    console.log("📦  Seeding Daily Tasks…");
    const dtResult = await DTModel.insertMany(dailyTasks, { ordered: false });
    console.log(`   ✅  Inserted ${dtResult.length} Daily Tasks`);

    console.log("\n🎉  Seed complete!");
  } catch (error: any) {
    if (error.code === 11000) {
      console.warn("⚠️   Some documents were skipped (duplicate keys). Re-run is safe.");
    } else {
      console.error("❌  Seed failed:", error);
      process.exit(1);
    }
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB");
  }
}

seed();