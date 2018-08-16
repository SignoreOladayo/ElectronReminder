$( "#start-date" ).datepicker();
$( "#finish-date" ).datepicker();

const path = require('path')
const Task = require(path.join(__dirname, 'models/Task'))
const ipcRenderer = require('electron').ipcRenderer

$('#rangeForm').on('submit', function(event){
    event.preventDefault();

    let start = new Date($('#start-date').val());
    let finish = new Date($('#finish-date').val());

    if ($('#completed').prop('checked') == true) {
        Task.findAll({
            where:{
                status: 1,
                createdAt: {
                    $between: [start, finish]
                }
            }
        })
        .then(tasks => {
            //open a new window
            let payload = {
                type: 'completed',
                tasks: tasks,
                start: start,
                finish: finish
            }
            ipcRenderer.send('got-results', payload)
        })
    }

    if ($('#uncompleted').prop('checked') == true) {
        Task.findAll({
            where:{
                status: 0,
                createdAt: {
                    $between: [start, finish]
                }
            }
        })
        .then(tasks => {
            //open a new window
            let payload = {
                type: 'not-completed',
                tasks: tasks,
                start: start,
                finish: finish
            }
            ipcRenderer.send('got-results', payload)
        })
    }


    if ($('#overdue').prop('checked') == true) {
        Task.findAll({
            where:{
                status: 2,
                createdAt: {
                    $between: [start, finish]
                }
            }
        })
        .then(tasks => {
            //open a new window
            let payload = {
                type: 'overdue',
                tasks: tasks,
                start: start,
                finish: finish
            }
            ipcRenderer.send('got-results', payload)
        })
    }

})

//for the title search form
$('#title-search').on('submit', function(event){
    event.preventDefault();
    let searchParams = $('#search-bar').val();

    Task.findAll({
        where: {
            title: {
                $like: '%'+searchParams+'%'
            }
        }
    })
    .then(tasks => {
        let payload = {
            type: 'title-search',
            tasks: tasks,
            searchParams: searchParams
        }

        ipcRenderer.send('got-results', payload)
    })
})

$('#generate').on('click', function(event){
    event.preventDefault();

    Task.findAll()
        .then(tasks => {
            let completed = 0;
            let uncompleted = 0;
            let overdue = 0;
            tasks.map(task => {
                
                if (task.dataValues.status == 0) {
                    //uncompleted
                    uncompleted = uncompleted + 1
                } 

                if (task.dataValues.status == 1) {
                    //uncompleted
                    completed = completed + 1
                } 

                if (task.dataValues.status == 2) {
                    //uncompleted
                    overdue = overdue + 1
                } 
            })

            let payload= {
                type: 'chart',
                completed: completed,
                uncompleted: uncompleted,
                overdue: overdue
            }

            console.log(payload)

            ipcRenderer.send('got-results', payload)
    })
})