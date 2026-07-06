let deferredPrompt;

window.addEventListener('beforeinstallprompt',(e)=>{

e.preventDefault();

deferredPrompt=e;

document.getElementById("installBtn").style.display="block";

});

document.getElementById("installBtn").addEventListener("click",async()=>{

deferredPrompt.prompt();

});
