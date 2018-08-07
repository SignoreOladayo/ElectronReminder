const electron = require('electron')
const ipcRenderer = electron.ipcRenderer

ipcRenderer.on('newCompletedTasksWindow', function(event, tasks) {
   if (tasks.length  != 0) {
       console.log(tasks)
    document.querySelector('#completed-tasks').style.display = 'block'
    let taskCard
       tasks.forEach(task => {
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

        taskCard.setAttribute('class', 'card')
        taskCard.setAttribute('style', 'margin-bottom: 15px')

        document.querySelector('#completed-tasks').appendChild(taskCard)
       })
       
       
   }
})