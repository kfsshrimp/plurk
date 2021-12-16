if( typeof(G)!=='undefined' )
{
    clearTimeout(G.timer);
    window.removeEventListener("click",G.click);
    window.removeEventListener("dragend",G.dragend);
    window.removeEventListener("mousedown",G.mousedown);
}
else
{
    var G = {};
}

var G = {
    "selector":`[author-type="moderator"]`,//
    "DB":G.DB||false,
    "control":{
        "run":true,
        "auto_scroll":true,
        "yt_id":new URLSearchParams(location.search).get("v")
    },
    "sys_word":{
        "true":"開啟",
        "false":"關閉"
    },
    "style":`
        #kfsshrimp_menu{
            border-radius: 10px;
            border: 1px solid #000;
            overflow: auto;
            width: auto;
            height: auto;
            left: 0px;
            top: 0px;
            background: rgba(255,255,255,0.8);
            z-index: 9999;
            margin: 5px;
            padding: 5px;
            position: fixed;
            cursor: move;
        }
        #kfsshrimp_menu textarea{
            display:block;
            
        }
        #kfsshrimp_menu a{
            color:#000;
            cursor: pointer;
        }
        #kfsshrimp_menu a:hover{
            color:#f00;
        }
    `,
    "style_set":()=>{

        for(var i=0;i<document.styleSheets.length;i++) 
        {
            if(document.styleSheets[i].title==="kfsshrimp_style")
            {
                G.styleSheet = document.styleSheets[i];
                G.styleSheet.disabled = false;
                return;
            }
        }

        G.styleSheet = document.createElement("style");
        G.styleSheet.type = "text/css";
        G.styleSheet.title = "kfsshrimp_style";
        G.styleSheet.innerText = G.style;
        
        document.head.appendChild(G.styleSheet);
    },
    "chat_set":()=>{

     
        G.chat_ref();

    },
    "chat_ref":()=>{

        G.video = document.querySelector("video");

        G.menu.querySelector("#yt_time").innerHTML = G.YtCurrentTime(G.video.currentTime);
        
        
        G.timer = setTimeout(()=>{G.chat_ref();},1000);
    },
    "menu_set":()=>{

        G.menu = (!document.querySelector("#kfsshrimp_menu"))?document.createElement("div"):document.querySelector("#kfsshrimp_menu");
        G.menu.id = "kfsshrimp_menu";
        G.menu.setAttribute("draggable","true");

        G.menu.innerHTML = `<a>實況時間：<span id="yt_time">00:00:00</span></a><textarea></textarea>`;

        document.body.prepend( G.menu );
    },
    "YtCurrentTime":(sec)=>{

        if(Array.isArray(sec))
        {
            if(
            sec.some( w=>{ 
                return (w.toLocaleLowerCase().indexOf("am")!==-1 || 
                w.toLocaleLowerCase().indexOf("pm")!==-1) ;
            }) )
            {
                return "";
            }

            return sec.reverse().map((sec,i)=>{return sec*Math.pow(60,i);}).reduce((a,b)=>a+b);
        }
        else
            return `${ Math.floor(sec/3600).toString().padStart(2,"0") }:${ Math.floor(sec%3600/60).toString().padStart(2,"0") }:${ Math.floor(sec%60).toString().padStart(2,"0") }`;
    }
};


window.addEventListener("click",G.click = (e)=>{

    if(e.target.id==="yt_time")
    {
        G.menu.querySelector("textarea").value += `${G.YtCurrentTime(G.video.currentTime)}\n`;

    }
    
    if(e.target.dataset.search_time)
    {
        G.video.currentTime = G.YtCurrentTime( 
            e.target.dataset.search_time.split(":")
        );

        return;
    }
    

});



window.addEventListener("dragend",G.dragend = (e)=>{

    if(e.target.getAttribute("draggable")==="true")
    {
        e.target.style.left = e.clientX - G.mousedown.offsetX + "px";
        e.target.style.top = e.clientY - G.mousedown.offsetY + "px";// + window.scrollY 
    }
});


window.addEventListener("mousedown",G.mousedown = (e)=>{
    G.mousedown = e;
});


if(G.control.run!==false)
{
    G.style_set();
    G.menu_set();
    G.chat_set();
}




/*
var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/YtChatEx.js?s=${new Date().getTime()}`;document.head.prepend(js);
*/