const ipcRenderer = require('electron').ipcRenderer


ipcRenderer.on('open-new-task-reminder-window', function (event, task) {
    console.log(task)
    let title = document.querySelector('#title')
    let description = document.querySelector('#description')
    let dueDate = document.querySelector('#deadline')
    

    title.innerText = task.title
    description.innerText = task.description
    dueDate.innerText = new Date(task.dueDate).toDateString()
})