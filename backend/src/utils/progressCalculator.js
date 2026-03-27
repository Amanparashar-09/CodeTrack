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

module.exports = {
  getPointsForDifficulty,
  getStreakAfterSolve,
};
