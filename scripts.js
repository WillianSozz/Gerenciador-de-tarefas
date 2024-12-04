// Seleciona elementos do DOM
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskAssignee = document.getElementById("taskAssignee");  // Responsável
const taskList = document.getElementById("taskList");

// Lista de possíveis responsáveis (testers)
const testers = ["Paulo", "Augusto", "Gabriel", "Willian", "Rafael"];

// Lista de possíveis estados
const statuses = ["PENDENTE", "TESTANDO", "RECUSADO", "FILA DE ATUALIZAÇÃO", "CONCLUÍDO"];

// Inicializa a lista de tarefas
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Função para salvar tarefas no LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Função para renderizar as tarefas na tela
function renderTasks() {
  taskList.innerHTML = ""; // Limpa a lista antes de renderizar
  tasks.forEach((task, index) => {
    // Cria um card para cada tarefa
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    // Adiciona HTML dinâmico para o card
    taskCard.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <div class="assignee">
        <strong>Responsáveis:</strong> ${task.assignee || "Nenhum responsável"}<br><br><hr><br><br>
        <strong>Testado por:</strong>
        <div>
          ${testers
            .map(
              (tester) => `
            <label>
              <br><input type="checkbox" class="tester-checkbox" data-index="${index}" data-name="${tester}" ${
                task.testedBy.includes(tester) ? "checked" : ""
              }>
              ${tester}
            </label>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div class="task-status">
        <strong>Estados da Tarefa:</strong>
        <div>
          ${statuses
            .map(
              (status) => `
            <label>
              <br><input type="checkbox" class="status-checkbox" data-index="${index}" data-name="${status}" ${
                task.statuses.includes(status) ? "checked" : ""
              }>
              ${status}
            </label>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="comments">
        <strong>Comentários:</strong>
        <div class="comment-list">
          ${task.comments.map(comment => `<p>${comment}</p>`).join('')}
        </div>
        <textarea class="comment-input" placeholder="Adicionar um comentário"></textarea>
        <button class="add-comment-btn" data-index="${index}">Comentar</button>
        <button class="delete-btn" data-index="${index}">Excluir</button>
      </div>
    `;

    // Adiciona evento de exclusão
    taskCard.querySelector(".delete-btn").addEventListener("click", function () {
      deleteTask(index);
    });

    // Adiciona evento para adicionar comentários
    taskCard.querySelector(".add-comment-btn").addEventListener("click", function () {
      const commentInput = taskCard.querySelector(".comment-input");
      const newComment = commentInput.value.trim();
      if (newComment) {
        addComment(index, newComment);
        commentInput.value = ""; // Limpa o campo de comentário
      }
    });

    // Adiciona eventos para marcar responsáveis
    const testerCheckboxes = taskCard.querySelectorAll(".tester-checkbox");
    testerCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function (event) {
        updateTestedBy(index, event.target.dataset.name, event.target.checked);
      });
    });

    // Adiciona eventos para os estados
    const statusCheckboxes = taskCard.querySelectorAll(".status-checkbox");
    statusCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function (event) {
        updateStatuses(index, event.target.dataset.name, event.target.checked);
      });
    });

    // Adiciona o card à lista
    taskList.appendChild(taskCard);
  });
}

// Função para adicionar uma nova tarefa
function addTask(title, description, assignee) {
  tasks.push({
    title,
    description,
    assignee: assignee || "Nenhum responsável",
    testedBy: [],  // Responsáveis pela tarefa
    statuses: [],  // Estados da tarefa
    comments: []   // Comentários da tarefa
  });
  saveTasks(); // Salva as alterações
  renderTasks(); // Re-renderiza as tarefas
}

// Função para atualizar quem testou a tarefa
function updateTestedBy(index, name, isChecked) {
  if (isChecked) {
    // Adiciona o responsável à lista de responsáveis
    tasks[index].testedBy.push(name);
  } else {
    // Remove o responsável da lista de responsáveis
    tasks[index].testedBy = tasks[index].testedBy.filter((tester) => tester !== name);
  }
  saveTasks(); // Salva as alterações
  renderTasks(); // Re-renderiza as tarefas
}

// Função para atualizar os estados da tarefa
function updateStatuses(index, status, isChecked) {
  if (isChecked) {
    // Adiciona o status à lista de estados
    tasks[index].statuses.push(status);
  } else {
    // Remove o status da lista de estados
    tasks[index].statuses = tasks[index].statuses.filter((s) => s !== status);
  }
  saveTasks(); // Salva as alterações
  renderTasks(); // Re-renderiza as tarefas
}

// Função para adicionar um comentário a uma tarefa
function addComment(index, comment) {
  tasks[index].comments.push(comment); // Adiciona o comentário à tarefa
  saveTasks(); // Salva as alterações
  renderTasks(); // Re-renderiza as tarefas
}

// Função para excluir uma tarefa
function deleteTask(index) {
  tasks.splice(index, 1); // Remove a tarefa pelo índice
  saveTasks(); // Salva as alterações
  renderTasks(); // Re-renderiza as tarefas
}

// Adiciona evento ao formulário para criar nova tarefa
taskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Previne o recarregamento da página
  const title = taskTitle.value;
  const description = taskDescription.value;
  const assignee = taskAssignee.value; // Pega o valor do responsável
  addTask(title, description, assignee); // Adiciona a nova tarefa
  taskForm.reset(); // Limpa o formulário
});

// Carrega as tarefas ao iniciar a página
renderTasks();
