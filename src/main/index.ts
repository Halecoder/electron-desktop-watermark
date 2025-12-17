import { app, BrowserWindow, screen } from 'electron'
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

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ❌ 不要创建主窗口
  // createWindow()

  app.whenReady().then(() => {
  const displays = screen.getAllDisplays()

  // ✅ 为每个屏幕创建一个水印窗口
  displays.forEach(display => createWatermarkWindow(display))
})
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
