const packager = require('electron-packager');
const rebuild = require('electron-rebuild');

const path = require('path')

packager({
    dir: path.join(__dirname, '../Reminder3'),
    overwrite: true,
    asar: false,
    platform: 'win32',
    arch: 'ia32',
    icon: path.join(__dirname, '../Reminder3/assets/icons/ico/logo.ico'),
    prune: true,
    out: path.join(__dirname, '../'),
    executableName: 'desktop_reminder',
    afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
    rebuild.rebuild({ buildPath, electronVersion, arch })
      .then(() => callback())
      .catch((error) => callback(error));
  }],
})