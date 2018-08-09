const electron = require('electron')
const path = require('path')
const Task = require(path.join(__dirname, 'models/Task'))

//get all tasks
Task.findAll()
     .then(tasks => {
         tasks.map(task => {
             //create the card for each
             taskCard =  document.createElement('div')
                taskCard.innerHTML = 
                '<div class="card-body">'+
                '<div class="">' +
                    '<h6 id="title">'+task.dataValues.title+'</h6>' +
                    '<p class="completion-date">Status :<span id="status'+task.dataValues.id+'"></span> </p>'+
                '</div>' +

                // '<div class="float-right">'+
                
                // '</div>' +
                '</div>'+
                '<div class="clearfix"></div>'

                if (task.dataValues.status == 1) {
                    taskCard.setAttribute('style', 'margin-bottom: 15px; border-left:3px solid green')
                }

                if (task.dataValues.status == 0) {
                    taskCard.setAttribute('style', 'margin-bottom: 15px; border-left:3px solid orange')
                }

                if (task.dataValues.status == 2) {
                    taskCard.setAttribute('style', 'margin-bottom: 15px; border-left:3px solid red')
                }

                taskCard.setAttribute('class', 'card')
                // taskCard.setAttribute('style', 'margin-bottom: 15px')

                document.querySelector('#all-tasks').appendChild(taskCard)

                if (task.dataValues.status == 0) {
                    document.querySelector('#status'+task.dataValues.id).innerText = 'Not Completed'
                }

                if (task.dataValues.status == 1) {
                    document.querySelector('#status'+task.dataValues.id).innerText = 'Completed'
                }

                if (task.dataValues.status == 2) {
                    document.querySelector('#status'+task.dataValues.id).innerText = 'Overdue'
                }
         })
     })