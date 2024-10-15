const formCreate = document.getElementById('form-create')
const formMessage = document.getElementById('message-create')
const formEdit = document.getElementById('form-edit')
const listGroupTodo = document.getElementById('list-group-todo')
const time = document.getElementById('time')
const modal = document.getElementById('edit-modal')
const overlay = document.getElementById('overlay')
const alertObj = document.getElementById('message-success-container')
const sortBy = document.getElementById('sort-by')

let editTodoId

// Time 
const fullDay = document.getElementById('full-day')
const hourEl = document.getElementById('hour')
const minuteEl = document.getElementById('minute')
const secondEl = document.getElementById('second')
const closeEl = document.getElementById('close')

let todoList = JSON.parse(localStorage.getItem('todoList')) || []
let todoTimeOut

window.onload = () => {
    startTimer()

    if (todoList.length >= 1) {
        showTodos()
    }
}

function startTimer() {
    setInterval(() => {
        const date = new Date()

        let second = date.getSeconds()
        let minute = date.getMinutes()
        let hour = date.getHours()
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()

        console.log(second, minute, hour, day, month, year);


        if (second < 10)
            second = '0' + second

        if (minute < 10)
            minute = '0' + minute

        if (hour < 10)
            hour = '0' + hour

        fullDay.textContent = `${day} ${getMonthByNumber(month)} ${year}`
        hourEl.innerText = hour
        minuteEl.innerText = minute
        secondEl.innerText = second
    }, 1000);
}

function getMonthByNumber(number) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[number]
}

function saveToDosToLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList))
}

formCreate.addEventListener('submit', (e) => {
    e.preventDefault()

    const todoText = formCreate['input-create'].value.trim()
    console.log(todoText);

    if (!todoText) {
        formCreate['input-create'].value = ''
        clearTimeout(todoTimeOut)
        showMessage('message-create', 'Please enter a todo')
        return
    }

    const newToDo = {
        id: new Date().getTime(),
        text: todoText,
        createdAt: getTime(),
        isCompleted: false,
        isEdit: false
    }

    todoList.push(newToDo)
    saveToDosToLocalStorage()
    showTodos()
    formCreate.reset()
})

function showMessage(where, message) {
    const messageObj = document.getElementById(where)
    messageObj.innerText = message
    setTimeout(() => {
        messageObj.innerText = ''
    }, 1500)
}

function showTodos() {
    const todos = JSON.parse(localStorage.getItem('todoList')) || []

    listGroupTodo.innerHTML = ''
    let index = 0

    for (const todo of todos) {
        listGroupTodo.innerHTML += `
      <li ondblclick=(setCompleted('${index}')) class="list-group-item d-flex justify-content-between ${todo.isCompleted ? 'bg-success' : ''}">
      ${todo.text}
        <div class="todo-icons">
          <span class="opacity-50 me-2 ">${todo.createdAt}</span>
          <img onclick=(editTodo('${index}')) src="./img/edit.svg" alt="edit todo" width="25" height="25">
          <img onclick=(deleteTodo('${index++}')) src="./img/delete.svg" alt="delete todo" width="25" height="25">
          <i onclick=(showMore('${index}')) class="bi bi-eye-fill me-2"></i>
        </div>
      </li>
        `
    }
}

function getTime() {
    const now = new Date()
    const date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    const month = ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1)
    const year = now.getFullYear()
    const hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
    const minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()

    const time = `${hours}:${minutes}`

    return `${date}.${month}.${year} ${time}`
}

function deleteTodo(index) {
    todoList.splice(index, 1)
    localStorage.setItem('todoList', JSON.stringify(todoList))
    showTodos()
}

function setCompleted(index) {
    console.log('setCompleted');


    const completed = todoList.map(
        (todo, i) => {
            if (i == index) todo.isCompleted = !todo.isCompleted
            return todo
        }
    )

    console.log(completed);


    todoList = completed
    localStorage.setItem('todoList', JSON.stringify(todoList))
    showTodos()
}

formEdit.addEventListener('submit', (e) => {
    console.log('afsdbgadfsgb');

    e.preventDefault()

    const todoText = formEdit['input-edit'].value.trim()

    if (!todoText) {
        showMessage('message-edit', 'Please enter a todo')
        return
    }

    const todo = todoList[editTodoId]
    todo.text = todoText
    todo.isEdit = true

    localStorage.setItem('todoList', JSON.stringify(todoList))
    showTodos()
    close()
    formEdit.reset()

    customAlert('Successfully edited ✅')
})

function customAlert(message) {
    alertObj.children[1].innerText = message
    alertObj.classList.remove('d-none')

    setTimeout(() => {
        alertObj.classList.add('d-none')
    }, 1000)
}

function editTodo(index) {
    open()
    document.getElementById('input-edit').value = todoList[index].text
    editTodoId = index
}

function open() {
    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')
}

document.getElementById('close').addEventListener('click', close)
sortBy.oninput = sortByFunc

function close() {
    console.log('close');
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
}

function sortByFunc() {
    console.log('sortByFunc');

    const sortDirection = sortBy.value

    console.log(todoList);


    switch (sortDirection) {
        case 'completed': {
            todoList.sort((a, b) => {
                if (a.isCompleted && !b.isCompleted) return -1
                if (!a.isCompleted && b.isCompleted) return 1
                return 0
            })
            break
        }
        case 'uncompleted': {
            todoList.sort((a, b) => {
                if (a.isCompleted && !b.isCompleted) return 1
                if (!a.isCompleted && b.isCompleted) return -1
                return 0
            })
            break
        }
        case 'desc': {
            todoList.sort((a, b) => {
                if (a.id > b.id) return -1
                if (a.id < b.id) return 1
                return 0
            })
            break
        }
        case 'asc': {
            todoList.sort((a, b) => {
                if (a.id > b.id) return 1
                if (a.id < b.id) return -1
                return 0
            })
            break
        }
    }

    localStorage.setItem('todoList', JSON.stringify(todoList))
    showTodos()
}

const showMoreModal = document.getElementById('show-more-modal')

function showMore(index) {
    showMoreModal.classList.remove('hidden')
    overlay.classList.remove('hidden')

    
    const text = todoList[index].text
    document.getElementById('textarea-more').value = text
}

function closeShowMore() {
    showMoreModal.classList.add('hidden')
    overlay.classList.add('hidden')
}