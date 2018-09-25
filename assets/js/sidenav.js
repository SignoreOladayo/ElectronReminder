// const Task = require('/todo/models/Task')
// const ipcRenderer = require('electron').ipcRenderer;


function openSideNav() {
    document.querySelector('#mySidenav').style.width = '250px'

}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function openCompletedTasks() {
    Task.findAll({
        where: {
            status: 1
        }
    })
    .then(tasks => {
        ipcRenderer.send('openCompletedTasks', tasks)
    }
    )
}


function openFlightHours() {
    //add the back buitton
    ipcRenderer.send('open-flight-hours')
   
}