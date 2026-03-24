// ============================================================
// COMMIT 64 — Phase 1: Skeleton — backend/utils/inactivityChecker.js
// ============================================================
// COMMIT 65 — Phase 2: Core Logic — backend/utils/inactivityChecker.js
// ============================================================
// COMMIT 66 — Phase 3: Edge cases — backend/utils/inactivityChecker.js
// ============================================================

/**
 * Determines whether a user is considered "inactive" today.
 *
 * Rules:
 *  - No lastActive at all   → inactive (never logged a problem)
 *  - Invalid date           → inactive (treat as never logged)
 *  - lastActive is today    → active   (already solved today)
 *  - lastActive < today     → inactive (needs a nudge)
 *
 * @param {{ lastActive?: Date|string|null }} user
 * @returns {boolean} true = send a reminder
 */
function isUserInactive(user) {
  // Guard: missing or null lastActive
  if (!user || !user.lastActive) return true

  const last = new Date(user.lastActive)

  // Guard: invalid date
  if (isNaN(last.getTime())) return true

  const now   = new Date()

  // Compare calendar dates (not timestamps) to handle time zones gracefully
  const todayStr = toDateStr(now)
  const lastStr  = toDateStr(last)

  // Already active today → do NOT send reminder
  if (lastStr === todayStr) return false

  // lastActive is a past date → inactive
  return true
}

/**
 * Returns 'YYYY-MM-DD' in local time for a given Date object.
 * @param {Date} date
 * @returns {string}
 */
function toDateStr(date) {
  return `${date.getFullYear()}-${
    String(date.getMonth() + 1).padStart(2, '0')}-${
    String(date.getDate()).padStart(2, '0')}`
}

module.exports = { isUserInactive, toDateStr }
