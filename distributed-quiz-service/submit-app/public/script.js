async function loadCategories() {
    const response = await fetch('/categories');
    const categories = await response.json();
    const select = document.getElementById('category');
    select.innerHTML = '<option value="">Select a category</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });
  }
  
  document.getElementById('submitForm').onsubmit = async (e) => {
    e.preventDefault();
  
    const question = document.getElementById('question').value;
    const answers = [
      document.getElementById('answer1').value,
      document.getElementById('answer2').value,
      document.getElementById('answer3').value,
      document.getElementById('answer4').value,
    ];
    const correctIndex = document.querySelector('input[name="correct"]:checked')?.value;
    const category = document.getElementById('category').value;
    const newCategory = document.getElementById('newCategory').value;
  
    if (!question || answers.some(a => !a) || !correctIndex || (!category && !newCategory)) {
      document.getElementById('message').textContent = 'Please fill all fields';
      document.getElementById('message').className = 'error';
      return;
    }
  
    const data = {
      question,
      answers,
      correctAnswer: answers[correctIndex],
      category: category || null,
      newCategory: newCategory || null,
    };
  
    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        document.getElementById('message').textContent = 'Question submitted successfully!';
        document.getElementById('message').className = 'message';
        document.getElementById('submitForm').reset();
        loadCategories(); // Refresh categories after submission
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      document.getElementById('message').textContent = error.message;
      document.getElementById('message').className = 'error';
    }
  };
  
  window.onload = loadCategories;
  document.getElementById('category').onfocus = loadCategories;