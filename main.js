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
    fetch('https://demo2.z-bit.ee/tasks?_=' + new Date().getTime(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('fetchTasks- Tasks:', data);
            RecordTasks(data);  // Передаем объект data напрямую
          })
        .catch((error) => {
          console.error('error:', error);
        }); 
      }

//=================================================================================


function RecordTasks(tasksRec) {
    tasks = tasksRec;  // Обновляем глобальный массив задач
    console.log("Tasks:", tasks);

    // Отрисовываем задачи на странице
    tasks.forEach(renderTask);
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
    .then(newTask => {
        tasks.push(newTask);  // Добавляем задачу в массив
        renderTask(newTask);   // Отображаем новую задачу
    })
    .catch((error) => {
        console.error('Error adding task:', error);
    });
}

// kui leht on brauseris laetud siis lisame esimesed taskid lehele
window.addEventListener('load', () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');
    
    fetchTasks();  // Загружаем задачи при старте страницы

    // Обработчик для добавления новой задачи
    addTask.addEventListener('click', () => {
        sendTask("New Task", "");
    });
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

    // Заполняем данные задачи
    const name = taskRow.querySelector("[name='name']");
    name.value = task.title;

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.completed;

    // Кнопка для удаления задачи
    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
        deleteTask(task.id)  // Вызываем функцию для удаления задачи с сервера
            .then(() => {
                taskList.removeChild(taskRow);  // Удаляем задачу из DOM
                tasks.splice(tasks.indexOf(task), 1);  // Удаляем задачу из массива
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    });

    return taskRow;
}

function deleteTask(taskId) {
    return fetch('https://demo2.z-bit.ee/tasks/' + taskId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error deleting task');
        }
        return response.json();
    })
    .then(data => {
        console.log('Task deleted:', data);
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
        
        // Kui inputi peale vajutatakse siis uuendatakse checkboxi kujundust
        input.addEventListener('change', () => {
            checkbox.classList.toggle('ant-checkbox-checked');
        });
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
    .then(response => response.json())
    .then(data => {
        console.log('sendLogin- Ok:', data);
        localStorage.setItem('access_token', data.access_token);    // Сохранение access_token в браузере
        toggleLogin();
        document.getElementById("signUpButton").classList.add("hidden");
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

