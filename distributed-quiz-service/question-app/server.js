console.log('Starting question-app server...');

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

console.log('Dependencies loaded');

const app = express();
const PORT = 3000;

const dbConfig = {
  host: 'db',
  user: 'root',
  password: 'root1234',
  database: 'quiz_db',
};

console.log('Express app initialized');

app.use(express.static(path.join(__dirname, 'public')));
console.log('Static middleware set');

app.get('/categories', async (req, res) => {
  try {
    console.log('Handling /categories request');
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT DISTINCT name FROM categories');
    await connection.end();
    const categories = rows.map(row => row.name);
    res.json(categories);
  } catch (error) {
    console.error('Error in /categories:', error);
    res.status(500).send('Server error');
  }
});

app.get('/question/:category', async (req, res) => {
  const category = req.params.category;
  const count = Number.parseInt(req.query.count) || 1;

  console.log(`Request received for category: ${category}, count: ${count}`);

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established');

    const [rows] = await connection.execute(
      `SELECT q.id, q.text, q.answer1, q.answer2, q.answer3, q.answer4, q.correct_answer 
       FROM questions q JOIN categories c ON q.category_id = c.id 
       WHERE c.name = ? ORDER BY RAND() LIMIT ${count}`,
      [category]
    );
    console.log(`Query executed, found ${rows.length} rows:`, rows);

    await connection.end();
    console.log('Database connection closed');

    if (rows.length === 0) {
      console.log('No questions found for category:', category);
      return res.status(404).send('No questions found for this category');
    }

    const questions = rows.map(row => {
      console.log('Processing row:', row);
      const answers = [row.answer1, row.answer2, row.answer3, row.answer4];
      const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
      return {
        id: row.id,
        text: row.text,
        answers: shuffledAnswers,
        correctAnswer: row.correct_answer,
      };
    });

    console.log('Sending response:', count === 1 ? questions[0] : questions);
    res.json(count === 1 ? questions[0] : questions);
  } catch (error) {
    console.error('Error in /question endpoint:', error);
    res.status(500).send('Server error');
  }
});

console.log('About to start server...');
app.listen(PORT, () => {
  console.log(`Question app running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});