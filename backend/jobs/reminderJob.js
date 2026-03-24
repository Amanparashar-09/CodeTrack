// ============================================================
// COMMIT 58 — Phase 1: Skeleton — backend/jobs/reminderJob.js
// ============================================================
// COMMIT 59 — Phase 2: Core Logic — backend/jobs/reminderJob.js
// ============================================================
// COMMIT 60 — Phase 3: Error Handling + Startup Log — backend/jobs/reminderJob.js
// ============================================================

const cron              = require('node-cron')
const { isUserInactive } = require('../utils/inactivityChecker')
const { sendReminderEmail } = require('../utils/emailSender')

// ── Dynamic import of your User model ────────────────────
// Adjust path to match your actual model location
let User
try {
  User = require('../models/User')
} catch {
  User = require('../models/user')
}

/**
 * Runs every day at 08:00 AM (server local time).
 * Finds all users with reminders enabled who haven't been
 * active in the last 24 hours and sends them a nudge email.
 */
function startReminderJob() {
  // Cron: At 08:00 every day
  cron.schedule('0 8 * * *', async () => {
    console.log('[ReminderJob] ⏰ Running at', new Date().toISOString())

    let users = []
    try {
      users = await User.find({ reminderEnabled: true })
        .select('name email lastActive currentStreak totalSolved')
        .lean()
    } catch (err) {
      console.error('[ReminderJob] ❌ DB query failed:', err.message)
      return
    }

    if (users.length === 0) {
      console.log('[ReminderJob] 📭 No users with reminders enabled.')
      return
    }

    let sent = 0, skipped = 0, failed = 0

    for (const user of users) {
      // Skip users who are still active today
      if (!isUserInactive(user)) {
        skipped++
        continue
      }

      try {
        await sendReminderEmail({
          name:   user.name,
          email:  user.email,
          streak: user.currentStreak  || 0,
          solved: user.totalSolved    || 0,
        })
        sent++
        console.log(`[ReminderJob] ✅ Email sent → ${user.email}`)
      } catch (err) {
        failed++
        console.error(`[ReminderJob] ❌ Failed for ${user.email}:`, err.message)
        // Continue to next user — don't abort the loop
      }
    }

    console.log(
      `[ReminderJob] Done — sent: ${sent}, skipped (active): ${skipped}, failed: ${failed}`
    )
  }, {
    timezone: 'Asia/Kolkata', // change to your timezone
  })

  console.log('[ReminderJob] 🟢 Scheduled — runs daily at 08:00 AM IST')
}

module.exports = { startReminderJob }
