const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Question = require('../models/Question');

const sampleQuestions = [
  {
    questionText: "What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?",
    options: [
      { key: "A", text: "O(1)" },
      { key: "B", text: "O(n)" },
      { key: "C", text: "O(log n)" },
      { key: "D", text: "O(n log n)" }
    ],
    correctOptionKey: "C",
    marks: 1,
    order: 1
  },
  {
    questionText: "Which HTTP status code represents '404'?",
    options: [
      { key: "A", text: "Internal Server Error" },
      { key: "B", text: "Not Found" },
      { key: "C", text: "Unauthorized" },
      { key: "D", text: "Bad Gateway" }
    ],
    correctOptionKey: "B",
    marks: 1,
    order: 2
  },
  {
    questionText: "In JavaScript, which array method creates a new array with all elements that pass a test?",
    options: [
      { key: "A", text: "map()" },
      { key: "B", text: "forEach()" },
      { key: "C", text: "filter()" },
      { key: "D", text: "reduce()" }
    ],
    correctOptionKey: "C",
    marks: 1,
    order: 3
  },
  {
    questionText: "What does HTML stand for in web development?",
    options: [
      { key: "A", text: "Hyper Text Markup Language" },
      { key: "B", text: "High Tech Modern Language" },
      { key: "C", text: "Hyperlink and Text Transfer Language" },
      { key: "D", text: "Home Tool Markup Language" }
    ],
    correctOptionKey: "A",
    marks: 1,
    order: 4
  },
  {
    questionText: "Which data structure follows the Last-In, First-Out (LIFO) principle?",
    options: [
      { key: "A", text: "Queue" },
      { key: "B", text: "Stack" },
      { key: "C", text: "Linked List" },
      { key: "D", text: "Binary Tree" }
    ],
    correctOptionKey: "B",
    marks: 1,
    order: 5
  },
  {
    questionText: "What command in Git is used to record changes to the repository?",
    options: [
      { key: "A", text: "git push" },
      { key: "B", text: "git pull" },
      { key: "C", text: "git commit" },
      { key: "D", text: "git status" }
    ],
    correctOptionKey: "C",
    marks: 1,
    order: 6
  },
  {
    questionText: "In CSS, which property controls the space inside an element's border?",
    options: [
      { key: "A", text: "margin" },
      { key: "B", text: "padding" },
      { key: "C", text: "border-spacing" },
      { key: "D", text: "gap" }
    ],
    correctOptionKey: "B",
    marks: 1,
    order: 7
  },
  {
    questionText: "Which of the following is NOT a relational database management system (RDBMS)?",
    options: [
      { key: "A", text: "PostgreSQL" },
      { key: "B", text: "MySQL" },
      { key: "C", text: "MongoDB" },
      { key: "D", text: "SQLite" }
    ],
    correctOptionKey: "C",
    marks: 1,
    order: 8
  },
  {
    questionText: "What is the primary purpose of the 'useEffect' hook in React?",
    options: [
      { key: "A", text: "To manage component local state" },
      { key: "B", text: "To perform side effects in functional components" },
      { key: "C", text: "To memoize expensive calculations" },
      { key: "D", text: "To create context providers" }
    ],
    correctOptionKey: "B",
    marks: 1,
    order: 9
  },
  {
    questionText: "In Python, which built-in function returns the length of an object?",
    options: [
      { key: "A", text: "size()" },
      { key: "B", text: "count()" },
      { key: "C", text: "len()" },
      { key: "D", text: "length()" }
    ],
    correctOptionKey: "C",
    marks: 1,
    order: 10
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/funtech-quiz';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing question pool...');
    await Question.deleteMany({});

    console.log('Seeding sample questions...');
    await Question.insertMany(sampleQuestions);

    console.log('✅ Successfully seeded 10 sample questions into MongoDB database!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
