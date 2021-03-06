const electron = require('electron');
const url = require('url');
const path = require('path');
const ipcRenderer = require('electron').ipcRenderer
const Task = require(path.join(__dirname, '/models/Task'))
const Sequelize = require('sequelize')


document.getElementById('date').innerText = getTodaysDate();

$(document).ready(function(){
    //get all uncompleted tasks from db
    getUncompletedTasksForIndexPage()

    
})

ipcRenderer.on('newTask', function(event, newTask){
   
    //Check if the sky is clear
    if ($('#no-tasks')) {
        $('#no-tasks').css('display', 'none');
    }
    $('#todo-items').prepend(
        '<div class="card task-card" id="card-'+newTask.id+'" onclick="openTask(this);">' +
            '<div class="card-body">' +
                '<div class="float-left">'+
                    '<h5>'+newTask.title+'</h5>' +
                    '<p class="task-card-deadline"><span class="task-card-deadline-title" style="color: green">Due Date: </span>'+new Date(newTask.dueDate).toDateString()+'</p>' +
                '</div>'+
                    '<div class="float-right">' +
                        '<span style="color: #077707; padding-right:15px;"><a id="'+newTask.id+'" href="javascript:void(0);" onclick="markTaskAsComplete(this);"><i class="fa fa-check"></i></a></span>' +
                        '<span style="color: #077707;"><i class="fa fa-edit"></i></span>' +
                        '<span style="padding-left:15px;font-size: 20px;font-weight: 600;color: #b5aeae;"><a id="'+newTask.id+'" href="javascript:void(0)" onclick="deleteTask(this);">x</a></span>' +
                    '</div>'+
             '</div>'+
        '</div>'
    );

    initializeReminderEngine(newTask)

})

function getUncompletedTasksForIndexPage(){
    //get all uncompleted tasks from db
    Task.findAll({
        where: {
                status: 0
        },
        order:[
            ['createdAt', 'DESC']
        ]
    })
    .then(tasks => { 
        if (tasks.length == 0) {
            $('#todo-items').append(
                '<div id="no-tasks"><h3 style="text-align:center;">Clear as the sky!</h3></div>'
            )
        }
            tasks.map(task => {
                
                $('#todo-items').append(
                    '<div class="card task-card" id="card-'+task.id+'" onclick="openTask(this);">' +
                    '<div class="card-body">' +
                        '<div class="float-left">'+
                            '<h5 class="task-card-title">'+task.title+'</h5>' +
                            '<p class="task-card-deadline"><span style="color: #ce5959" class="task-card-deadline-title">Due Date: </span>'+ task.dataValues.dueDate.toDateString()+' ('+daysRemaining(task.dataValues.dueDate)+' days left)'+'</p>' +
                            '</div>'+
                            '<div class="float-right">' +
                                '<span style="color: #003c86; padding-right:15px;"><a style="color: inherit" id="'+task.id+'" href="javascript:void(0);" onclick="markTaskAsComplete(this);"><i class="fa fa-check"></i></a></span>' +
                                '<span style="color: #003c86;"><i class="fa fa-edit"></i></span>' +
                                '<span style="padding-left:15px;font-size: 20px;font-weight: 600;color: #b5aeae;"><a style="color: inherit" id="'+task.id+'" href="javascript:void(0)" onclick="deleteTask(this);">x</a></span>' +
                            '</div>'+
                     '</div>'+
                '</div>'
                )

                //fire the reminder engine
                initializeReminderEngine(task.dataValues)

            })
        })

        //tasks expiring in specified number of days
        //pop up

        $('#expiringTasksModal').modal();

        modalQuery(5);
}

function openReporting() {
    ipcRenderer.send('open-reporting-window')
}


function initializeReminderEngine(task) {
    
    //check if the reminder date is today's date
    let todaysDate; 
    let date = new Date()
    // todaysDate = date.getFullYear()+date.getMonth()+date.getDate()
    todaysDate = new Date()

    let reminder = new Date(task.reminderDate)

    let due = new Date(task.dueDate)

    let reminderDate = reminder.getFullYear()+reminder.getMonth()+reminder.getDate()

    let duedate = due.getFullYear()+due.getMonth()+due.getDate()

    if (todaysDate >= reminderDate && todaysDate <= duedate) {

        reminderPopup(task)
      
    }
    
    if(todaysDate > due) {
        // console.log('today - ' +todaysDate)
        // console.log('duedate - ' +duedate)
        //Overdue task
        //update status
        updateToOverdue(task.id)

    }
}


function updateToOverdue(taskId) {
    console.log('updating')
    Task.update(
        {
          status: 2
        },
        {
            where:{
                id: taskId
            }
        }
    )
    .then(console.log('updated'))
}

function openAllTasks() {
    ipcRenderer.send('clicked-open-all-tasks')
}

function reminderPopup(task) {

    let div = document.createElement('div')
    // div.setAttribute('id', 'modal-'+task.id)
    let days = daysRemaining(task.dueDate)

    div.innerHTML = 
    
   '<div id="modal-'+task.id+'" class="modal fade" role="dialog">'+
    '<div class="modal-dialog  modal-lg">'+
      '<div class="modal-content">'+
        '<div class="modal-header" style="background-color: green;">'+
          '<h4 class="modal-title" style="color: white">Its getting closer!</h4>'+
        '</div>'+
        '<div class="modal-body">'+
            '<p>'+task.title+' will be expiring in <span id="reminderTime">'+days+'</span> day(s)</p>'+
        '</div>'+
        '<div class="modal-footer">'+
          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'
  
   $('#popups').append(div)

   $('#modal-'+task.id).modal()

   //Instantiate the reminder at intervals

   //Get the reminder time from db
   let reminderInterval = task.reminderInterval
   
   setInterval(function(){
       
       //Open a new window
        ipcRenderer.send('open-task-reminder-window', task)

   }, reminderInterval * 60 * 1000)
}

function openTask(task) {
    //get the task
    
    let id = task.id.split('-');
    id.shift();
    
    let singleTask;

    Task.findOne({
        where: {
            id: id[0]
        }
    })
    .then(returnedTask => {
    
        ipcRenderer.send('view-task-window-open', returnedTask)
    })

}

function deleteTask(task) {
    Task.destroy({
        where: {
            id: task.id
        }
    })
    .then(
        $('#card-'+task.id).css('display', 'none')
    )
}

function markTaskAsComplete(taskId) {
    Task.update(
        {
            status: 1,
            completionDate: new Date()
        },
        {where: {
            id: taskId.id
        }
        }
    )
    .then(
        $('#card-'+taskId.id).css('display', 'none')
        
    )
}

function modalQuery(days) {
     //get the tasks
     Task.findAll({
        where:{
            dueDate: {
                [Sequelize.Op.between]: [new Date(), inHowManyDays(5)]
            }
        }
    })
    .then(tasks => {
        tasks.map(task => {
            $('#expiringTasksModalBody').append(
                '<div class="card">' +
                    '<div class="card-body">' +
                        '<div class="float-left">'+task.title+'</div>'+
                        '<p class="task-card-deadline"><span class="task-card-deadline-title">Due Date: </span>'+task.dataValues.dueDate.toDateString()+'</p>' +
                        '</div>'+
                    '</div>'+
                '</div>'
            )
        })
    })
    
}

function inHowManyDays(days) {
    futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days)
    return futureDate;
}

function daysRemaining(deadline) {
    
    d = new Date()
    let todaysDate = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
    
    let dd = new Date(deadline)
    
    let dueDate = Date.UTC(dd.getFullYear(), dd.getMonth(), dd.getDate());
    

     let datediff = Math.floor((dueDate - todaysDate)/ 86400000)
    
     return datediff;
     
}


function getTodaysDate() {

    var dateObj = new Date();

    // var currentDate = dateObj.getFullYear()+'-'+dateObj.getMonth()+'-'+dateObj.getDate()

    return dateObj.toDateString();

}

function addNewTaskWindow() {
    
    let addNewTaskWin;
    addNewTaskWin = new electron.remote.BrowserWindow({show: false, width:500, height:500, modal:true, frame: false});

    addNewTaskWin.loadURL(url.format({
        protocol: 'file',
        slashes: true,
        pathname: path.join(__dirname, 'addTask.html')
    }));

    addNewTaskWin.once('ready-to-show', () => {
        addNewTaskWin.show();
    })

    // addNewTaskWin.webContents.openDevTools()

}

function sync() {
    //clear then get from db again
    $('#todo-items').empty()
    getUncompletedTasksForIndexPage()
}


