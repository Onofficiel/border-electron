// Modules to control application life and create native browser window
const {app,dialog, BrowserWindow,Tray,Menu,Notification,ipcMain,MenuItem,session,webContents,BrowserView} = require('electron')
const path = require('path')
var vm=require('node:vm');
const electron=require('electron')
const fs=require('fs')



var bjsMetaData=[];




function util$text_lengthify(t,l,c) {
var g=l-t.length;
if(g<1){g=0}
var z=""
console.log(g)
for(var i=0;i<g;i++){z+=c}
return z+t
}

function util$text_rewr(t,c,p) {
  var g=""
  for(var i=0;i<t.length;i++) {
    g+=(i==p?c:t[i])
  }
  return g
}










var ibrx = {
	tabs: {
		create:async function(config,window) {
		  return await window.webContents.executeJavaScript("browser.addTab("+JSON.stringify(config)+")");
		},
		getAllInWindow:async function (window) {
			return await window.webContents.executeJavaScript(`
			(function(){
			var ids=[]
			var qa=document.querySelectorAll(".border-tab");
			for(var i=0;i<qa.length;i++) {
			ids.push(qa[i].dataset.id)
			}
			return ids
			})()
			`);
		},
		getAll:async function () {
		  var ids=[]
		  for(var i=0;i<openWindowIds.length;i++) {
		    try {
		      var FW=await ibrx.tabs.getAllInWindow(BrowserWindow.fromId(openWindowIds[i]))
		      FW.forEach( id => ids.push(openWindowIds[i]+"."+id))
		    }catch(err){0}
		  }
		  return ids
		}
	}
}







var openWindowIds=[];

var XVM = {
  Version: function () {
    return {
      buildId: "AAKB7XQ8D-WE7BB93D4C-3S0P3L9G",
      release: 'XVM Runner (Stable(',
      channel: 'xvm.stable',
      version: '1.0.0'
    }
  },
  Runner: function () {
    //var win=new BrowserWindow()
    var view=new BrowserView({
      webPreferences: {
        nodeIntegration:true,
        contextIsolation:false
      }
    })
    //win.setBrowserView(view);
    var frame=view.webContents;
    view.setBounds({width:800,height:600,x:0,y:0})
    frame.loadURL("file://"+path.normalize(__dirname+"/bluginxvm.html"));
    frame.userAgent=("Mozilla/5.0 (border.i.xvm) Border/1.10 XVM/1.0.0");
    var fmIsReady=false
    var actionQueue=[]
    var frameKilled=false
    frame.on('dom-ready', event => {
      fmIsReady=true;
      var len=actionQueue.length;
      for(var i=0;i<len;i++) {
        var action=actionQueue.pop();
        if(action.name=="xvm.i.eval") {
          frame.executeJavaScript(action.value).catch(console.error)
        } else if(action.name=="xvm.o.eval") {
          frame.executeJavaScript(
            `Xvm.Run({
              source:${JSON.stringify(action.value.source)},
              global: Xvm.GlobalScope||{},
              filename:${JSON.stringify(action.value.name)}
            })`
          ).catch(console.error)
        } else if(action.name=="xvm.o.global") {
          frame.executeJavaScript(
            `Xvm.GlobalScope=${action.value}`
          ).catch(console.error)
        }
      }
    })
    var trueConsole={
      Log:null,
      Warn:null,
      Error:null,
      Info:null,
      Debug:null,
      Clear:null
    }
    frame.on('ipc-message',event => {

      if(event.channel==="xvm.conhost.log") {
        try {
          trueConsole.Log(...event.args)
        } catch (error) {
          null
        }
      } else if(event.channel==="xvm.conhost.error") {
        try {
          trueConsole.Error(...event.args)
        } catch (error) {
          null
        }
      } else if(event.channel==="xvm.conhost.warn") {
        try {
          trueConsole.Warn(...event.args)
        } catch (error) {
          null
        }
      } else if(event.channel==="xvm.conhost.debug") {
        try {
          trueConsole.Debug(...event.args)
        } catch (error) {
          null
        }
      } else if(event.channel==="xvm.conhost.info") {
        try {
          trueConsole.Info(...event.args)
        } catch (error) {
          null
        }
      } else if(event.channel==="xvm.conhost.clear") {
        try {
          trueConsole.Clear()
        } catch (error) {
          null
        }
      } else if(event.channel.startsWith("xvm.ipc:")) {
        for(var i=0;i<xIPCe.length;i++) {
          if("xvm.ipc:"+xIPCe[i].name===event.channel) {
          try{xIPCe[i].cb(...event.args)}catch(e){console.warn(e)}
          }
        }
      }
    })
    var xIPCe=[]
    return {
      Internals:{
        i_eval: function (code) {
          if (frameKilled) { throw new Error("Cannot execute on dead frame") }
          if(fmIsReady) {
            frame.executeJavaScript(code)
          } else {
            actionQueue.push({value:code,name:'xvm.i.eval'})
          }
        }
      },
      Console: {
        set Log(value) {
          trueConsole.Log=value
        },
        get Log() {
          return trueConsole.Log
        },
        set Warn(value) {
          trueConsole.Log=Warn
        },
        get Warn() {
          return trueConsole.Warn
        },
        set Error(value) {
          trueConsole.Error=value
        },
        get Error() {
          return trueConsole.Error
        },
        set Info(value) {
          trueConsole.Info=value
        },
        get Info() {
          return trueConsole.Info
        },
        set Debug(value) {
          trueConsole.Debug=value
        },
        get Debug() {
          return trueConsole.Debug
        },
        set Clear(value) {
          trueConsole.Clear=value
        },
        get Clear() {
          return trueConsole.Clear
        }
      },
      kill: function() {
      if (frameKilled) { throw new Error("Cannot execute on dead frame") }
        frame.forcefullyCrashRenderer()
        frameKilled=true
      },
      execute: function (source,name) {
      if (frameKilled) { throw new Error("Cannot execute on dead frame") }
        if(fmIsReady) {
          frame.executeJavaScript(
            `Xvm.Run({
              source:${JSON.stringify(source)},
              global: Xvm.GlobalScope||{},
              filename:${JSON.stringify(name)}
            })`
          ).catch(console.error)
        } else {
          actionQueue.push({value:{source,name},name:'xvm.o.eval'})
        }
      },
      setGlobal: function (code) {
      if (frameKilled) { throw new Error("Cannot execute on dead frame") }
        if(fmIsReady) {
          frame.executeJavaScript(`Xvm.GlobalScope=${String(code)}`).catch(console.error)
        } else {
          actionQueue.push({value:code,name:'xvm.o.global'})
        }
      },
      IPC: {
        on: function (name,cb) {
          xIPCe.push({name,cb})
        },
        off: function (name,cb) {
        var nel=[]
          for(var i=0;i<xIPCe.length;i++) {
          if (!((xIPCe[i].cb==cb)&&  (
               xIPCe[i].name==name
          ))){
         nel.push(xIPCe[i])
          }
          }
        xIPCe=nel
        },
        emit: function (name,args) {
          frame.send(`xvm.ipc:${name}`,...args)
        }
      },
      Messenger: {
        on: function (cb) {
          frame.on('ipc-message',function (event) {
            if(event.channel==="xvm.messenger.outgoing") {
              try {
                cb(event.args[0])
              } catch (error) {
                console.error(error)
              }
            }
          })
        },
        /**
          Sends a message via BorderVM Messenger.
          @param message {any} The message
          @param critical {boolean} Wether it's critical
        */
        emit: function (message, critical) {
        if (frameKilled) { throw new Error("Cannot execute on dead frame") }
          frame.send('xvm.messenger.incoming',{message,critical:critical?true:false})
        }
      }
    }
  }
}



const os = require("os");

// invoke userInfo() method
const userInfo = os.userInfo();

var LocalStorage = require('node-localstorage').LocalStorage;
















ipcMain.handle('invoke.killwbc',async function (event, wbc) {
  var contents=webContents.fromId(wbc)
  contents.forcefullyCrashRenderer()
  return true
})







var lastFocusedId=0;
var HtmAudio=require('./html5audio.js').Audio
let tray;
ipcMain.on('winmaximize',function(){
  var win=BrowserWindow.getFocusedWindow();
  if(win.isMaximized()){
    win.unmaximize()
    win.focus()
    return
  }
  win.maximize();
  win.focus()
})

ipcMain.on('winminimize',function(){
  var win=BrowserWindow.getFocusedWindow();
  if(win.isMinimized()){
    win.restore()
    win.focus()
    return
  }
  win.minimize();
})
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag:true,
      contextIsolation:false,
      nodeIntegration:true,
      partition:"persist:MainBorderPartition"
    },
    frame:false,
    icon:'border.png'
  });
  lastOW=mainWindow.webContents.id
  mainWindow.setMinimumSize(400,130)
  mainWindow.on('page-title-updated',function(e,t){
    mainWindow.setTitle(t)
  })
  openWindowIds.push(mainWindow.id);
  
  var menu=new Menu();
  menu.append(
    new MenuItem(
		  {
		    label: "New Tab",
		    click: function (item,window,event) {
		      window.webContents.executeJavaScript("browser.addTab({current:true,url:'border://newtab'})");
		    },
		    accelerator: process.platform=="darwin"?"Cmd+t":"Ctrl+t"
		  }
    )
  );
  menu.append(
    new MenuItem(
		  {
		    label: "New Window",
		    click: function (item,window,event) {
		      createWindow()
		    },
		    accelerator: process.platform=="darwin"?"Cmd+n":"Ctrl+n"
		  }
    )
  );
  menu.append(
    new MenuItem(
		  {
		    label: "New Private Window",
		    click: function (item,window,event) {
		      window.webContents.executeJavaScript(`alert("Private windows being implemented...")`)
		    },
		    accelerator: process.platform=="darwin"?"Cmd+Alt+n":"Ctrl+Shift+n"
		  }
    )
  );
  menu.append(
    new MenuItem(
		  {
		    label: "Close Tab",
		    click: function (item,window,event) {
		      window.webContents.executeJavaScript("browser.removeTab(document.querySelector('.border-tab.border-current').getAttribute(\"data-id\"))");
		    },
		    accelerator: process.platform=="darwin"?"Cmd+w":"Ctrl+w"
		  }
    )
  );
  menu.append(
    new MenuItem(
		  {
		    label: "Close Window",
		    click: function (item,window,event) {
		      window.webContents.executeJavaScript("close()");
		    },
		    accelerator: process.platform=="darwin"?"Cmd+Alt+W":"Ctrl+shift+w"
		  }
    )
  );
  mainWindow.setMenu(
    menu
  );

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
   //mainWindow.webContents.openDevTools()
}



var lastOW=-1

ipcMain.on('attach-on-open',(event,id)=>{
  var wbc=webContents.fromId(id)
  wbc.setWindowOpenHandler((details)=>{
    var url=new URL(details.url)
    if(url.protocol=="border:"||url.protocol=="file:"||url.protocol=="plugin:") {
      if(
        (new URL(wbc.getURL()).protocol!="border:")&&
        (new URL(wbc.getURL()).protocol!="file:")&&
        (new URL(wbc.getURL()).protocol!="plugin:")
      ) {
        return {action:'deny'}
      }
    }
    event.sender.executeJavaScript(
      'browser.addTab({url:'+JSON.stringify(details.url)+',current:true});window.focus()'
    )
    return {action:'deny'}
  })
});

ipcMain.on('window-focus-public',(event) =>{
  lastOW=event.sender.id
});

function A_timeout(MS){
return new Promise(resolve=>setTimeout(function(){resolve()},MS))
}


var BorderPublicScheme = {
  'newtab': 'newtab.html',
  'woozy': 'woozy.html',
  'fonts/lexend.woff2': 'fonts/lexend.woff2',
  'fonts/lexend-ext.woff2': 'fonts/lexend-ext.woff2',
  'fonts/lexend-vnm.woff2': 'fonts/lexend-vnm.woff2',
  'styles/lexend.css':'styles/lexend.css',
  'woozy/index.png': 'images/woozy.png',
  'settings': 'settings.html',
  'about':'about.html',
  'urls':'urls.html',
  'themes':'themes.html',
  'settings/content':'content-settings.html'
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  var public=session.fromPartition("persist:BorderProfile-Profile1")
  session.fromPartition("persist:MainBorderPartition").setUserAgent((function(){
    switch (os.platform()) {
      case 'darwin':
        return 'MacOS/X'
      case 'freebsd':
        return 'FreeBSD/1'
      case 'win32':
        var revision=os.release().split(".")[0]
        var subrev=os.release().split(".")[1]
        var buildnumber=os.release().split(".")[2]
        if(revision=="10") {
          if(Number(buildnumber)>=22000) {
            return 'Windows/11'
          }
          return 'Windows/10'
        } else if(revision=="6") {
          if(subrev=="3") {
            return 'Windows/8.1'
          } else if(subrev=="2") {
            return 'Windows/8'
          } else if(subrev=="1") {
            return 'Windows/7'
          } else if(subrev=="0") {
            return "Windows/Vista"
          }
        } else if(revision=="5") {
          if(subrev=="0") {
            return 'Windows/2000'
          } else if(subrev=='3') {
            return 'Windows/Server2003'
          } else {
            return 'Windows/XP'
          }
        }
      case 'linux':
        if(os.version().includes("Ubuntu")||os.version().includes("ubuntu")) {
          return 'Ubuntu/x64'
        }
        if(os.version().includes("Raspbian")||os.version().includes("Raspberry Pi OS")) {
          return 'RaspberryPi/x86'
        }
        if(os.version().includes("Chromium OS")) {
          return 'Chromium/x64'
        }
        if(os.version().includes("Gentoo")) {
          return 'Gentoo/x64'
        }
        if(os.version().includes("Tizen")) {
          return 'Tizen/x86'
        }
        if(os.version().includes('Manjaro')) {
          return 'ManjaroKDE/x64'
        }
        if(os.version().includes("Debian")) {
          return 'Debian/x64'
        }
      default:
        return 'Linux/x86'
    }
  })())
  public.protocol.registerFileProtocol('border', (request, callback) => {
    const url = new URL("https://border/"+request.url.slice(9))
    var page=url.pathname.slice(1)
    if(BorderPublicScheme[page]) {
      return callback({
        path: path.normalize(`${__dirname}/border-scheme/${BorderPublicScheme[page]}`)
      })
    }
    callback({ path: path.normalize(`${__dirname}/404.html`) })
  });
  public.setPermissionRequestHandler(function(contents,permission,callback,details) {
    contents.executeJavaScriptInIsolatedWorld(
      999,
      [
        {
          code: `requestPermission(
            {
              origin: location.origin || "about:blank",
              path: location.href,
              webContentsID: ${contents.id},
              permission: ${JSON.stringify(
                (function(){
                  switch(permission) {
                    case "media":
                      if(details.mediaTypes.includes("audio")) {
                        if(details.mediaTypes.includes("video")) {
                          return 'cammic'
                        }
                        return 'microphone'
                      }
                      return 'camera'
                    case 'midiSysex':
                      return 'midi'
                    default:
                      return permission
                  }
                })()
              )},
              camera: ${details.mediaTypes?details.mediaTypes.includes("video"):false},
              microphone: ${details.mediaTypes?details.mediaTypes.includes("audio"):false},
              text: ${
                JSON.stringify(
                  (function() {
                    switch (permission) {
                      case "mediaKeySystem":
                        return "play DRM-encrypted media?"
                      case "clipboard-read":
                        return "read your clipboard?"
                      case "notifications":
                        return "send you notifications?"
                      case "geolocation":
                        return "access your location?"
                      case 'midiSysex':
                        return 'have full control over your MIDI devices?'
                      case 'midi':
                        return "access your MIDI devices?"
                      case "media":
                        if(details.mediaTypes.includes("audio")) {
                          if(details.mediaTypes.includes("video")) {
                            return "access your camera and microphone?"
                          } else {
                            return "access your microphone?"
                          }
                        } else {
                          return "access your camera?"
                        }
                      case "pointerLock":
                        return "lock your mouse pointer?"
                      case "fullscreen":
                        return "display in fullscreen?"
                      default:
                        return `access your ${permission}?`
                    }
                  })()
                )
              }
            }
          )`
        }
      ]
    ).then((value)=>{
      callback(value?true:false);
    }).catch((error)=>{
      callback(false)
    })
  })
  /*public.setPermissionCheckHandler(function(){
    return false
  })*/
  createWindow()
  // testing plugin
  setTimeout(async function(){
    // todo: Run plugins, caus they WORK!
    console.log(await ibrx.tabs.getAll())
  },6000)
  /*tray = new Tray("border.png");
  tray.setToolTip("Border");
  var trayctx=Menu.buildFromTemplate([
    {type:'normal',label:"New Window",click: async () => {createWindow()}}
  ]);
  tray.setContextMenu(trayctx);
  */

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

function handlePrint(printWindow) {
return printWindow.webContents.getPrinters();
}

function respondToPrintEvent(){
  // todo
}

ipcMain.handle("context0",function(e,x,y){
  var context=new Menu();
  context.append(new MenuItem({
    type:'normal',
    enabled:true,
    click:function(item,window,event){
      e.sender.send("RIGHTCLICK_NTAB");
    },
    label:'New Tab'
  }));
  context.popup({window:BrowserWindow.getFocusedWindow()})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle("KillView",function(e,id){
  webContents.fromId(id).forcefullyCrashRenderer()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function parseFeaturesString(features, emit) {
  features = `${features}`
  // split the string by ','
  features.split(/,\s*/).forEach(feature => {
    // expected form is either a key by itself or a key/value pair in the form of
    // 'key=value'
    let [key, value] = feature.split(/\s*=/)
    if (!key) return

    // interpret the value as a boolean, if possible
    value =
      value === "yes" || value === "1"
        ? true
        : value === "no" || value === "0"
          ? false
          : value

    // emit the parsed pair
    emit(key, value)
  })
}
