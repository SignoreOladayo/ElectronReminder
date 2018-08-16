
const ipcRenderer = require('electron').ipcRenderer
const Chart = require('chart.js')

ipcRenderer.on('results', function(event,payload){
    
    if (payload.type == 'completed') {
        $('#graphical').css('display', 'none')
        $('#report-title').text('Report showing all Completed Tasks from '+new Date(payload.start).toDateString()+' to '+new Date(payload.finish).toDateString())

        appendDataToTable(payload)
    }

    if (payload.type == 'not-completed') {
        $('#graphical').css('display', 'none')
        $('#report-title').text('Report showing all uncompleted Tasks from '+new Date(payload.start).toDateString()+' to '+new Date(payload.finish).toDateString())

        appendDataToTable(payload)
    }

    if (payload.type == 'overdue') {
        $('#graphical').css('display', 'none')
        $('#report-title').text('Report showing all Overdue Tasks from '+new Date(payload.start).toDateString()+' to '+new Date(payload.finish).toDateString())

        appendDataToTable(payload)
    }

    if (payload.type == 'title-search') {
        $('#graphical').css('display', 'none')
        $('#report-title').text('Search results for "'+payload.searchParams+'"')

        appendDataToTable(payload)
    }

    if (payload.type == 'chart') {
        $('#report-title').text('A graphical analysis of all the Tasks so far.')

        //hide the table element
        $('#results-table').css('display', 'none')

        let chart = $('#resultsChart')

        let displayChart = new Chart(chart, {
            type: 'pie',
            data: {
                labels: ['Completed', 'Uncompleted', 'Overdue'],
                datasets: [{
                    data:[payload.completed, payload.uncompleted, payload.overdue],
                    backgroundColor: [
                        'green',
                        'orange',
                        'red'
                    ]
                }]
            }
        })

        $('#completedTasks').text(payload.completed+' Tasks')
        $('#uncompletedTasks').text(payload.uncompleted+' Tasks')
        $('#overdueTasks').text(payload.overdue+' Tasks')
    }
    
    
    function appendDataToTable(payload) {
        let tasks = [];

        payload.tasks.map(function(task){
            tasks.push(task.dataValues)
        })
        
        $('#results-table').DataTable( {
            data: tasks,
            columns: [
                { data: 'title' },
                { data: 'description' },
                { data: 'dueDate' },
                { data: 'reminderDate' }
            ],
            dom: 'Bfrtip',
            buttons: [
                'pdfHtml5'
            ]
        });
    }
})