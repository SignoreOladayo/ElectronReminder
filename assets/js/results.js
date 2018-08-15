
const ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('results', function(event,payload){
    
    if (payload.type == 'completed') {
        $('#report-title').text('Report showing all completed tasks from '+new Date(payload.start).toDateString()+' to '+new Date(payload.finish).toDateString())
    }

    if (payload.type == 'not-completed') {
        $('#report-title').text('Report showing all uncompleted tasks from '+new Date(payload.start).toDateString()+' to '+new Date(payload.finish).toDateString())
    }
    
    let tasks = [];

    payload.tasks.map(function(task){
        tasks.push(task.dataValues)
    })
    
    $('#results-table').DataTable( {
        data: tasks,
        columns: [
            { data: 'title' },
            { data: 'description' },
            { data: 'dueDate' }
        ]
    } );
})