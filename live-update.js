// Reload the interface after My Hub restarts an updated server.
(()=>{
 // En el sitio https no hay /api/version: allí la app se actualiza con el service worker.
 if(location.protocol==='https:')return;
 let version='',checking=false;
 async function check(){
  if(checking||document.hidden)return;checking=true;
  try{
   let auth='';try{auth=sessionStorage.getItem('deck-editor-token')||JSON.parse(localStorage.getItem('pocket-deck-v2')||'{}').token||'';}catch{}
   const response=await fetch('/api/version',{headers:auth?{Authorization:'Bearer '+auth}:{},cache:'no-store',signal:AbortSignal.timeout(4000)});
   if(!response.ok)return;const data=await response.json();
   if(version&&version!==data.version){
    if(typeof dirty!=='undefined'&&dirty){if(typeof showStatus==='function')showStatus('Hay una actualización lista. Guarda tus cambios para cargarla.');return;}
    location.reload();return;
   }
   version=data.version;
  }catch{}finally{checking=false;}
 }
 check();setInterval(check,4000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
})();
