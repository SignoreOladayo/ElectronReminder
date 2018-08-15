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

    if ($('#not-completed').prop('checked') == false) {
        Task.findAll({
            where:{
                status: 0,
                createdAt: {
                    $between: [start, finish]
                }
            }
        })
        .then(tasks => {
            console.log(tasks)
        })
    }
})