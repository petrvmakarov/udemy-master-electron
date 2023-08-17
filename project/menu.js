const {Menu, shell, WebContents} = require('electron');

module.exports = (appWin) => {
  // Menu template
  const template = [
    {
      label: 'Items',
      submenu: [
        {
          label: 'Add New',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            appWin.send('menu-show-modal');
          },
        },
        {
          label: 'Read Item',
          accelerator: 'CmdOrCtrl+Enter',
          click: () => {
            appWin.send('menu-open-selected-item');
          },
        },
        {
          label: 'Delete Item',
          accelerator: 'CmdOrCtrl+Backspace',
          click: () => {
            appWin.send('menu-delete-selected-item');
          },
        },
        {
          label: 'Open in Browser',
          accelerator: 'CmdOrCtrl+Shift+Enter',
          click: () => {
            appWin.send('menu-open-in-browser-selected-item');
          },
        },
        {
          label: 'Search Items',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            appWin.send('menu-focus-search');
          },
        },
      ],
    },
    {
      role: 'editMenu',
    },
    {
      role: 'windowMenu',
    },
    {
      role: 'help',
      submenu: [{
        label: 'Learn more',
        click: () => {
          shell.openExternal('https://google.com');
        }
      }]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({role: 'appMenu' });
  }

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}