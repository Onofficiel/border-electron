const {contextBridge,ipcRenderer}=require("electron");
window.addEventListener('load', () => {
	contextBridge.exposeInMainWorld("Border", {
		addTab(tab) {
		var rgi=String(Math.random()*3592)
			ipcRenderer.sendToHost('newTab',tab,rgi);
			var Tab={
				id:null,
				close:function(){
					ipcRenderer.sendToHost("closeTab",Tab.id)
				},
				reload:function(){
					ipcRenderer.sendToHost("reloadTab",Tab.id);
				},
				setCurrent:function() {
					ipcRenderer.sendToHost("activateTab",Tab.id);
				}
			}
			ipcRenderer.once("Gti"+rgi, (event,id) => { Tab.id=id });
			return Tab
		},
		window: {
			create(url) {
				ipcRenderer.send("window.new",url);
			}
		}
	})
});
