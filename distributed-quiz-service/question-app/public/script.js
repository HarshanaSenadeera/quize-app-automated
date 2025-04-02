// async function loadCategories() {
//     const response = await fetch('/categories');
//     const categories = await response.json();
//     const select = document.getElementById('category');
//     select.innerHTML = '<option value="">Select a category</option>';
//     categories.forEach(cat => {
//       const option = document.createElement('option');
//       option.value = cat;
//       option.textContent = cat;
//       select.appendChild(option);
//     });
//   }
  
//   async function getQuestion() {
//     const category = document.getElementById('category').value;
//     if (!category) {
//       alert('Please select a category');
//       return;
//     }
  
//     const response = await fetch(`/question/${category}`);
//     const question = await response.json();
  
//     document.getElementById('question').textContent = question.text;
//     const answersDiv = document.getElementById('answers');
//     answersDiv.innerHTML = '';
  
//     question.answers.forEach((answer, index) => {
//       const div = document.createElement('div');
//       div.textContent = answer;
//       div.className = 'answer';
//       div.onclick = () => checkAnswer(answer, question.correctAnswer, div);
//       answersDiv.appendChild(div);
//     });
//   }
  
//   function checkAnswer(selected, correct, element) {
//     if (selected === correct) {
//       element.classList.add('correct');
//     } else {
//       element.classList.add('wrong');
//     }
//   }
  
//   window.onload = loadCategories;
//   document.getElementById('category').onfocus = loadCategories; // Refresh categories on focus


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

async function getQuestion() {
  const category = document.getElementById('category').value;
  if (!category) {
    alert('Please select a category');
    return;
  }

  const response = await fetch(`/question/${category}`);
  const question = await response.json();

  document.getElementById('question').textContent = question.text;
  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';

  question.answers.forEach((answer, index) => {
    const div = document.createElement('div');
    div.textContent = answer;
    div.className = 'answer';
    div.onclick = () => checkAnswer(answer, question.correctAnswer, div);
    answersDiv.appendChild(div);
  });
}

function checkAnswer(selected, correct, element) {
  if (selected === correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

window.onload = loadCategories;
document.getElementById('category').onfocus = loadCategories;