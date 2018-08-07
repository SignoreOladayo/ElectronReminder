const electron = require('electron')
const ipcRenderer = electron.ipcRenderer


ipcRenderer.on('viewTask', function(event, task) {
   let title = document.querySelector('#taskTitle')
   let content = document.querySelector('#taskContent')
   let dueDate = document.querySelector('#dueDate')

   title.innerText = task.title;
   content.innerText = task.description;
   dueDate.innerText = new Date(task.dueDate).toDateString();

})