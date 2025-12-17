import { app, BrowserWindow, screen, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// function createMainWindow() {
//   const mainWindow = new BrowserWindow({
//     width: 900,
//     height: 670,
//     show: false,
//     autoHideMenuBar: true,
//     ...(process.platform === 'linux' ? { icon } : {}),
//     webPreferences: {
//       preload: join(__dirname, '../preload/index.js'),
//       sandbox: false
//     }
//   })

//   mainWindow.on('ready-to-show', () => {
//     mainWindow.show()
//   })

//   if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
//     mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
//   } else {
//     mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
//   }
// }

let tray: Tray | null = null

function createWatermarkWindow(display) {
    const { bounds, scaleFactor } = display
  const { x, y, width, height } = bounds

  const wm = new BrowserWindow({
    width,
    height,
    x,
    y,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    fullscreen: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  wm.setIgnoreMouseEvents(true) // ✅ 点击穿透
  wm.setAlwaysOnTop(true, 'screen-saver') // ✅ 永远置顶

  // ✅ DPI 适配
  wm.webContents.setZoomFactor(scaleFactor)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    wm.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/watermark')
  } else {
    wm.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'watermark'
    })
  }
}

function createTray() {
  tray = new Tray(join(__dirname, '../../resources/icon.png'))

  const contextMenu = Menu.buildFromTemplate([
     {
      label: '重启',
      click: () => {
        // 关闭所有窗口
        BrowserWindow.getAllWindows().forEach(win => win.close())

        // 重新创建水印窗口
        const displays = screen.getAllDisplays()
        displays.forEach(display => createWatermarkWindow(display))
      }
    },
    {
      label: '退出水印',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('桌面水印运行中')
  tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ❌ 不要创建主窗口
  // createWindow()

  app.whenReady().then(() => {
  // ✅ 创建托盘
  createTray()

  const displays = screen.getAllDisplays()

  // ✅ 为每个屏幕创建一个水印窗口
  displays.forEach(display => createWatermarkWindow(display))
})
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
