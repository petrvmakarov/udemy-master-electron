const {
  Menu,
  MenuItem,
} = require("electron");

function buildMenu() {
  const menu = new Menu();
  const mi = new MenuItem({
    label: "root item",
    submenu: [
      { label: "item 1" },
      { label: "item 2", submenu: [{ label: "sub item 2.1" }] },
      { label: "item 3" },
    ],
  });
  menu.append(mi);
  return menu;
}

function buildMenuFromTemplate() {
  return Menu.buildFromTemplate([
    {
      label: "root item",
      submenu: [
        { label: "item 1" },
        { label: "item 2", submenu: [{ label: "sub item 2.1" }] },
        { label: "item 3" },
      ],
    },
    {
      label: 'Actions',
      submenu: [
        { label: 'Action 1' },
        { label: 'Action 2' },
        { label: 'Action 3' },
      ]
    },
  ]);
}

module.exports = [
  {
    label: "root item",
    submenu: [
      { label: "item 1" },
      { label: "item 2", submenu: [{ label: "sub item 2.1" }] },
      { label: "item 3" },
    ],
  },
  {
    label: 'Actions',
    submenu: [
      { label: 'DevTools', role: 'toggleDevTools' },
      { role: 'toggleFullscreen' },
      { label: 'Action 2', enabled: false, },
      { label: 'Greet!', click: () => console.log('Hello from main menu!'), accelerator: 'Shift+Alt+G' },
    ]
  },
]