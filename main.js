// const tasks = [
//     {
//         id: 1,
//         name: 'Task 1',
//         completed: false
//     },
//     {
//         id: 2,
//         name: 'Task 2',
//         completed: true
//     }
// ];
let tasks =[];

//=================================================================================

function fetchTasks() {                     // ===== фетч со считыванием задач ===== ===== ===== ===== ===== ===== 
    fetch('https://demo2.z-bit.ee/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Разбираем JSON здесь
    })
    .then(data => {
        console.log('fetchTasks- Tasks:', data);
        // let tasksRec = JSON.parse(data);  // Парсим строку JSON в объект JS
        // console.log(tasksRec);
        RecordTasks(data); // Передаем объект data напрямую
    })
    .catch((error) => {
        console.error('error:', error);
    }); 
}

//=================================================================================


function RecordTasks(tasksRec) {
    tasks = tasksRec;  // Обновляем глобальный массив задач
    console.log("Tasks:", tasks);
    tasks.forEach(renderTask);


    let allIds = tasksRec.map(task => task.id);
    console.log('RecordT',allIds); // [1, 2, 3]

    let doneTasks = tasksRec.filter(task => task.marked_as_done);
    console.log('RecordT',doneTasks);

    let taskCount = tasksRec.length;
    console.log('RecordT',taskCount);

    let task2 = tasksRec.find(task => task.id === 2);
    console.log('RecordT',task2);
    // if (task2) {
    // task2.desc = 'New description';
    // console.log(task2);
    // }

    console.log("Dolzno Byt' tasks:", tasksRec);

}     


// заменить ведь id вроде даст API // также нах все TaskId++
// заменить ведь id вроде даст API // также нах все TaskId++
// заменить ведь id вроде даст API // также нах все TaskId++
// let lastTaskId = 2;



function RecordTasks2(tasks) {
  if (Array.isArray(tasks)) {
    tasks.forEach(task => {
      console.log('RecordTasks- Task:', task);
      // Здесь можно добавить код для записи задачи в интерфейс
    });
  } else {
    console.error('Tasks is not an array:', tasks);
  }
}

function sendTask(title, desc) {
  const data = {
    title: title,
    desc: desc
  };

  fetch('https://demo2.z-bit.ee/tasks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
    .then(data => {
        console.log('sendTask- Task added:', data);
        // let tasksRec = JSON.parse(data);    // Парсим строку JSON в объект JS
        // console.log(tasksRec);
        // RecordTasks(tasksRec);
        tasks.push(data);  // Добавляем новую задачу в массив tasks
        renderTask(data);  // Отображаем новую задачу на странице
    })
    .catch((error) => {
        console.error('Error adding task:', error);
  }); 
}

// kui leht on brauseris laetud siis lisame esimesed taskid lehele
window.addEventListener('load', () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');

    const accessToken = localStorage.getItem('access_token');   // Проверка наличия токена в localStorage
    if (accessToken) {
        toggleLogin();  // Меняем кнопку на "Log Out"
        document.getElementById("signUpButton").classList.add("hidden"); // Скрываем кнопку Sign Up
    }
    
    fetchTasks();       // Загружаем задачи при старте страницы
    
    addTask.addEventListener('click', () => {                   // Обработчик для добавления новой задачи
        sendTask("New Task", ""); 
    });
  //was sendTask("Task " + (tasks.length + 1), ""); Перемудрил? Возможно.

});

function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

function createTask() {
    let lastTaskId = taskCount;
    lastTaskId++;
    const task = {
        id: lastTaskId,
        name: 'Task ' + lastTaskId,
        completed: false
    };
    tasks.push(task);
    return task;
}

function createTaskRow(task) {
    let taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    // Заполняем данные задач
    const name = taskRow.querySelector("[name='name']");
    name.value = task.title;

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.marked_as_done; // Устанавливаем начальное состояние чекбокса

    // Обработчик события для чекбокса
    checkbox.addEventListener('change', () => {
        const markedAsDone = checkbox.checked;
        updateTaskStatus(task.id, markedAsDone);
    });

    // Обработчик события для редактирования названия задачи
    name.addEventListener('blur', () => {
        const newTitle = name.value;
        updateTaskTitle(task.id, newTitle);
    });

    // Обработчик события для удаления задачи
    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
        deleteTask(task.id, taskRow); // Вызываем функцию удаления задачи
    });

    return taskRow;
}


function updateTaskStatus(taskId, markedAsDone) {
    const data = {
        title: tasks.find(task => task.id === taskId).title, // Получаем название задачи по ID
        marked_as_done: markedAsDone
    };

    fetch(`https://demo2.z-bit.ee/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(updatedTask => {
        console.log('Task updated successfully:', updatedTask);
        // Здесь можно обновить локальный массив задач, если необходимо
    })
    .catch(error => {
        console.error('Error updating task:', error);
    });
}


function updateTaskTitle(taskId, newTitle) {
    const data = {
        title: newTitle,
        marked_as_done: tasks.find(task => task.id === taskId).marked_as_done // Сохраняем текущее состояние завершенности
    };

    fetch(`https://demo2.z-bit.ee/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(updatedTask => {
        console.log('Task updated successfully:', updatedTask);
        // Здесь можно обновить локальный массив задач, если необходимо
        const index = tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            tasks[index].title = updatedTask.title; // Обновляем название задачи в локальном массиве
        }
    })
    .catch(error => {
        console.error('Error updating task title:', error);
    });
}


function deleteTask(taskId, taskRow) {
    fetch(`https://demo2.z-bit.ee/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Удаляем строку задачи из интерфейса
        taskList.removeChild(taskRow);
        tasks.splice(tasks.indexOf(tasks.find(task => task.id === taskId)), 1); // Удаляем задачу из массива
        console.log('Task deleted successfully');
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}

function createAntCheckbox() {
    const checkbox = document.querySelector('[data-template="ant-checkbox"]').cloneNode(true);
    checkbox.removeAttribute('data-template');
    hydrateAntCheckboxes(checkbox);
    return checkbox;
}

/**
 * See funktsioon aitab lisada eridisainiga checkboxile vajalikud event listenerid
 * @param {HTMLElement} element Checkboxi wrapper element või konteiner element mis sisaldab mitut checkboxi
 */
function hydrateAntCheckboxes(element) {
    const elements = element.querySelectorAll('.ant-checkbox-wrapper');
    for (let i = 0; i < elements.length; i++) {
        let wrapper = elements[i];

        // Kui element on juba töödeldud siis jäta vahele
        if (wrapper.__hydrated)
            continue;
        wrapper.__hydrated = true;


        const checkbox = wrapper.querySelector('.ant-checkbox');

        // Kontrollime kas checkbox peaks juba olema checked, see on ainult erikujundusega checkboxi jaoks
        const input = wrapper.querySelector('.ant-checkbox-input');
        if (input.checked) {
            checkbox.classList.add('ant-checkbox-checked');
        }
        
    }
}






window.autoCloseQueue = {}

document.addEventListener('click', function(event) {
    for (id in autoCloseQueue){
        var element = autoCloseQueue[id];
        var overlay = document.getElementById('overlay-xxy');
        if (event.target.closest('#' + id)) {               // Клик на элементе (или его дочернем элементе)
            if (typeof element.onPress === 'function') element.onPress(event, id);
        } else {                                            // Клик вне элемента
            if (overlay) overlay.remove();                  // Удаляем overlay, если он есть
            if (typeof element.onOutsidePress === 'function') element.onOutsidePress(event, id);
            delete autoCloseQueue[id];                      // Удалить элемент из очереди
        }
    }
});

function hidePop(event, id) {                               // Спрятать элемент
    document.getElementById(id).style.display = 'none';
}

function addOverlay() {                                     // Создаем overlay, если его нет
    var overlay = document.getElementById('overlay-xxy');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'overlay-xxy';
        document.body.appendChild(overlay);
    }
}




function toggleLogin() {
    var button = document.getElementById("loginButton");
    if (button.innerHTML === "Log In") {
        button.innerHTML = "Log Out";
    } else {
        button.innerHTML = "Log In";
    }
}

function openLogin() {
    var button = document.getElementById("loginButton");
    if (button.innerHTML === "Log In") {
        document.getElementById("popUpLogin").style.display = "block";
    setTimeout(function() {window.autoCloseQueue['popUpLogin'] = {onOutsidePress: hidePop}; addOverlay();}, 50);
    } else {
        button.innerHTML = "Log In";
        document.getElementById("signUpButton").classList.remove("hidden");
    }
}  

function sendLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    const data = {
        username: username,
        password: password
    };

    fetch('https://demo2.z-bit.ee/users/get-token', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('sendLogin- Ok:', data);
        localStorage.setItem('access_token', data.access_token); // Сохранение access_token в браузере
        toggleLogin();
        document.getElementById("signUpButton").classList.add("hidden");
        if (overlay) overlay.remove();
    })
    .catch((error) => {
        console.error('Ko:', error);
    }); 

    document.getElementById("popUpLogin").style.display = "none";
}






function openPopup() {
    document.getElementById("popUp").style.display = "block";
    setTimeout(function() {window.autoCloseQueue['popUp'] = {onOutsidePress: hidePop}; addOverlay();}, 50);
}

function sendSingin() {   // was closePopup
    var newUsername = document.getElementById("newUsername").value;
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var newPassword = document.getElementById("newPassword").value;

    const data = {
        username: newUsername,
        firstname: firstname,
        lastname: lastname,
        newPassword: newPassword
    };

    fetch('https://demo2.z-bit.ee/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('sendSingin- Ok:', data);
        localStorage.setItem('access_token', data.access_token);    // Сохранение access_token в браузере
        toggleLogin();
        document.getElementById("signUpButton").classList.add("hidden");
        if (overlay) overlay.remove();
    })
    .catch((error) => {
        console.error('Ko:', error);
    }); 
    
    document.getElementById("popUp").style.display = "none";
}   






function taskChk(checkbox) {
    let access_token = localStorage.getItem('access_token');
    var markAs = checkbox.checked;
    var task = "8736";
    var url = "https://demo2.z-bit.ee/tasks/"+task;
    var token = "Bearer "+access_token 
    var data = {
        title: "complete cake",
        marked_as_done: markAs
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log("taskChk- Task added successfully");
        } else {
            console.error("Error adding task");
        }
    })
    .catch(error => console.error("Error:", error));
}


//Pabotaet??
// Получение всех токенов, полученных во время текущей сессии
const allTokens = Object.keys(localStorage).filter(key => key.includes('access_token')).map(key => localStorage.getItem(key));

// Показать все токены в alert
// function buut2() {  alert(`Все токены: ${allTokens.join(', ')}`);  }
function buut2() {  alert( tasks );  }

function buut1() {  
    alert( localStorage.getItem('access_token') );
}

