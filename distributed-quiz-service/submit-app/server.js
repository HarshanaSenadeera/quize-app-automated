const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

const app = express();
const PORT = 4000;


const dbConfig = {
  host: 'db', // Docker service name for the database
  user: 'root',
  password: 'root1234', 
  database: 'quiz_db',
};

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API endpoint to get categories
app.get('/categories', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT DISTINCT name FROM categories');
    await connection.end();
    const categories = rows.map(row => row.name);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// API endpoint to submit a new question
app.post('/submit', async (req, res) => {
  const { question, answers, correctAnswer, category, newCategory } = req.body;

  if (!question || !answers || answers.length !== 4 || !correctAnswer || (!category && !newCategory)) {
    return res.status(400).send('All fields are required');
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Handle category (existing or new)
    let categoryId;
    const selectedCategory = newCategory || category;
    const [catRows] = await connection.execute('SELECT id FROM categories WHERE name = ?', [selectedCategory]);
    
    if (catRows.length > 0) {
      categoryId = catRows[0].id; // Use existing category
    } else {
      const [result] = await connection.execute('INSERT INTO categories (name) VALUES (?)', [selectedCategory]);
      categoryId = result.insertId; // New category ID
    }

    // Insert question
    const [questionResult] = await connection.execute(
      'INSERT INTO questions (category_id, text, answer1, answer2, answer3, answer4, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [categoryId, question, answers[0], answers[1], answers[2], answers[3], correctAnswer]
    );

    await connection.end();
    res.status(201).send('Question submitted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Swagger documentation
const swaggerDoc = yaml.load('swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(PORT, () => {
  console.log(`Submit app running on port ${PORT}`);
});