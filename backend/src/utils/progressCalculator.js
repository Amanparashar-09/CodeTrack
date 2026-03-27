const getPointsForDifficulty = (difficulty) => {
  if (difficulty === "Hard") return 30;
  if (difficulty === "Medium") return 20;
  return 10;
};

const toDateKey = (dateValue) => {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const getStreakAfterSolve = (lastActive, currentStreak) => {
  const now = new Date();

  if (!lastActive) {
    return { streak: 1, shouldUpdateLastActive: true };
  }

  const last = new Date(lastActive);
  if (Number.isNaN(last.getTime())) {
    return { streak: 1, shouldUpdateLastActive: true };
  }

  const todayKey = toDateKey(now);
  const lastKey = toDateKey(last);

  if (todayKey === lastKey) {
    return { streak: currentStreak || 1, shouldUpdateLastActive: false };
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (toDateKey(yesterday) === lastKey) {
    return { streak: (currentStreak || 0) + 1, shouldUpdateLastActive: true };
  }

  return { streak: 1, shouldUpdateLastActive: true };
};

const buildProgressStats = (problems) => {
  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  const byTag = {};

  let totalAttempted = 0;
  let totalSolved = 0;

  for (const problem of problems) {
    const status = problem.status || "Unsolved";
    const difficulty = problem.difficulty || "Easy";

    if (status !== "Unsolved") {
      totalAttempted += 1;
    }

    if (status === "Solved") {
      totalSolved += 1;

      if (difficulty === "Easy") byDifficulty.easy += 1;
      if (difficulty === "Medium") byDifficulty.medium += 1;
      if (difficulty === "Hard") byDifficulty.hard += 1;
    }

    for (const tag of problem.tags || []) {
      byTag[tag] = (byTag[tag] || 0) + 1;
    }
  }

  const accuracy =
    totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;

  return {
    easy: byDifficulty.easy,
    medium: byDifficulty.medium,
    hard: byDifficulty.hard,
    byDifficulty,
    byTag,
    totalAttempted,
    totalSolved,
    accuracy,
  };
};

module.exports = {
  getPointsForDifficulty,
  getStreakAfterSolve,
  buildProgressStats,
};
