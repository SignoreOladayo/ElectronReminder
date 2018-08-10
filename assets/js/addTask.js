$('#datepicker').datepicker();
$('#reminder-datepicker').datepicker();


// const dbCon = require('/todo/database/db')
const path = require('path')
const Task = require(path.join(__dirname, 'models/Task'));
const electron = require('electron')
const ipcRenderer = require('electron').ipcRenderer



function addTaskItem() {
    $('#addTaskForm').submit(function(event){
      event.preventDefault();
        const title = $('#title').val()
        const desc = $('#description').val()
        const dueDate = $('#datepicker').val()
        const reminderDate = $('#reminder-datepicker').val()
        const interval = $('#interval').val()

        Task.create({
          title: title,
          description: desc,
          dueDate: dueDate,
          reminderDate: reminderDate,
          reminderInterval:interval,
          status: 0
        })
        .then(task=>{
          console.log(task)
          ipcRenderer.send('taskInserted', task.dataValues)
          let window = electron.remote.getCurrentWindow();
          window.destroy();
        })
        .catch(err=>{console.log('this is the error:', err)})
        
    })
}

    