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
    var view=new BrowserView({
      webPreferences: {
        nodeIntegration:true,
        contextIsolation:false
      }
    })
    var frame=view.webContents;
    frame.userAgent=("Mozilla/5.0 (border.i.xvm) Border/1.10 XVM/1.0.0");
    frame.loadURL("bluginxvm.html");
    var fmIsReady=false
    var actionQueue=[]
    var frameKilled=false
    frame.addEventListener('load-commit', event => {
      fmIsReady=true;
      var len=actionQueue.length;
      for(var i=0;i<len;i++) {
        var action=actionQueue.pop();
        if(action.name=="xvm.i.eval") {
          frame.executeJavaScript(action.value)
        } else if(action.name=="xvm.o.eval") {
          frame.executeJavaScript(
            `Xvm.Run({
              source:${JSON.stringify(action.value.source)},
              global: Xvm.GlobalScope||{},
              filename:${JSON.stringify(action.value.name)}
            })`
          )
        } else if(action.name=="xvm.o.global") {
          frame.executeJavaScript(
            `Xvm.GlobalScope=${action.value}`
          )
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
    frame.addEventListener('ipc-message',event => {
    console.log(event)
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
    holder.appendChild(frame);
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
        ipcRenderer.send('invoke.killwbc',frame.getWebContentsId())
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
          )
        } else {
          actionQueue.push({value:{source,name},name:'xvm.o.eval'})
        }
      },
      setGlobal: function (code) {
      if (frameKilled) { throw new Error("Cannot execute on dead frame") }
        if(fmIsReady) {
          frame.executeJavaScript(`Xvm.GlobalScope=${String(code)}`)
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
          frame.addEventListener('ipc-message',function (event) {
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


