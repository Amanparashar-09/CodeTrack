require("dotenv").config();

const connectDB = require("../config/db");
const QuestionBank = require("../models/QuestionBank");
const predefinedQuestions = require("./predefinedQuestions.data");

const normalizeQuestion = (question) => ({
  title: String(question.title || "").trim(),
  platform: String(question.platform || "").trim(),
  difficulty: question.difficulty || "Easy",
  tags: Array.isArray(question.tags) ? question.tags : [],
  url: question.url || "",
  isPredefined: true,
});

const buildOperations = (questions) => {
  return questions
    .map(normalizeQuestion)
    .filter((q) => q.title && q.platform)
    .map((q) => ({
      updateOne: {
        filter: { title: q.title, platform: q.platform },
        update: { $set: q },
        upsert: true,
      },
    }));
};

const seedQuestionBank = async () => {
  await connectDB();

  const operations = buildOperations(predefinedQuestions);
  if (operations.length === 0) {
    console.log("No predefined questions found to seed.");
    process.exit(0);
  }

  const result = await QuestionBank.bulkWrite(operations, { ordered: false });

  const total = await QuestionBank.countDocuments({ isPredefined: true });

  console.log("Question bank seeded.");
  console.log(`Inserted: ${result.upsertedCount || 0}`);
  console.log(`Updated: ${result.modifiedCount || 0}`);
  console.log(`Total predefined questions: ${total}`);

  process.exit(0);
};

seedQuestionBank().catch((error) => {
  console.error("Failed to seed question bank:", error.message);
  process.exit(1);
});
