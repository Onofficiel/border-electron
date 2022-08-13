const {ipcRenderer}=require("electron")
const nvm=require("node:vm");

var Xvm = {
  Run: script => {
    var executable=new nvm.Script(script.source,{
      filename:script.filename
    })
    executable.runInNewContext(script.global)
  },
  GlobalScope:null
}

function AsyncWaitO (ms) {
  return new Promise(
  	 resolve => {
  	 	setTimeout( function(){resolve();alert('bro')} ,Number(ms))

  	 }
  );
}

var IntervalO = {
  Set: function (cb,ms) {
  	var id=IntervalO.List.length;
  	IntervalO.List.push(true);
  	(async function(){
  	  while ( IntervalO.List[ id ]	) {
  	  	await AsyncWaitO ( ms )
  	  	if(!IntervalO.List[ id ]) {return}
  	  	try { cb () } catch ( error ) { console.warn(error) }
  	  }
  	})();
  	return id;
  },
  List:[],
  Clear:function(id) {
  	if(IntervalO.List[id]) { IntervalO.list[ id ] = false }
  }
}

var TimeoutO = {
  Set: function (cb,ms) {
    var id=TimeoutO.List.length;
  	TimeoutO.List.push(true);
  	console.log(typeof ms);
  	(async function () {
  	  await AsyncWaitO ( ms );
  	  if(TimeoutO.List[id]) {
  	  try{cb()}catch(e){console.warn(e)}
  	  }
  	})();
  	return id
  },
  List:[],
  Clear:function(id) {
  	if(TimeoutO.List[id]) { TimeoutO.list[ id ] = false }
  }
}

var Console = {
  Log: function Log (...arguments) {
    ipcRenderer.sendToHost("xvm.conhost.log",...arguments);
  },
  Warn: function Warn (...arguments) {
    ipcRenderer.sendToHost("xvm.conhost.warn",...arguments);
  },
  Error: function Error (...arguments) {
    ipcRenderer.sendToHost("xvm.conhost.error",...arguments);
  },
  Info: function Info (...arguments) {
    ipcRenderer.sendToHost("xvm.conhost.info",...arguments);
  },
  Debug: function Debug (...arguments) {
    ipcRenderer.sendToHost("xvm.conhost.debug",...arguments);
  },
  Clear: function Clear (...arguments) {
    ipcRenderer.sendToHost("xvm.conhost.clear");
  }
}

var xIPC = {
  on:function(event,callback) {
    ipcRenderer.on(`xvm.ipc:${event}`,callback)
  },
  off:function(event,callback) {
    ipcRenderer.removeListener(`xvm.ipc:${event}`,callback)
  },
  emit: function (event,...args) {
    ipcRenderer.sendToHost(`xvm.ipc:${event}`,...args)
  }
}

var Messenger = {
  queue: [],
  readQueue: function () {
    if(Messenger.queue.length===0) { return null }
    return Messenger.queue.pop()
  },
  $$EVQ:[],
  emit: function(message) {
    ipcRenderer.sendToHost("xvm.messenger.outgoing",message)
  },
  on: function (event, cb) {
    this.$$EVQ.push({event,cb});
  }
}

ipcRenderer.on("xvm.messenger.incoming", (event, data) => {
  Messenger.queue.push({
    critical: data.critical,
    message: data.message,
  })
  var i$emit=function(name,event) {
   var evq=Messenger.$$EVQ
   for(var i=0;i<evq.length;i++) {
     try {
       if(evq[i].name===name){evq[i].cb(event)}
     } catch (error) {
       console.error(error)
     }
   }
  };
  i$emit('message', {
    critical:data.critical,
    message:data.message,
  });
})
