const electron = require('electron')
const Task = require('/todo/models/Task')

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
                    '<p class="completion-date"><span style="color: green">Date Completed :</span> '+new Date(task.dataValues.completionDate).toDateString()+'</p>'+
                '</div>' +

                // '<div class="float-right">'+
                
                // '</div>' +
                '</div>'+
                '<div class="clearfix"></div>'

                if (task.dataValues.status == 1) {
                    taskCard.setAttribute('style', 'margin-bottom: 15px; border-left:1px solid green')
                }

                if (task.dataValues.status == 0) {
                    taskCard.setAttribute('style', 'margin-bottom: 15px; border-left:1px solid orange')
                }

                if (task.dataValues.status == 2) {
                    taskCard.setAttribute('style', 'margin-bottom: 15px; border-left:1px solid red')
                }

                taskCard.setAttribute('class', 'card')
                taskCard.setAttribute('style', 'margin-bottom: 15px')

                document.querySelector('#completed-tasks').appendChild(taskCard)
         })
     })