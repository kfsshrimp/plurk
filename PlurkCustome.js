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



/*
eval(atob('dmFyICRqc2NvbXA9JGpzY29tcHx8e307JGpzY29tcC5zY29wZT17fTskanNjb21wLmNyZWF0ZVRlbXBsYXRlVGFnRmlyc3RBcmc9ZnVuY3Rpb24oYil7cmV0dXJuIGIucmF3PWJ9OyRqc2NvbXAuY3JlYXRlVGVtcGxhdGVUYWdGaXJzdEFyZ1dpdGhSYXc9ZnVuY3Rpb24oYixjKXtiLnJhdz1jO3JldHVybiBifTsKKGZ1bmN0aW9uKCl7dmFyIGI9ZnVuY3Rpb24oYSxkKXtkPXZvaWQgMD09PWQ/MTpkO2E9bmV3IERhdGUoYSk7dmFyIGU9YS5nZXRGdWxsWWVhcigpKyIvIisoYS5nZXRNb250aCgpKzEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwiMCIpKyIvIithLmdldERhdGUoKSsiICI7cmV0dXJuIGU9MT09PWQ/ZSsoYS5nZXRIb3VycygpKyI6IithLmdldE1pbnV0ZXMoKSsiOiIrYS5nZXREYXkoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIjAiKSk6YS5nZXRIb3VycygpKyI6IithLmdldE1pbnV0ZXMoKSsiOiIrYS5nZXREYXkoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIjAiKX07aWYodm9pZCAwIT09d2luZG93LmV4X3RpbWVfcHJpbnQpY2xlYXJJbnRlcnZhbCh3aW5kb3cuZXhfdGltZV9wcmludCksZGVsZXRlIHdpbmRvdy5leF90aW1lX3ByaW50O2Vsc2V7dmFyIGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic3R5bGUiKTtjLmlubmVyVGV4dD0iIjtkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGMpOwp3aW5kb3cuZXhfdGltZV9wcmludD1zZXRJbnRlcnZhbChmdW5jdGlvbigpe2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoInRpbWUiKS5mb3JFYWNoKGZ1bmN0aW9uKGEpe2EuaW5uZXJIVE1MPWIoYS5nZXRBdHRyaWJ1dGUoImRhdGV0aW1lIikpfSk7ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHlwZT0icmVzcG9uc2UiXScpLmZvckVhY2goZnVuY3Rpb24oYSl7bnVsbD09PWEucXVlcnlTZWxlY3RvcigiLnJlc3BvbnNlLW1hbmFnZXIiKSYmKGEuaW5uZXJIVE1MKz0nPGRpdiBjbGFzcz0icmVzcG9uc2UtbWFuYWdlciIgc3R5bGU9Im9wYWNpdHk6IDAuODsiPjxzcGFuPicrYihSZXNwb25zZXNNYW5hZ2VyLmdldFJlc3BvbnNlQnlJZChhLmRhdGFzZXQucmlkKS5wb3N0ZWQsMikrIjwvc3Bhbj48L2Rpdj4iKX0pfSwxRTMpfX0pKCk7'));*/