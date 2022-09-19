const { ipcRenderer } = require('electron');
var electron=require('electron');
var {remote}=electron;
const nvm=require('node:vm');
const path=require('path')
const os=require('os')

var path_BLUGIN=os.homedir+"/.config/Border_Browser/blugins";

if(os.platform()=="win32") {
  path_BLUGIN=os.homedir+"\\AppData\\Local\\Border_Browser\\blugins"
}


const fs=require("fs");

fs.exists(path_BLUGIN,(x) => {var err=!x
  if(err) {
    fs.mkdir(path_BLUGIN,{ recursive: true },(e)=>{if(e){alert(e)}});
  }
  fs.exists(path_BLUGIN+(os.platform()=="win32"?"\\":"/")+"bjs",(d) => {var g=!d
		if(g) {
		  fs.mkdir(path_BLUGIN+(os.platform()=="win32"?"\\":"/")+"bjs",{ recursive: true },(e)=>{if(e){alert(e)}});
		}
	})

	fs.exists(path_BLUGIN+(os.platform()=="win32"?"\\":"/")+"brx",(o) => {var y=!o

		if(y) {
		  fs.mkdir(path_BLUGIN+(os.platform()=="win32"?"\\":"/")+"brx",{ recursive: true },(e)=>{if(e){alert(e)}});
		}
	})
})








var XVM = {
  Version: function () {
    return {
      buildId: "AAKB7XQ8D-WE7BB93D4C-3S0P3L9G",
      release: 'XVM Runner (Stable)',
      channel: 'xvm.stable',
      version: '1.0.0'
    }
  },
  Runner: function () {
    var holder=document.querySelector(".xvm-container");
    var frame=document.createElement('webview');
    frame.src="bluginxvm.html";
    frame.nodeintegration=true;
    frame.nodeintegrationinsubframes=true
    frame.webpreferences="contextIsolation=no"
    frame.useragent=("Mozilla/5.0 (border.i.xvm) Border/1.10 XVM/1.0.0");
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
  },
  sandBoxedHTML:function(page,preload) {
    var frameKilled=false;
    var frame=document.createElement('webview');
    var xIPCe=[];
    frame.src=page;
    frame.nodeintegration=true;
    frame.preload=preload;
    document.querySelector(".xvm-container").appendChild(frame);
    frame.addEventListener('ipc-message',event=> {
    console.log(event.channel,...event.args);
		  for(var i=0;i<xIPCe.length;i++) {
		  	if(xIPCe[i].name===event.channel) {
		    	try{xIPCe[i].cb(...event.args)}catch(e){console.warn(e)}
		    }
		  }
    });
  	return {
  		kill: function() {
      	if (frameKilled) { throw new Error("Cannot execute on dead frame") }
        ipcRenderer.invoke('invoke.killwbc',frame.getWebContentsId())
        frameKilled=true
      },
      frame,
      eval: function(e){frame.executeJavaScript(e,true)},
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
          frame.send(`${name}`,...args)
        }
      },
  	}
  }
}



function A_timeout(MS){
return new Promise(resolve=>setTimeout(function(){resolve()},MS))
}


function A_inVokeOnWbv(id,{channel,args,webview}) {
 return new Promise(resolve => {
  var listener=function(event) {
    console.log('event')
    if(event.channel=="reply-"+channel+"-"+id) {
      webview.removeEventListener('ipc-message',listener);
      resolve(event.args[0])

    }
  }
  webview.addEventListener('ipc-message',listener)
  webview.send(channel,[
    {
      id:id,
      args:args
    }
  ]);
 })
}



let ContentSettings={
  get:function(p,o) {
    try{
      var d=JSON.parse(localStorage.getItem("permissions"))||{}
    } catch (error) {
      d={} 
    }
    if(!d[o]) {
      d[o]={}
      localStorage.setItem("permissions",JSON.stringify(d))
      return 'ask'
    }
    if(!d[o][p]) {
      return 'ask'
    }
    return d[o][p]
  },
  origins:function(){
    try{
      var d=JSON.parse(localStorage.getItem("permissions"))||{}
    } catch (error) {
      d={} 
    }
    return Object.keys(d)
  },
  set:function(p,o,x) {
    try{
      var d=JSON.parse(localStorage.getItem("permissions"))||{}
    } catch (error) {
      d={}
    }
    if(!d[o]) {
      d[o]={}
    }
    d[o][p]=x
    localStorage.setItem(
      'permissions',JSON.stringify(d)
    )
  }
}


class Border {
  isValidHexColor(entry) {
    if(!entry) { return false }
    entry=entry.toLowerCase()
    var allowed="abcdef0123456789"
    if(entry[0]!="#") { return false }
    if((entry.length!=7)&&(entry.length!=8)&(entry.length!=4)&&(entry.length!=5)) { return false }
    entry=entry.slice(1)
    for(var i=0;i<entry.length;i++) {
      if(!allowed.includes(entry[i])) { return false }
    }
    return true
  }
  getValidHex(color) {
    if(!color) {return null}
    if(! this.isValidHexColor(color)) {
      return null
    }
    return color
  }

  #Files = {}
 /** Creates a new browser instance. */
  constructor() {
      const sync = async () => {
          this.#Files.config = {
              theme: {
                  currentTheme: "default",
                  primary: this.getValidHex(localStorage.getItem("theme-primary"))||"#4e2493",
                  secondary: this.getValidHex(localStorage.getItem("theme-secondary"))||"#ffe5fb",
              },
              window: {
                  customTitlebar: true,
                  height: 550,
                  width: 650,
              },
              browser: {
                  defaultPage: "border://newtab",
                  enableShortcuts: true,
              },
          };
          this.#Files.bookmarks = [];
          this.#Files.whitelist = [];
        var bkml=localStorage.getItem("borderbkm")
        try{
          this.bookmarks=JSON.parse(bkml)||[]
        }catch(EEeE) {
          //null
        }
        localStorage.setItem(
          "borderbkm",
          JSON.stringify(this.bookmarks)
        )
    
        await this.startStyleService()
          await this.#main();

      }
      sync();
  }

  // Variable declaration
 themeList=[]
  #tabNb = 0;
  #tabId = [];
  #browserBody;
/** starts the FAR(Text Search) service in the current tab. */
startFAR() {
  var acttb=document.querySelector('.border-tab.border-current');
  var webview=document.querySelector('.border-view.border-current');
  if(!acttb) {return}
  var id=acttb.dataset.id
  if(document.querySelector('.border-find-dialog[id="'+id+'"]')) {
    return document.querySelector('.border-find-dialog[id="'+id+'"] input').focus()
  }
  var ui=this.createFindDialog(
    id
  );
  var onfind=function(e){
    console.log(e)
    ui.found=e.result.matches
    ui.result=e.result.activeMatchOrdinal
  }
  webview.addEventListener('found-in-page',onfind)
  ui.onexit=function() {
    webview.stopFindInPage("keepSelection")
    webview.removeEventListener('found-in-page',onfind)
  }
  var val=""
  ui.ontext=function(text) {
    val=text
    webview.findInPage(text,{
      findNext:true
    })
    if(text.length==0) {
      ui.found=0
    }
  }
  ui.onnext=function () {
    webview.findInPage(val,{
      findNext:false,
      forward:true
    })
  }
  ui.onprev=function () {
    webview.findInPage(val,{
      findNext:false,
      forward:false
    })
  }
}
back() {
  document.querySelector(".border-view.border-current").goBack()
}
forward(){
  document.querySelector(".border-view.border-current").goForward()
}
/** The items to show when the three-dot menu is clicked. */
dotmenu=[
  {
    name: "New Tab",
    action: () => {
      this.addTab({
        current:true
      })
    }
  },
  {
    name: "New Window",
    action: () => {
      ipcRenderer.send("new-window")
    }
  },
  {
    name: "Show bookmark bar",
    checked:true,
    type:"checkbox",
    action:()=>{
      this.dotmenu[2].checked=!this.dotmenu[2].checked
      var bar=document.querySelector(".border-bookmark-bar")
      if(this.dotmenu[2].checked) {
        bar.style.display=""
      } else {
        bar.style.display="none"
      }
    }
  },
  {
    name: "Find",
    action: ()=>{
      this.startFAR()
    }
  },
  {
    name: "About Border",
    action: () => {
      this.addTab({
        current:true,
        url:"border://about"
      })
    }
  }
]


getNextAvalibleBluginIndex() {
	return new Promise((resolve,reject) => {
	  fs.readdir(path_BLUGIN+(os.platform()=="win32"?"\\":"/")+"bjs",{},function(error,files) {
	    if(error) { reject( error ) }
	    else { resolve ( files . length ) }
	  })
	})
}

/** An arry of bookmark objects. */
bookmarks = []
/** Saves the bookmarks to your device. */
saveBkm() {
      localStorage.setItem(
          "borderbkm",
          JSON.stringify(this.bookmarks)
        )
}
/** Deletes a bookmark by an array index. */
/** @param id{number} - The id of the bookmark to remove. */
rmBkm(id) {
  var bkm=[]
  var obm=this.bookmarks
  obm.forEach((v,i)=>{
    if(i!=id) {
      bkm.push(v)
    }
  })
  this.bookmarks=bkm
  this.saveBkm()
}
/** 
 * Adds a bookmark. 
 * @param title{string} - The name of the bookmark.
 * @param url{string} - The path to visit when the bookmark is clicked.
*/
addBkm(title,url) {
  this.bookmarks.push({
    title:title,
    url:url
  })
  this.saveBkm()
}
/**
* Creates a Multi-Purpose menu.
* @param x{number} - The X position of the menu.
* @param y{number} - The Y position of the menu.
* @param menu{[{type?:'normal'|'checkbox',checked?:boolean,name:string,action:()=>any}]} - The array of MenuItems.
*/
hideMenu() {
  var allcotx=document.querySelectorAll('.border-context-menu');
      for(var i=0;i<allcotx.length;i++) {
        try{
          allcotx[i].parentNode.removeChild(allcotx[i])
        }catch(er0r0r0r){console.error(er0r0r0r)}
      }
      document.querySelector('.border-options-menu').style.display="none"
}
populateMenu(x,y,menu) {
  var allcotx=document.querySelectorAll('.border-context-menu');
      for(var i=0;i<allcotx.length;i++) {
        try{
          allcotx[i].parentNode.removeChild(allcotx[i])
        }catch(er0r0r0r){console.error(er0r0r0r)}
      }
  document.querySelector('.border-options-menu').style.display="none"
  var tdm=document.createElement("div")
  tdm.className="border-context-menu"
  if(y>(window.innerHeight/2)) {
  	tdm.style.bottom=(window.innerHeight-x)+"px"
  } else {
  	tdm.style.top=y+"px"
  }
  if(x>(window.innerWidth/2)) {
  	tdm.style.right=(window.innerWidth-x)+"px"
  } else {
  	tdm.style.left=x+"px"
  }
      for(var i=0;i<menu.length;i++) {
        (function(f){
          var g=document.createElement('div')
          g.innerText=f.name
          g.className="border-menu-option"
          g.onclick=function(){
            f.action()
          }
          if(f.type=="checkbox") {
            if(f.checked) {
              var mark=document.createElement("span")
              mark.className="border-check-mark"
              g.appendChild(mark)
            }
          }
          tdm.appendChild(g)
        })(menu[i])
      }
  document.querySelector('#border-root').appendChild(tdm)
      return tdm
}
/**
* Starts the Theme service.
*/
async startStyleService() {
  var oid=""
  setInterval(() => {
    var elem=document.getElementById("theme-css");
    var sty=localStorage.getItem('themeid')
    if(!sty) {
      sty="border.default"
      localStorage.setItem('themeid',sty)
    }
    if(oid===sty) {
      return
    }
    oid=sty
    if(sty=="border.default") {
      elem.innerHTML=`@import url('https://fonts.googleapis.com/css2?family=Lexend&display=swap');

body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#border-root>* {
  padding: 0;
  margin: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

#border-root>.w96-menubar {
  background: var(--border-primary);
  color: var(--border-secondary);
}

#border-root {
  width: 100%;
  height: 100vh;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  font-family: 'Lexend', sans-serif;
}

#border-menu,
#border-titlebar {
  width: 100%;
  height: 60px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: row;
  background: var(--border-primary);
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

#border-titlebar {
  background: var(--border-secondary);
}

#border-tab-menu {
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  flex: 1;
  overflow-x: auto;
}

#border-tab-container::-webkit-scrollbar {
  display: none;
}

#border-tab-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-overflow-style: none;
  /* IE 11 */
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  /* Firefox 64 */
}

.border-tab {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  color: var(--border-secondary);
  -webkit-box-pack: space-around;
  -ms-flex-pack: space-around;
  justify-content: space-around;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 150px;
  min-width: 200px;
  border-radius: 20px;
  height: 80%;
  margin: 15px 10px;
  background: var(--border-primary);
  -webkit-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  overflow: hidden;
}

.border-view {
  display: none;
}

#border-add-button {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  color: var(--border-secondary);
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-left: 10px;
  border-radius: 50px;
  min-height: 40px;
  min-width: 40px;
  background: var(--border-primary);
}

#border-add-button>h2 {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

#border-search-button,
.border-history-btn {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  color: var(--border-primary);
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 50px;
  min-height: 35px;
  min-width: 35px;
  background: var(--border-secondary);
  margin: 0 8px;
}

.border-tab.border-current {
  border-radius: 20px 20px 0 0;
  transform: translateY(8px);
}

.border-view.border-current {
  display: block;
}

#border-searchbar {
  border: none;
  margin: 10px;
  padding: 10px;
  width: 100%;
  border-radius: 999px;
  color: var(--border-primary);
  background: var(--border-secondary);
}

#border-view-container,
.border-view {
  width: 100%;
  height: 100%;
  border: none;
  background: var(--border-primary);
}

.border-bookmark-bar {
display: flex;
flex-direction: row;
background: var(--border-primary);
scrollbar-width: none;
-ms-overflow-style: none;
width: 100%;
min-height:20px;
}

.border-bookmark-bar::-webkit-scrollbar {
display:none;
user-select:none;
}

.border-bookmark {
color: var(--border-secondary);
margin-left: 8px;
margin-right: 8px;
user-select:none;
cursor:pointer;
}

.border-title,
.border-close-btn,
#border-search-button,
#border-add-button,
.border-history-btn,
.border-ctrl-btn {
  cursor: pointer;
}

.border-title,
.border-close-btn,
#border-search-button,
#border-add-button,
.border-history-btn,
#border-searchbar,
.border-ctrl-btn {
  font-size: 15px;
}

.border-found-count {
color:var(--border-secondary);
}

path[class *="border-svg-icon"] {
  fill: var(--border-primary);
}

path.border-svg-icon-close,
path.border-svg-icon-add,.border-svg-secondary path {
  fill: var(--border-secondary);
}

.border-options-menu {
position: fixed;
right: 7px;
top: 105px;
color: var(--border-secondary);
border-radius: 9px;
background-color:var(--border-primary);
filter: drop-shadow(10px 10px 4px #00000072);
border-width: 2px;
border-color:var(--border-secondary);
border-style: solid;
padding: 8px;
min-width:167px;
animation-duration:450ms;
animation-name: border-menu-fadein;
}

.border-options-menu {
position: fixed;
right: 7px;
top: 105px;
color: var(--border-secondary);
border-radius: 11px;
background-color:var(--border-primary);
filter: drop-shadow(10px 10px 4px #00000072);
border-width: 2px;
border-color:var(--border-secondary);
border-style: solid;
padding: 8px;
min-width:167px;
animation-duration:450ms;
animation-name: border-menu-fadein;
}

.border-context-menu {
position: fixed;
z-index: 10000;
color: var(--border-secondary);
border-radius: 11px;
background-color:var(--border-primary);
filter: drop-shadow(10px 10px 4px #00000072);
border-width: 2px;
border-color:var(--border-secondary);
border-style: solid;
padding: 8px;
min-width:167px;
animation-duration:450ms;
animation-name: border-menu-fadein;
}

.border-menu-option {
padding:9px;
cursor:pointer;
}

.border-check-mark {
float: right;
height: 10px;
width: 5px;
border-width: 0 3px 3px 0;
border-style: solid;
border-color: var(--border-secondary);
-webkit-transform: rotate(45deg);
-ms-transform: rotate(45deg);
transform: rotate(45deg);
}

@keyframes border-menu-fadein {
0% {opacity:0}
100% {opacity:1}
}

.border-options-menu,.border-menu-option,.border-view {
user-select:none;
}

#border-ctrl-btn-container {
width: 100px;
height: 100%;
display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
justify-content: space-evenly;
}

.border-bookmark-popup {
  position: fixed;
  color: var(--border-secondary);
  background-color: var(--border-primary);
  height: 300px;
  width: 300px;
  filter: drop-shadow(10px 10px 4px #00000072);
  border-width: 2px;
  border-color:var(--border-secondary);
  border-style: solid;
  border-radius: 11px;
  top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
  }

  .border-alert-dialog {
    position: fixed;
    color: var(--border-secondary);
    background-color: var(--border-primary);
    width: 300px;
    filter: drop-shadow(10px 10px 4px #00000072);
    border-width: 2px;
    border-color:var(--border-secondary);
    border-style: solid;
    border-radius: 11px;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction:column;
    }

.border-popup-title {
margin: 0px;
}

.border-popup-body {
margin-bottom: 2px;
margin-top:2px;
}

.border-popup-title {
font-size: 24px;
}

.border-action {
  padding: 10px;
  font-size:14px;
  color: var(--border-primary);
  background-color: var(--border-secondary);
  border: none;
  outline: none;
  border-radius:30px;
  }

  .border-alert-action {
    padding: 8px;
    font-size:13px;
    color: var(--border-primary);
    background-color: var(--border-secondary);
    border: none;
    outline: none;
    border-radius:20px;
    text-align:center;
    padding-left:17px;
  padding-right:17px;
  display:inline-block;
    }

.border-default-action {
padding: 10px;
font-size:14px;
background-color: var(--border-primary);
color: var(--border-secondary);
border: none;
outline: none;
border-radius:30px;
border-width: 2px;
border-color:var(--border-secondary);
border-style: solid;
}

.border-ok-action {
  padding:8px;
  font-size:13px;
  background-color: var(--border-primary);
  color: var(--border-secondary);
  border: none;
  outline: none;
  border-radius:20px;
  border-width: 2px;
  border-color:var(--border-secondary);
  border-style: solid;
  padding-left:17px;
  padding-right:17px;
  display:inline-block;
  text-align:center;
  }

.border-nbkm-title,.border-nbkm-href {
border-radius: 25px;
padding:8px;
font-size: 15px;
color: var(--border-primary);
background-color: var(--border-secondary);
border:none;
}

.border-text-finders {
position: fixed;
top: 90px;
right: 5px;
}

.border-popup-buttons {
  left: 0px;
  bottom: 3px;
  width:100%;
  text-align:center; 
  }

  .border-alert-buttons {
    left: 0px;
    bottom: 3px;
    width:100%;
    text-align:right; 
    }

.border-find-button {
fill: var(--border-secondary);
}

.border-find-dialog {
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
background-color: var(--border-primary);
padding: 5px;
border-radius:15px;
filter: drop-shadow(10px 10px 4px #00000072);
border:1px solid;
border-color:var(--border-secondary);
}

.border-blugins-dialog {
border-radius: 11px;
padding: 8px;
animation-duration:450ms;
animation-name: border-menu-fadein;
top: 105px;
right: 57px;
z-index: 999;
background-color: var(--border-primary);
border-color:var(--border-secondary);
color: var(--border-secondary);
position: fixed;
border:1px solid;
}

.border-find-dialog svg,.border-find-dialog .border-find-input,.border-found-count {
margin-left: 4px;
margin-right: 4px;
}

.border-find-input {
outline: none;
border: none;
color: var(--border-secondary);
background: var(--border-primary);
font-size: 16px;
}

.border-blm-entry {
display:flex;
flex-direction:row;
}

.border-blm-entry .border-blme-text {
  width: 100%;
  font-size: 16px;
}
.border-blme-icon {
  height:16px;
  width:16px;
  vertical-align: middle;
}

.border-blm-entrybox::-webkit-scrollbar {
	display:none;
}
.border-blm-entrybox {
  overflow: auto;
  max-height: 300px;
}

.border-blm-title {
	font-size: 21px;
	margin:0;
}

.border-blm-seperator {
  height: 0px;
  width: 100%;
  border-top: 2px solid;
  border-color: var(--border-secondary);
  margin-top: 9px;
  margin-bottom: 9px;
}`;
    } else {
      elem.innerHTML=(this.themeList[sty]||{}).css||""
    }
  },20)
  var ot="[]"
  setInterval(()=> {
    var ts=localStorage.getItem('themes')
    if(ot==ts) {
      return
    }
    ot=ts
    try {
      var thma=[];
          var thml=JSON.parse(ts)
          for(var i=0;i<thml.length;i++) {
            var thm=thml[i]
            if(thm.name&&thm.author&&thm.css) {
              thma.push(thm)
            }
          }
      this.themeList=thma
        } catch(er0r){null}
  },10)
}
loadBookMarks() {
  try {
    this.bookmarks=JSON.parse(localStorage.getItem('borderbkm'))||[]
  } catch (f) {0}
}
/** Loads the bookmarks into the bookmark bar */
populateBookMarks() {
  var bar=document.querySelector('.border-bookmark-bar');
  var bdr=this
  var bkm=this.bookmarks
  bar.innerHTML=""
  var cmenu=this.populateMenu
  for(var i=0;i<bkm.length;i++) {
    var bke=document.createElement("div")
    bke.className="border-bookmark"
    bke.innerText=bkm[i].title
    bke.dataset.url=bkm[i].url
    bke.addEventListener('click',function(e){
      document.querySelector("#border-searchbar").value=this.dataset.url
      document.querySelector("#border-search-button").click()
    })
    bke.addEventListener('auxclick',function(e){
      if(e.button==1) {
        e.preventDefault()
        bdr.addTab({
          current:false,
          url:this.dataset.url
        })
      }
    })
    bke.addEventListener('contextmenu',function(e){
      var el=this
      e.preventDefault()
      e.stopPropagation()
      cmenu(e.clientX,e.clientY,[
        {
          name: 'Delete',
          action:function() {
            bdr.rmBkm(el.dataset.bkmid)
            bdr.populateBookMarks()
          }
        }
      ])
    })
    bke.dataset.bkmid=i
    bar.appendChild(bke)
  }
}
  /** The current version of Border. */
/** @readonly */
  version = "1.10";
/** The current release channel of Border. */
/** @readonly */
  releaseChannel="stable"
 /**
 * An array of KeyBinds to activate browser features.
 * @deprecated Is only used in Web and w96 versions of Border.
*/
  keybinds = [
      {
          keys: ["Alt", "l"],
          description: "Focus the searchbar",
          exec: () => {
              this.#browserBody.querySelector("#border-searchbar").focus();
          },
      },
      {
          keys: ["Alt", "t"],
          description: "Open a new tab",
          exec: () => {
              this.addTab({ current: true });
          },
      },
      {
          keys: ["Alt", "w"],
          description: "Close the current tab",
          exec: () => {
              this.removeTab(
                  this.#browserBody.querySelector(".border-tab.border-current").dataset.id
              );
          },
      },
      {
          keys: ["Alt", "a"],
          description: "Open an about tab",
          exec: () => {
              this.addTab({ current: true, url: "border://about" });
          },
      },
  ];
  /** Contains the raw HTML of border:// URLs. */
  protocols = {
      newtab: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Tab</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Lexend'; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; overflow: hidden; font-family: 'Lexend', sans-serif; color: white;">
<div id="centered" style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start;">
<img style="margin-bottom: 30px;" src="data:image/png;base64,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">
<input type="text" id="search" placeholder="Search on Google..." style="padding: 10px 15px; width: 450px; border-radius: 30px; border: none;">
</div>
<script>
const search = document.getElementById("search");

search.addEventListener("keydown", (e) => {
if (e.code === "Enter") {
handledValue = encodeURI("https://google.com/search?igu=1&q=" + search.value.replace(" ", "+"))
location.href = handledValue;
}
});
</script>
</body>
</html>
`,
      changelog: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Tab</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
</head>
<body style="width: calc(100vw - 30px * 2); height: calc(100% - 30px * 2); overflow: auto; font-family: 'Lexend', sans-serif; padding: 30px; margin: 0; color: white;">
<img src="data:image/png;base64,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">
<h1>${this.version} changelog.</h1>
<ul>
  <li>All the UI has been redesigned. (delete default.css to see changes)</li>
  <li>No more text icon. Border use SVG icons now.</li>
  <li>All the code has been rewrited.</li>
  <li>Border has now an API.</li>
  <li>About button redirect now on "border://about" instead of an info window.</li>
  <li>Bug fixes.</li>
  <li>Border now show a page when you are offline.</li>
  <li>Bookmarks can now be named and deleted via UI.</li>
  <li>Bang search has been replaced with smart search.</li>
  <li>"border://urls" added.</li>
  <li>"border://shortcuts" added.</li>
  <li>"border://themes" added.</li>
  <li>"border://404" removed.</li>
</ul>
</body>
</html>
`,
      about: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Tab</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
</head>
<body style="width: calc(100vw - 30px * 2); height: calc(100vh - 30px * 2); overflow: hidden; font-family: 'Lexend', sans-serif; padding: 30px; margin: 0; color: white;">  
<span style="display: inline-block; font-size: 50px;">About&nbsp;</span>
<img style="display: inline-block; width: 150px;" src="data:image/png;base64,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">
<p>
Border is an iframe Web browser developped by Onofficiel<br>
accessible on all platforms.<br>
Because of the iframe system some website won't work in this browser (like youtube.com).
</p>

<p style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%)">Border v${this.version} | © Onofficiel - 2022 - All rights reserved</p>
</body>
</html>
`,
      shortcuts: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Tab</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
</head>
<body style="width: calc(100vw - 30px * 2); height: calc(100% - 30px * 2); overflow: auto; font-family: 'Lexend', sans-serif; padding: 30px; margin: 0; color: white;">
<img style="display: inline-block; width: 150px;" src="data:image/png;base64,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">
<span style="display: inline-block; font-size: 50px;">&nbsp;shortcuts</span>

<ul>
  ${Object.entries(this.keybinds).map(([_key, value]) => `<li>${value.description}: ${value.keys.join("+")}</li>`).join("<br>")
          }
</ul>
</body>
</html>
`,
      offline: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Not Connected</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
</head>
<body style="width: 100vw; height: 100vh; display: flex; justify-content: flex-start; align-items: center; overflow: hidden; font-family: 'Lexend', sans-serif; margin-left: 30px; color: white; background: rgb(172, 167, 53)">
  <div style="margin-left: 10px;">
      <img style="margin-bottom: 10px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFRSURBVHgB7d3BDQMxCABBJ7r+W06uCB5oPdOBteKH8Ocs93udxT6vs9j3kCZwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxz/TO0/YdpduY4DiB4wSOEzhO4DiB4wSOEzhO4DiB4wSOEzhO4DiB4wSOEzhO4DiB4wSOe86w7XetbmOC4wSOEzhO4DiB4wSOEzhO4DiB4wSOEzhO4DiB4wSOEzhO4DiB4wSOEzhu/U2r2/4unH6vCY4TOE7gOIHjBI4TOE7gOIHjBI4TOE7gOIHjBI4TOE7gOIHjBI4TOE7gODtZcSY4TuA4geMEjhM4TuA4geMEjhM4TuA4geMEjhM4TuA4geMEjhM4TuA4gePG/y68zfSdrGkmOE7gOIHjBI4TOE7gOIHjBI4TOE7gOIHjBI4TOE7gOIHjBI4TOE7gOIHj/tV+GOxT3UC5AAAAAElFTkSuQmCC">
      <div style="margin-bottom: 20px;">
          <span style="font-size: 20px;">...Crrr...</span><br>
          <span style="font-size: 30px;">I don't receive you well Commander</span><br>
          <span style="font-size: 20px;">...Crrr...</span>
      </div>
      <div>
          <div style="font-size: 20px;">No Internet Connection.</div>
          <div style="font-size: 15px;">Verify your settings.</div>
      </div>
  </div>
</body> 
</html>
`,
      woozy: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Woooooooozy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
</head>
<body style="width: 100vw; height: 100vh; display: flex; justify-content: flex-start; align-items: center; overflow: hidden; font-family: 'Lexend', sans-serif; margin-left: 50px; color: white; background: rgb(255, 204, 77)">
  <div id="centered">
      <img src="data:image/png;base64,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">
  </div>
</body>
</html>
`,
      themes: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Border themes</title>
</head>
<body style="width: 100vw; height: 100vh; margin: 0;">
<iframe width="100%" height="100%" frameborder=0 src="https://onofficiel.github.io/border/themes"></iframe>
</body>
</html>
`,
  };
  /**
* Returns the URL to navigate and text to display in the tab title.
* @param url{string} - The URL to correct
  */
  #handleURI(url) {
      if (url.startsWith("//")) return ["https://" + url.substring(2), false];

      if (/^\S*:/i.test(url)) {
          return [url, false];
      } else {
          if (/^([-a-zA-Z0-9^\p{L}\p{C}\u00a1-\uffff@:%_\+.~#?&//=]{2,256}){1}(\.[a-z]{2,4}){1}(\:[0-9]*)?(\/[-a-zA-Z0-9\u00a1-\uffff\(\)@:%,_\+.~#?&//=]*)?([-a-zA-Z0-9\(\)@:%,_\+.~#?&//=]*)?$/i.test(url)) {
              return ["https://" + url, false];
          }
          else {
              return [encodeURI("https://google.com/search?igu=1&q=" + url.replace(" ", "+")), false];
          }
      }
  }

  // BORDER API
/**
* Creates a new browser tab.
* @param tab{{url?:string,current?:boolean}} - The tab configuration.
*/
  addTab(tab) {
      if (!tab)
          throw new Error("You have to add an object for creating a tab.");
      if (!tab.url) tab.url = this.#Files.config.browser.defaultPage;

      // Create an html tab div
      let tabElement = document.createElement("div");
      tabElement.draggable = true;
      tabElement.classList.add("border-tab");
      tabElement.classList.add("nodrag");
      tabElement.dataset.id = this.generateId();
      tabElement.dataset.url = tab.url;
      tabElement.innerHTML =
          `
<div class='border-title'>Name Undefined</div>
<div class='border-close-btn'>
<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 43 43" fill="none">
<path class="border-svg-icon-close" d="M28.2843 21.2132L42.4264 7.07107L35.3553 1.19209e-06L21.2132 14.1421L7.07107 0L1.19209e-06 7.07107L14.1421 21.2132L0 35.3553L7.07107 42.4264L21.2132 28.2843L35.3553 42.4264L42.4264 35.3553L28.2843 21.2132Z" fill="#66239A"/>
</svg>
</div>
`;

      tabElement.addEventListener("click", () => {
          this.setCurrent(tabElement.dataset.id);
      });

      tabElement.addEventListener("contextmenu", (e) => {
          const tabIndex = Array.prototype.indexOf.call(
              tabElement.parentNode.children,
              tabElement
          );
      });

      tabElement
          .querySelector(".border-close-btn")
          .addEventListener("click", () => {
              this.removeTab(tabElement.dataset.id);
          });

      this.#browserBody.querySelector("#border-tab-container").appendChild(tabElement);
      // <

      // Create an html view tab
      let viewElement = document.createElement("webview");
      viewElement.partition="persist:BorderProfile-Profile1"
      setInterval(function() {
        var title=""
        try {
         title=viewElement.getTitle()||viewElement.src
        } catch (error) {
          title=viewElement.src
        }
        if(title.length>20) {
          title=title.slice(0,18)+"..."
        }
        tabElement.querySelector('.border-title').innerText=title
      },10)
      var self=this
      viewElement.allowpopups=true
      viewElement.classList.add("border-view");
      viewElement.dataset.id = tabElement.dataset.id;
      viewElement.addEventListener("focus", ()=>document.querySelector(".border-blugins-dialog").style.display="none");
      viewElement.addEventListener('ipc-message',function(event) {
        var details=event.args[0]
        if(event.channel=="get-cs") {
          viewElement.sendToFrame(
            event.frameId,
            "respond-cs",
            {
              requestID:details.requestID,
              value: ContentSettings.get(
                details.permission,
                details.origin
              ),
              permission:details.permission
            }
          )
        } else if(event.channel=="set-cs") {
          ContentSettings.set(
            details.permission,
            details.origin,
            details.value
          )
        } else if(event.channel=="gore-cs") {
          viewElement.sendToFrame(
            event.frameId,
            "origins-cs",
            {
              requestID: details.requestID,
              origins: ContentSettings.origins()
            }
          )
        }
      })
      viewElement.addEventListener('ipc-message', event => {
        if(event.channel=="get-os-revision") {
          viewElement.sendToFrame(
            event.frameId,
            'OSREVISION@'+event.args[0].requestID,
            navigator.userAgent
          )
        }
      })
      viewElement.addEventListener("ipc-message",function(event) {
        if(event.channel=="permission-request") {
          var details=event.args[0]
          if(details.permission=="cammic") {
            if(ContentSettings.get('camera',details.origin)=="deny"||ContentSettings.get('microphone',details.origin)=="deny") {
              return viewElement.sendToFrame(
                event.frameId,
                "permission-response",{
                  requestID:details.requestID,
                  permission:details.permission,
                  allowed: false
                }
              )
            }
            if(ContentSettings.get('camera',details.origin)=="allow"&&ContentSettings.get('microphone',details.origin)=="allow") {
              return viewElement.sendToFrame(
                event.frameId,
                "permission-response",{
                  requestID:details.requestID,
                  permission:details.permission,
                  allowed: true
                }
              )
            }
            var askDialog=self.createAlert("Permission Request", {
              body: `Allow ${details.origin} to ${details.text}`,
              webview: viewElement,
              buttons: [
                {
                  label: "Allow",
                  onclick: function () {
                    viewElement.sendToFrame(
                      event.frameId,
                      "permission-response",{
                        requestID:details.requestID,
                        permission:details.permission,
                        allowed: true
                      }
                    )
                    ContentSettings.set("camera",details.origin,"allow")
                    ContentSettings.set("microphone",details.origin,"allow")
                    askDialog.close()
                  },
                  default: true
                },
                {
                  label: "Deny",
                  onclick: function () {
                    viewElement.sendToFrame(
                      event.frameId,
                      "permission-response",{
                        requestID:details.requestID,
                        permission:details.permission,
                        allowed: false
                      }
                    )
                    ContentSettings.set("camera",details.origin,"deny")
                    ContentSettings.set("microphone",details.origin,"deny")
                    askDialog.close()
                  }
                }
              ]
            })
            return
          }
          if(details.permission=="fullscreen"||details.permission=="pointerLock") {
            return viewElement.sendToFrame(
              event.frameId,
              "permission-response",{
                requestID:details.requestID,
                permission:details.permission,
                allowed: true
              }
            )
          }
          if(ContentSettings.get(details.permission,details.origin)==="allow") {
            return viewElement.sendToFrame(
              event.frameId,
              "permission-response",{
                requestID:details.requestID,
                permission:details.permission,
                allowed: true
              }
            )
          }
          if(ContentSettings.get(details.permission,details.origin)==="deny") {
            return viewElement.sendToFrame(
              event.frameId,
              "permission-response",{
                requestID:details.requestID,
                permission:details.permission,
                allowed: false
              }
            )
          }
          var askDialog=self.createAlert("Permission Request", {
            body: `Allow ${details.origin} to ${details.text}`,
            webview: viewElement,
            buttons: [
              {
                label: "Allow",
                onclick: function () {
                  viewElement.sendToFrame(
                    event.frameId,
                    "permission-response",{
                      requestID:details.requestID,
                      permission:details.permission,
                      allowed: true
                    }
                  )
                  ContentSettings.set(details.permission,details.origin,"allow")
                  askDialog.close()
                },
                default: true
              },
              {
                label: "Deny",
                onclick: function () {
                  viewElement.sendToFrame(
                    event.frameId,
                    "permission-response",{
                      requestID:details.requestID,
                      permission:details.permission,
                      allowed: false
                    }
                  )
                  ContentSettings.set(details.permission,details.origin,"deny")
                  askDialog.close()
                }
              }
            ]
          })
        }
      })

      this.#browserBody.querySelector("#border-view-container").appendChild(viewElement);
      // <

      // After Created Action
      if (tab.current) {this.setCurrent(tabElement.dataset.id);}
      // <
      setTimeout(()=>{ipcRenderer.send(
        'attach-on-open',
        viewElement.getWebContentsId()
      )},100)
      viewElement.addEventListener('ipc-message',function(event) {
        if(event.channel=="theme-install") {
          bws.createThemeInstallPopup(event.args[0].themeData,tabElement.dataset.id)
        } else if(event.channel=="get-themes") {
          viewElement.sendToFrame(event.frameId,"theme-list",bws.themeList)
        } else if(event.channel=="get-color-scheme") {
          viewElement.sendToFrame(event.frameId,"user-colors",{
            primary: bws.getValidHex(localStorage.getItem("theme-primary"))||"#4e2493",
            secondary: bws.getValidHex(localStorage.getItem("theme-secondary"))||"#ffe5fb",
          })
        } else if(event.channel=="set-scheme-primary") {
          localStorage.setItem('theme-primary',event.args[0])
        } else if(event.channel=="set-scheme-secondary") {
          localStorage.setItem('theme-secondary',event.args[0])
        } else if(event.channel=="set-theme-id") {
          localStorage.setItem('themeid',event.args[0])
        } else if(event.channel=="get-theme-id") {
          viewElement.sendToFrame(
            event.frameId,
            "themeid",
            localStorage.getItem("themeid")||"border.default"
          )
        } else if(event.channel=="rm-theme") {
          var id=event.args[0]
          var themes=bws.themeList.concat([])
          var rmd=[]
          for(var i=0;i<themes.length;i++) {
            if(i!=id) {
              rmd.push(themes[i])
            }
          }
          localStorage.setItem('themes',JSON.stringify(rmd))
          if(localStorage.getItem("themeid")==id) {
            localStorage.setItem("themeid",'border.default')
          }
        } else if(event.channel=="mktab") {
          bws.addTab({current:true,url:event.args[0]})
        }
      })
      viewElement.preload="border-public-preload.js"
      viewElement.src=this.#handleURI(tab.url)[0]
    var UU$=tab.url||"border://newtab"
    setInterval(function(){
      if(UU$==viewElement.src) { return }
      UU$=viewElement.src
      tabElement.dataset.url=viewElement.src
      if(tabElement.classList.contains('border-current')) {
        document.querySelector("#border-searchbar").value=viewElement.src
      }
    },20)
    var cmenu=this.populateMenu
    var bws=this
    tabElement.addEventListener('contextmenu',function(e){
      e.preventDefault()
      e.stopPropagation()
      cmenu(e.clientX,e.clientY,[
        {
          name: "Close",
          action:() => {
            bws.removeTab(tabElement.dataset.id)
          }
        }
      ])
    })

      this.#tabNb++;
      this.#tabId.push(tabElement.dataset.id);
      return tabElement.dataset.id
  }
/**
* Switches focus to the specified tab.
* @param id{number|string} - The ID of the tab to switch to.
*/
  setCurrent(id) {
      try {
          for (let tab of this.#browserBody
              .querySelector("#border-tab-container")
              .querySelectorAll(".border-tab")) {
              tab.classList.remove("border-current");
          }
          this.#browserBody
              .querySelector('.border-tab[data-id~="' + id + '"]')
              .classList.add("border-current");

          for (let view of this.#browserBody
              .querySelector("#border-view-container")
              .querySelectorAll(".border-view")) {
              view.classList.remove("border-current");
          }
          this.#browserBody
              .querySelector('.border-view[data-id~="' + id + '"]')
              .classList.add("border-current");

          this.#browserBody.querySelector("#border-searchbar").value = this.#browserBody.querySelector(
              ".border-tab.border-current"
          ).dataset.url;
      } catch { }
  }
/**
* Closes a tab.
* @param id{string|number} - The ID of the tab to close.
*/
  removeTab(id) {
      if (!id) throw new Error("Specify a correct ID");

      this.#tabNb--;
      this.#tabId.splice(this.#tabId.indexOf(id), 1);

      this.#browserBody
          .querySelector("#border-tab-container")
          .removeChild(
              this.#browserBody.querySelector('.border-tab[data-id~="' + id + '"]')
          );
      this.#browserBody
          .querySelector("#border-view-container")
          .removeChild(
              this.#browserBody.querySelector('.border-view[data-id~="' + id + '"]')
          );
  }
 /** Reloads the current tab. */
  reloadTab() {
    document.querySelector('.border-view.border-current').reload()
  }
 /** Closes the current Border window. */
  closeWindow() {
      window.close()
  }
  /** Fullscreens the current Border window. */
  maxWindow() {
    ipcRenderer.send("winmaximize")
  }
  /** Hides the current Border window. */
  minWindow() {
    ipcRenderer.send("winminimize")
  }
 /**
 * Creates a new Border window.
 * @deprecated Only works in Border for w96.
 */
  openWindow() {
      ipcRenderer.send("new-window")
  }
 /** Returns a generated tab id. */
  generateId() {
      let id = "";
      for (let i = 0; i < 4; i++) {
          id += Math.floor(Math.random() * 10);
      }

      if (this.#tabId.length >= 9999)
          throw new Error("Cannot generate ID");
      for (const tabId in this.#tabId) {
          if (tabId === id) return this.generateId();
      }
      return parseInt(id);
  }
 /**
* Creates a TextFinder UI.
* @param id{string|number} - The ID of the tab to link the TextFinder to.
*/
  createFindDialog(id) {
    var findel=document.createElement('div')
    findel.className="border-find-dialog"
    findel.id=id
    findel.innerHTML=`<input class="border-find-input" />
          <span class="border-found-count">0/0</span>
          <svg class="border-find-previous" width="10" height="10" viewBox="0 0 29 43">
            <path class="border-find-button"
                      d="M0 21.2132L21.2131 42.4264L28.2842 35.3553L14.1421 21.2132L28.2842 7.07104L21.2131 0L0 21.2132Z"
                      fill="#66239A" />
          </svg>
          <svg class="border-find-next" width="10" height="10" viewBox="0 0 29 43">
            <path class="border-find-button"
                      d="M29 21.7868L7.78687 0.573607L0.715823 7.64468L14.8579 21.7868L0.715821 35.929L7.78687 43L29 21.7868Z"
                      fill="#66239A" />
          </svg>
          <svg class="border-find-exit" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 43 43" fill="none">
            <path class='border-find-button' d="M28.2843 21.2132L42.4264 7.07107L35.3553 1.19209e-06L21.2132 14.1421L7.07107 0L1.19209e-06 7.07107L14.1421 21.2132L0 35.3553L7.07107 42.4264L21.2132 28.2843L35.3553 42.4264L42.4264 35.3553L28.2843 21.2132Z" fill="#66239A"/>
          </svg>`;
    var foundCount=0
    var currentResult=0
    var exited=false;
    var rtii=setInterval(() => {
      var acttb=document.querySelector('.border-tab.border-current')
      if(acttb) {
        if(acttb.dataset.id==id) {
          findel.style.display=''
        } else {
          findel.style.display='none'
        }
      } else {
        findel.style.display='none'
      }
    })
    var finder={
      /** Called when the next button is pressed. */
      onnext:function(){},
      /** Called when the previous button is pressed. */
      onprev:function(){},
      ontext:function(text){},
      /** Called when the selected result is unselected and the index is reset to 0. Called when the index becomes greater than found, or the amount if results is less than 1. */
      onreset:function(){},
      /** Called after the UI is removed but before it is unlinked with the tab */
      onexit:function(){},
      /** Gets or sets the amount of found results.*/
      get found() {
        return foundCount
      },
      /** Gets or sets the amount of found results.*/
      set found(count) {
        foundCount=count
        if(currentResult>foundCount) {
          currentResult=0
          try{
            this.onreset()
          }catch(er){null}
        }
        if(0==foundCount) {
          currentResult=0
          try{
            this.onreset()
          }catch(er){null}
        } else if(currentResult<1) {
          currentResult=1
        }
        findel.querySelector('.border-found-count').innerText=currentResult+"/"+foundCount
      },
      /** focuses the TextSearchUI's input. */
      focus: function() {
        findel.querySelector('input').focus()
      },
      /** Gets or sets the index of the result. **/
      get result() {
        return currentResult
      },
      /** Gets or sets the index of the result. **/
      set result(f) {
        currentResult=f
        findel.querySelector('.border-found-count').innerText=currentResult+"/"+foundCount
      },
      /** Returns true if terminated. */
      get terminated() {
        return exited
      },
      /** Returns true if terminated. */
      set terminated(tmn) {
        if(tmn) {
          this.terminate()
        }
      },
      /** Terminates the TextFinder. */
      terminate: function() {
        exited=true
        try{
          findel.parentNode.removeChild(findel)
        } catch (err0r){null}
        try{
          this.onexit()
        }catch(er){null}
        clearInterval(rtii)
      },
    }
    var val=findel.querySelector('.border-find-input').value;
    var inpel=findel.querySelector('.border-find-input')
    findel.querySelector('.border-find-input').onkeydown=function (e) {
      if(e.keyCode==27) {
        return finder.terminate()
      }
      setTimeout(function () {
        if(val!==inpel.value) {
          val=inpel.value
          try{
            finder.ontext(inpel.value)
          }catch(error){
            null
          }
        }
      },10)
    }
    findel.querySelector('.border-find-input').onpaste=function () {
      setTimeout(function () {
        if(val!==inpel.value) {
          val=inpel.value
          try{
            finder.ontext(inpel.value)
          }catch(error){
            null
          }
        }
      },10)
    }
    findel.querySelector('.border-find-input').ondrop=function () {
      setTimeout(function () {
        if(val!==inpel.value) {
          val=inpel.value
          try{
            finder.ontext(inpel.value)
          }catch(error){
            null
          }
        }
      },10)
    }
    findel.querySelector('.border-find-next').onclick=function() {
      try{
        finder.onnext()
      } catch (error) {
        null
      }
    }
    findel.querySelector('.border-find-previous').onclick=function() {
      try{
        finder.onprev()
      } catch (error) {
        null
      }
    }
    findel.querySelector('.border-find-exit').onclick=function() {
      finder.terminate()
    }
    document.querySelector('.border-text-finders').appendChild(findel)
    finder.focus()
    return finder
  }
  /** runs when the browser starts. */
  async #main() {
      // Create "border://urls" protocol
      this.protocols.urls = `
      <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Border urls</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
          </head>
          <body style="width: calc(100vw - 30px * 2); height: calc(100% - 30px * 2); overflow: auto; font-family: 'Lexend', sans-serif; padding: 30px; margin: 0; color: white;">
              <img style="display: inline-block; width: 150px;" src="data:image/png;base64,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">
              <span style="display: inline-block; font-size: 50px;">&nbsp;urls</span>
              
              <ul>
                  ${Object.entries(this.protocols).map(([key, value]) => `<a style="color: rgb(255, 255, 255);" href="data:text/html,${encodeURI(value)}">border://${key}</a>`).join("<br>")
          }
              </ul>
          </body>
      </html>
      `;

      this.#browserBody = window.document.body;

      // boot
      document
          .querySelector(":root")
          .style.setProperty("--border-primary", this.#Files.config.theme.primary);
      document
          .querySelector(":root")
          .style.setProperty(
              "--border-secondary",
              this.#Files.config.theme.secondary
          );
    setInterval(()=>{
      document
          .querySelector(":root")
          .style.setProperty("--border-primary", this.getValidHex(localStorage.getItem("theme-primary"))||"#4e2493");
      document
          .querySelector(":root")
          .style.setProperty("--border-secondary", this.getValidHex(localStorage.getItem("theme-secondary"))||"#ffe5fb");
    },100);

      let h = this.#browserBody.querySelectorAll(".border-history-btn");

      h[0].addEventListener("click", () => {
          this.back()
      });
      h[1].addEventListener("click", () => {
          this.forward();
      });
      h[2].addEventListener(
          "click",
          ()=>this.reloadTab()
      );

      this.#browserBody
          .querySelector("#border-add-button")
          .addEventListener("click", () => this.addTab({ current: true }));
      this.#browserBody
          .querySelector("#border-search-button")
          .addEventListener("click", () => {
              this.#browserBody.querySelector(".border-view.border-current").src =
              this.#handleURI(this.#browserBody.querySelector("#border-searchbar").value)[0];
          });

      this.addTab({ current: true, url:new URL(location.href).searchParams.get('load') });
    var _self_=this
    window.addEventListener('click',function(){
      document.querySelector('.border-options-menu').style.display="none"
      var allcotx=document.querySelectorAll('.border-context-menu');
      for(var i=0;i<allcotx.length;i++) {
        try{
          allcotx[i].parentNode.removeChild(allcotx[i])
        }catch(er0r0r0r){null}
      }
    })
    window.addEventListener('auxclick',function(e){
      if(e.button!=1){return}
      document.querySelector('.border-options-menu').style.display="none"
      var allcotx=document.querySelectorAll('.border-context-menu');
      for(var i=0;i<allcotx.length;i++) {
        try{
          allcotx[i].parentNode.removeChild(allcotx[i])
        }catch(er0r0r0r){null}
      }
    })
    var cmenu=this.populateMenu
    document.querySelector('#border-searchbar').addEventListener('contextmenu',function(e){
      e.preventDefault()
      e.stopPropagation()
      cmenu(
        e.clientX,
        e.clientY,
        [
          {
            name: "Paste",
            action: () => {
              document.execCommand('paste',false)
            }
          }
        ]
      )
    })
    window.addEventListener('contextmenu',function(e){
      e.preventDefault()
      document.querySelector('.border-options-menu').style.display="none"
      var allcotx=document.querySelectorAll('.border-context-menu');
      for(var i=0;i<allcotx.length;i++) {
        try{
          allcotx[i].parentNode.removeChild(allcotx[i])
        }catch(er0r0r0r){null}
      }
    })
    document.querySelector('.border-options').onclick=function(e) {
      e.stopPropagation()
      var allcotx=document.querySelectorAll('.border-context-menu');
      for(var i=0;i<allcotx.length;i++) {
        try{
          allcotx[i].parentNode.removeChild(allcotx[i])
        }catch(er0r0r0r){null}
      }
      var tdm=document.querySelector('.border-options-menu');
      tdm.innerHTML=""
      for(var i=0;i<_self_.dotmenu.length;i++) {
        (function(f){
          var g=document.createElement('div')
          g.innerText=f.name
          g.className="border-menu-option"
          g.onclick=function(){
            f.action()
          }
          if(f.type=="checkbox") {
            if(f.checked) {
              var mark=document.createElement("span")
              mark.className="border-check-mark"
              g.appendChild(mark)
            }
          }
          tdm.appendChild(g)
        })(_self_.dotmenu[i])
      }
      tdm.style.display=(tdm.style.display=='none' ? "":"none")
    }
    this.populateBookMarks()
    setInterval(()=>{
      this.loadBookMarks()
      this.populateBookMarks()
    },300)

      this.#browserBody
          .querySelector("#border-searchbar")
          .addEventListener("keyup", (event) => {
              if (event.key === "Enter") {
                  this.#browserBody.querySelector(".border-view.border-current").src =
                      this.#handleURI(this.#browserBody.querySelector("#border-searchbar").value)[0];
              }
          });
    document.querySelector(".border-bookmark-bar").addEventListener('contextmenu',function(e){
      e.preventDefault()
      e.stopPropagation()
      cmenu(
        e.clientX,
        e.clientY,
        [
          {
            name: "Add to Bookmarks",
            action:function(){
              var u=document.querySelector(
                '.border-tab.border-current'
              ).dataset.url
              document.querySelector('.border-nbkm-title').value=(()=>{
                try {
                  return document.querySelector('.border-current.border-view').getTitle()||i
                } catch (e) {
                  return u
                }
              })();
              document.querySelector('.border-nbkm-href').value=u;
              document.querySelector('.border-bookmark-popup').style.display=""
            }
          }
        ]
      )
    })
    setInterval(()=>{
      var nbkm=document.querySelector('.border-bookmark-popup');
      if(nbkm) {
        nbkm.style.left=((window.innerWidth-300)/2)+"px"
      }
    },10)

      setInterval(() => {
          if (
              this.#browserBody
                  .querySelector("#border-tab-container")
                  .querySelectorAll(".border-tab").length <= 0
          )
              this.closeWindow();

          if (!this.#browserBody.querySelector(".border-tab.border-current")) {
              this.setCurrent(this.#tabId[0]);
          }
      }, 10);
      setInterval(function() {
        var title=""
        var viewElement=document.querySelector('.border-view.border-current')
        try {
         title=viewElement.getTitle()||viewElement.src
        } catch (error) {
          title=viewElement.src
        }
        if(title.length>80) {
          title=title.slice(0,76)+"..."
        }
        document.title=title+" - Border"
      },10)
      
  }
  escapeHtm(text) {
    var E=document.createElement('p')
    E.innerText=text
    return E.innerHTML
  }
  createBluginEntry({icon,title}) {
    var _be=document.createElement("div");
    _be.className="border-blm-entry";
    var _bi=document.createElement("div");
    _bi.className="border-blme-icon";
    var _bp=document.createElement("img");
    _bp.src=icon;
    _bi.appendChild(_bp);
    _bp.style.height="100%";
    _bp.style.maxWidth="100%";
    _be.appendChild(_bi);
    var _bt=document.createElement("div");
    _bt.className="border-blme-text";
    _bt.innerText=title;
    _be.appendChild(_bt);
    var _bo=document.createElement("div");
    _bo.className="border-blme-options";
    _bo.innerHTML="<svg class=\"border-svg-secondary\" width=\"11.25\" height=\"11.25\" viewBox=\"0 0 6 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n\t\t\t\t\t<path class=\"border-svg-icon\" d=\"M0 20C0 18.3431 1.34315 17 3 17C4.65685 17 6 18.3431 6 20C6 21.6569 4.65685 23 3 23C1.34315 23 0 21.6569 0 20Z\" fill=\"#66239A\"/>\n\t\t\t\t\t<path class=\"border-svg-icon\" d=\"M0 11.5C0 9.84315 1.34315 8.5 3 8.5C4.65685 8.5 6 9.84315 6 11.5C6 13.1569 4.65685 14.5 3 14.5C1.34315 14.5 0 13.1569 0 11.5Z\" fill=\"#66239A\"/>\n\t\t\t\t\t<path class=\"border-svg-icon\" d=\"M0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3Z\" fill=\"#66239A\"/>\n\t\t  \t</svg>";
    _be.appendChild(_bo);
    document.querySelector('.border-blm-entrybox').appendChild(_be);
    var eventQueue=[];
    var entry={
      emit:(event,data) => {
        eventQueue.forEach(handler => {
        console.log("CA!",event+"/"+handler.name);
          if(handler.name==event) {
          	try {
          	  handler.cb(data);
          	} catch (error) {console.error(error)}
          }
        })
      },
      on:(name,cb) => {
        eventQueue.push({name,cb})
      },
      setIcon:(url) => {
      	_bp.src=url
      },
      setTitle:(title) => {
      	_bt.innerText=title;
      },
      remove:() => {
        try {
        	_be.parentNode.removeChild(_be)
        	return true;
        } catch (e) {
          return false
        }
      },
      append:() => {
        try {
        	document.querySelector('.border-blm-entrybox').appendChild(_be)
        	return true;
        } catch (e) {
          return false
        }
      },
      hide:() => { _be.style.display="none"; },
      show:() => { _be.style.display=""; },
      disableIcon: () => { _bi.style.filter="grayscale(100%)" },
      enableIcon: () => { _bi.style.filter="" },
    };
    _bi.onclick=function (event) {
      entry.emit("click",{
        toString: () => {return"[object BluginClickEvent]"},
        preventDefault:() => {return false},
        defaultPrevented:false,
        x:event.clientX,
        y:event.clientY,
        button:1,
        target:"blugin.icon"
      });
      document.querySelector(".border-blugins-dialog").style.display="none"
    };
    _bt.onclick=function (event) {
      entry.emit("click",{
        toString: () => {return"[object BluginClickEvent]"},
        preventDefault:() => {return false},
        defaultPrevented:false,
        x:event.clientX,
        y:event.clientY,
        button:1,
        target:"blugin.title"
      });
      document.querySelector(".border-blugins-dialog").style.display="none"
    };
    _bi.oncontextmenu=function (event) {
      entry.emit("contextmenu",{
        toString: () => {return"[object BluginClickEvent]"},
        preventDefault:() => {return false},
        defaultPrevented:false,
        x:event.clientX,
        y:event.clientY,
        button:2,
        target:"blugin.icon"
      });
    };
    _bt.oncontextmenu=function (event) {
      entry.emit("contextmenu",{
        toString: () => {return"[object BluginClickEvent]"},
        preventDefault:() => {return false},
        defaultPrevented:false,
        x:event.clientX,
        y:event.clientY,
        button:2,
        target:"blugin.title"
      });
    };
    _bo.onclick=function (event) {
    event.preventDefault();
    event.stopPropagation();
      entry.emit("optionsclick",{
        toString: () => {return"[object BluginClickEvent]"},
        preventDefault:() => {return false},
        defaultPrevented:false,
        x:event.clientX,
        y:event.clientY,
        button:1,
        target:"blugin.optionsmenu"
      });
    };
    _bo.oncontextmenu=function (event) {
      entry.emit("contextmenu",{
        toString: () => {return"[object BluginClickEvent]"},
        preventDefault:() => {return false},
        defaultPrevented:false,
        x:event.clientX,
        y:event.clientY,
        button:2,
        target:"blugin.optionsmenu"
      });
    };
    return entry;
  }
  createAlert(title,{body,buttons,webview}) {
    var template=`<div class="border-alert-dialog">
    <p class="border-popup-title">${this.escapeHtm(title)}</p>
    <p>${this.escapeHtm(body)}</i></p>
    <div class="border-alert-buttons">
    </div>
  </div>`
  var TEMP=document.createElement('template4dk')
  TEMP.innerHTML=template
  var popup=TEMP.querySelector('.border-alert-dialog')
  buttons.forEach(function(button){
    var element=document.createElement('button')
    if(button.default) {
      element.className="border-ok-action"
    } else {
      element.className="border-alert-action"
    }
    element.innerText=button.label
    element.onclick=function() {
      try {
        button.onclick()
      } catch (error) {
        console.log(error)
      }
    }
    popup.querySelector('.border-alert-buttons').appendChild(element)
  })
  var closed=false
  var mtwi=0
  var cadi=setInterval(function(){
    try {
      var width=(popup.offsetWidth||300)
      popup.style.left=((window.innerWidth-width)/2)+"px"
    } catch (error) {
      null
    }
  })
  if(webview) {
    mtwi=setInterval(function() {
      try {
        if(webview.classList.contains("border-current")) {
          popup.style.display=""
        } else {
          popup.style.display="none"
        }
      } catch (error) {
        console.error(error)
      }
    })
  }
  var dialog={
    close: function() {
      if(closed) {return}
      try {
        popup.parentNode.removeChild(popup)
        clearInterval(cadi)
        clearInterval(mtwi)
        closed=true
      } catch (error) {
        null
      }
    },
    setTitle:function(title) {
      if(closed) {return}
      popup.querySelector('.border-popup-title').innerText=title
    }
  }
  document.querySelector('.border-alert-container').appendChild(popup)
  return dialog
  }
   createThemeInstallPopup(theme,tab) {
    var template=`<div class="border-alert-dialog">
    <p class="border-popup-title">Install {ThemeName}?</p>
    <p>Made by <i>{ThemeAuthor}</i><br>Built for Border {ThemeVersion}</p>
    <p><i>{ThemeDetails}</i></p>
    <div class="border-alert-buttons">
      <button class="border-alert-action">Cancel</button> <button class="border-ok-action">Install</button>
    </div>
  </div>`
  var self=this
  var TEMP=document.createElement('template4dk')
  TEMP.innerHTML=template.replaceAll("{ThemeName}",this.escapeHtm(theme.name)).replaceAll("{ThemeDetails}",this.escapeHtm(theme.description)).replaceAll("{ThemeVersion}",theme.version).replaceAll("{ThemeAuthor}",this.escapeHtm(theme.author))
  var popup=TEMP.querySelector('.border-alert-dialog')
  document.querySelector('.border-alert-container').appendChild(popup)
  popup.querySelector('.border-ok-action').onclick=function(){
    clearInterval(mtci)
    fetch((new URL(theme.contentURL,'https://onofficiel.github.io/border/')).href).then(async (css)=>{
    popup.parentNode.removeChild(popup)
    var themes= self.themeList.concat([
      {
        css: await css.text(),
        name:theme.name,
        thumbnail:theme.imageURL,
        description:theme.description,
        version: theme.version,
        author:theme.author
      }
    ])
    localStorage.setItem('themes',JSON.stringify(themes))
  }).catch((e)=>alert("Failed to install theme:"+e))
  }
  popup.querySelector('.border-alert-action').onclick=function(){
    clearInterval(mtci)
    popup.parentNode.removeChild(popup)
  }
    var mtci=setInterval(()=>{
     var nbkm=popup
     if(nbkm) {
       nbkm.style.left=((window.innerWidth-300)/2)+"px"
     }
     try{
     if(tab!=(document.querySelector('.border-tab.border-current')||{dataset:{}}).dataset.id) {
       popup.style.display="none"
     } else {
       popup.style.display=""
     }
    }catch(e){null}
   },10)
 }
 bjsBlugins=[]
 async initiateBluginVM(path) {
   var vm=new XVM.sandBoxedHTML('about.blank.html','bluginpr.js');
   vm.IPC.on('newTab',(tab,id)=>{vm.IPC.emit("Gti"+id,[browser.addTab({url:tab.url,current:tab.current})])});
   
   vm.IPC.on("closeTab", (tabId) => browser.removeTab(tabId) )
   
	 vm.frame.addEventListener('dom-ready', event => {
		 fs.readFile(path_BLUGIN+(os.platform()=="win32"?"\\":"/")+"bjs"+(os.platform()=="win32"?"\\":"/")+path+(os.platform()=="win32"?"\\":"/")+"blugin.bjs",{encoding:'utf-8'},(err,data)=>{
		   vm.eval(`${data}`)
		 })
		})
   return vm
 }
 initBlugin(path) {
   var meta=path_BLUGIN+(os.platform()=="win32"?"\\":"/")+"bjs"+(os.platform()=="win32"?"\\":"/")+path+(os.platform()=="win32"?"\\":"/")+"manifest.json";
   var icon=path_BLUGIN+(os.platform()=="win32"?"\\":"/")+"bjs"+(os.platform()=="win32"?"\\":"/")+path+(os.platform()=="win32"?"\\":"/")+"blugin.png";
   var enabled=true;
   var entry=this.createBluginEntry({icon:"file://"+icon,title:"..."})
   fs.readFile(meta,'utf-8', function (e,d) {
   	var g=JSON.parse(d);
   	entry.setTitle(g.name);
   })
   var cmenu=this.populateMenu
   var vm;
   this.initiateBluginVM(path).then(function(d){
   	vm=d
   })
   var menu=[
   		{
   			name:"Run Blugin",
   			type:"checkbox",
   			get checked() {return enabled },
   			action: ()=> {
   			  enabled=!enabled;
   			  if(enabled){entry.enableIcon()}else{entry.disableIcon()}
   			  if(enabled) {
   			  this.initiateBluginVM(path).then(function(d){
					 	vm=d
					 })
   			  } else {
   			  	vm.kill()
   			  }
   			}
   		}
   ]
   entry.on("optionsclick", event => cmenu(event.x,event.y,menu));
 }
}
let browser = new Border();

fs.readdir(path_BLUGIN+(os.platform()=="win32"?"\\":"/")+"bjs", (err,files) => {
	if(!err) {
		for(var i=0;i<files.length;i++) {
			browser.initBlugin(files[i])
		}
	}
})

window.addEventListener('blur',()=>browser.hideMenu())

window.addEventListener('focus',()=>ipcRenderer.send("window-focus-public"));



