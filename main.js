const {app, BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const path = require('path')
// require('electron-reload')(__dirname);

function createWindow() {

    let win;

    win = new BrowserWindow({show: false});

    win.loadURL(url.format({
        protocol: 'file',
        slashes: true,
        pathname: path.join(__dirname, 'index.html')
    }))
    

    // win.webContents.openDevTools()

    ipcMain.on('taskInserted', function(event, task){
        win.webContents.send('newTask', task)
    })

    

    win.once('ready-to-show', () => {
        win.show();
    })

  
ipcMain.on('view-task-window-open', function(event, task){
    
    let viewTaskWindow;
    viewTaskWindow = new BrowserWindow({show:false, width: 500, height: 500, modal:true, alwaysOnTop:true})
    
    viewTaskWindow.loadURL(url.format({
        protocol: 'file',
        slashes:true,
        pathname: path.join(__dirname, 'viewTaskWindow.html')
    }))

    viewTaskWindow.webContents.on('did-finish-load', function() {

        viewTaskWindow.webContents.send('viewTask', task.dataValues)

        viewTaskWindow.webContents.openDevTools();

        viewTaskWindow.once('ready-to-show', () => {
            viewTaskWindow.show();
        })
    })
    
})

ipcMain.on('openCompletedTasks', function (event, tasks) {

    let completedTasksWindow;

    completedTasksWindow = new BrowserWindow({width: 500, height: 500, show: false, alwaysOnTop:true})

    completedTasksWindow.loadURL(url.format({
        protocol: 'file',
        slashes:true,
        pathname: path.join(__dirname, 'completedTasks.html')
    }))

    completedTasksWindow.webContents.on('did-finish-load', function() {
        completedTasksWindow.webContents.send('newCompletedTasksWindow', tasks)

        completedTasksWindow.webContents.openDevTools();

        completedTasksWindow.once('ready-to-show', () => {
            completedTasksWindow.show()
        })
 
    })

   
})

ipcMain.on('open-task-reminder-window', function(event, task) {

    //Check if reminderWindow is currently open

    let reminderWindow = new BrowserWindow({show: false, width:600, alwaysOnTop:true});

    reminderWindow.loadURL(url.format({
        protocol: 'file',
        slashes: true,
        pathname: path.join(__dirname, 'reminderWindow.html')
    }))

    reminderWindow.webContents.on('did-finish-load', function(){
        reminderWindow.webContents.send('open-new-task-reminder-window', task.dataValues)
        if (win.isMinimized()) {
            win.restore()
        }
        reminderWindow.show();
    })
})

ipcMain.on('clicked-open-all-tasks', function(){
    let allTasksWindow = new BrowserWindow({show:false, alwaysOnTop:true})

    allTasksWindow.loadURL(url.format({
        protocol: 'file',
        slashe: true,
        pathname: path.join(__dirname, 'allTasksWindow.html')
        
    }))

    allTasksWindow.once('ready-to-show', function(){
        allTasksWindow.show()
    })
})

// win.on('minimize', function(event) {
//     event.preventDefault();
//     win.minimize();
// })

}



app.on('ready', function(){
    createWindow();
});