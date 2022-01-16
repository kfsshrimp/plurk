(()=>{
    var d = (d,m=1)=>{
        d = new Date(d);
        var _r = `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2,"0")}/${d.getDate()} `
        
        if(m===1)
            _r+=`${d.getHours()}:${d.getMinutes()}:${d.getDay().toString().padStart(2,"0")}`;
        else
            _r=`${d.getHours()}:${d.getMinutes()}:${d.getDay().toString().padStart(2,"0")}`;
        return _r;
    }

    if(window.ex_time_print!==undefined)
    {
        clearInterval(window.ex_time_print);
        delete window.ex_time_print;
        return;
    }

    var styleSheet = document.createElement("style");
    styleSheet.innerText = ``;
    document.head.appendChild( styleSheet );

    window.ex_time_print = setInterval(()=>{
        document.querySelectorAll("time").forEach(o=>{
            o.innerHTML = d(o.getAttribute("datetime"));
        });
        
        document.querySelectorAll(`[data-type="response"]`).forEach(o=>{
        
            if(o.querySelector(".response-manager")!==null) return;
            
            o.innerHTML+=`<div class="response-manager" style="opacity: 0.8;"><span>${d(ResponsesManager.getResponseById(o.dataset.rid).posted,2)}</span></div>`;
        
        });
    },1000);

})();


