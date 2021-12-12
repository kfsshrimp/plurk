/*
scroll stop G.stop = true;捲動停止自動scroll到底
start again G.stop = false;新增按鈕開始自動scroll到底
顯示秒數表示正在追蹤時數執行中
*/

if( typeof(G)!=='undefined' )
{
    clearTimeout(G.timer);
    window.removeEventListener("click",G.click);
    window.removeEventListener("dragend",G.dragend);
    window.removeEventListener("mousedown",G.mousedown);
}

var G = {
    "selector":`[author-type="moderator"]`,//
    "sys_word":{
        "true":"開啟",
        "false":"關閉"
    },
    "style":`
        #top_chat{
            border-radius: 10px;
            border: 1px solid #000;
            background: rgba(125,125,125,0.4);
            z-index: 9999;
            position: absolute;
            resize: both;
            overflow: auto;
            overflow-x: hidden;
            cursor: move;
            padding: 10px;
        }
        #top_chat>div{
            background:var(--yt-spec-general-background-a);
            cursor: pointer;
            border: 2px solid #000;
            margin: 2px;
            padding: 8px;
            border-radius: 10px;
        }
        #top_chat>div a:nth-child(1){
            display: var(--yt-live-chat-item-timestamp-display,inline);
            margin: var(--yt-live-chat-item-timestamp-margin,0 8px 0 0);
            color: var(--yt-live-chat-tertiary-text-color);
            font-size: 11px;
        }
        #top_chat>div a:nth-child(1):hover{
            color:#f00;
            border: 1px solid #000;
            background: #fff;
            border-radius: 4px;
        }
        #top_chat>div a:nth-child(1):active{
            color:#fff;
            background: #000;
        }
        #top_chat>div a:nth-child(2){
            color: var(--yt-live-chat-moderator-color);
            display: inline-flex;
        }
        #top_chat>div a:nth-child(2) div{
            color: var(--yt-live-chat-moderator-color,#5e84f1);
        }
        #top_chat>div a:nth-child(3){
            color: var(--yt-live-chat-primary-text-color,var(--yt-spec-text-primary));
        }
        #top_chat>div .emoji
        {
            width: var(--yt-live-chat-emoji-size);
            height: var(--yt-live-chat-emoji-size);
            margin: -1px 2px 1px;
            vertical-align: middle;
        }
        #kfsshrimp_menu{
            border-radius: 10px;
            border: 1px solid #000;
            overflow: auto;
            width: auto;
            height: 35px;
            left: 0px;
            top: 0px;
            border-radius: 10px;
            background: rgba(255,255,255,0.9);
            z-index: 9999;
            margin: 5px;
            position: fixed;
            padding: 5px;
            cursor: move;
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

        G.chatframe = document.querySelector("iframe#chatframe");
        G.node = G.chatframe.contentDocument.querySelectorAll(G.selector);

        G.chat = (!document.querySelector("#top_chat"))?document.createElement("div"):document.querySelector("#top_chat");
        G.chat.id = "top_chat";
        G.chat.setAttribute("draggable","true");

        var chat_info = G.chatframe.getBoundingClientRect();
        G.chat.style.left = `${chat_info.left}px`;
        G.chat.style.top = `${chat_info.top}px`;
        G.chat.style.height = `${chat_info.height}px`;
        G.chat.style.width = `${chat_info.width}px`;

        /*
        window.addEventListener("resize",()=>{
            var chat_info = G.chatframe.getBoundingClientRect();
            G.chat.style.left = `${chat_info.left}px`;
            G.chat.style.top = `${chat_info.top}px`;
            G.chat.style.height = `${chat_info.height}px`;
            G.chat.style.width = `${chat_info.width}px`;
        });
        */

        document.body.prepend(G.chat);

        G.localStorage = JSON.parse(localStorage.YtChatEx||`{"${G.control.yt_id}":{"list":{}}}`);

        G.localStorage[G.control.yt_id] = G.localStorage[G.control.yt_id]||{"list":{}};

        var ary = [];
        for(var id in G.localStorage[G.control.yt_id].list)
        {
            ary.push( G.localStorage[G.control.yt_id].list[id] );
        }
        ary.sort( (a,b)=>{ return a.sec-b.sec;} );

        for(var i=0;i<ary.length;i++)
        {
            var message = ary[i];

            if(G.chat.querySelector(`[id="${message.id}"]`)!==null) continue;

            var div = document.createElement("div");
            div.id = message.id;

            div.innerHTML = `<a data-search_time="${message.time}">${message.time}</a> <a>${message.user}</a> <a>${message.msg}</a></div>`            
            G.chat.appendChild(div);
        }


        G.chat.addEventListener("mouseover",()=>{
            G.control.auto_scroll = false;
        });
        G.chat.addEventListener("mouseleave",()=>{
            G.control.auto_scroll = true;
        });

        setTimeout(()=>{G.chat_ref();},1000);

    },
    "chat_ref":()=>{

        //G.x = G.x||0;
        //console.log(G.x++);

        if(G.control.run===false)
        {
            G.timer = setTimeout(()=>{G.chat_ref();},1000);
            return;
        }

        G.video = document.querySelector("video");

        G.node = G.chatframe.contentDocument.querySelectorAll(G.selector);

        for(var i=0;i<G.node.length;i++)
        {
            var message = G.node[i];

            if(G.chat.querySelector(`[id="${message.id}"]`)!==null) continue;

            
            var div = document.createElement("div");
            div.id = message.id;

            //<a data-search_time="${message.querySelector("#timestamp").innerText}">${message.querySelector("#timestamp").innerText}</a>

            var sec = message.querySelector("#timestamp").innerText;

            if(sec.toLocaleLowerCase().indexOf("am")!==-1 || sec.toLocaleLowerCase().indexOf("pm")!==-1)
            {
                sec = Math.floor(G.video.currentTime);
            }
            
            div.innerHTML = 
            `<a data-search_time="${sec}">${G.YtCurrentTime(sec)}</a>
            <a>${message.querySelector("#author-name").innerText}</a>
            <a>${message.querySelector("#message").innerHTML}</a>`;


            
            G.chat.appendChild(div);
        }


        
        
        G.menu.innerHTML = `<a>實況時間：${G.YtCurrentTime(G.video.currentTime)}</a> / <a data-exit>關閉外掛</a><BR>
        <a data-load>
        讀檔
        </a> / <a data-save="online">
        存檔
        </a>
        `;

        /*
        <a data-control="auto_scroll">
        自動捲動:[${G.sys_word[G.control.auto_scroll]}]</a>
        <a data-control="run">
        監控訊息:[${G.sys_word[G.control.run]}]</a>

        <a data-save="local">
        本機存檔
        </a> / 
        */


        if(G.control.auto_scroll===true)
            G.chat.scrollTo( 0,G.chat.scrollHeight );

        
        G.timer = setTimeout(()=>{G.chat_ref();},1000);
    },
    "control":{
        "run":true,
        "auto_scroll":true,
        "yt_id":new URLSearchParams(location.search).get("v")
    },
    "menu_set":()=>{

        G.menu = (!document.querySelector("#kfsshrimp_menu"))?document.createElement("div"):document.querySelector("#kfsshrimp_menu");
        G.menu.id = "kfsshrimp_menu";
        G.menu.setAttribute("draggable","true");

        document.body.prepend( G.menu );
    },
    "DB_set":()=>{
        
        if(typeof(firebase)==='undefined')
        {
            setTimeout(()=>{G.DB_set();},0);
            return;
        }

        if(!G.DB)
        {
            G.DB = firebase;
            G.DB.initializeApp({databaseURL:"https://kfs-plurk-default-rtdb.firebaseio.com/"});
            G.DB = G.DB.database();
        }
    },
    "Save":()=>{

        G.DB_set();

        G.localStorage = JSON.parse(localStorage.YtChatEx||`{"${G.control.yt_id}":{"list":{}}}`);

        var list = {};
        for(var i=0;i<G.chat.children.length;i++)
        {
            var msg = G.chat.children[i];



            list[ msg.id ] = {
                "id":msg.id,
                "sec":G.YtCurrentTime(msg.querySelectorAll("a")[0].innerText.split(":")),
                "time":msg.querySelectorAll("a")[0].innerText,
                "user":msg.querySelectorAll("a")[1].innerText,
                "msg":msg.querySelectorAll("a")[2].innerHTML
            }
        }
        

        G.localStorage[ G.control.yt_id ] = {
            "chanel":document.querySelector("yt-formatted-string.ytd-channel-name a").innerText,
            "title":document.querySelector("h1.ytd-video-primary-info-renderer").children[0].innerHTML,
            "list":list
        };

        localStorage.YtChatEx = JSON.stringify(G.localStorage);

        G.DB.ref("YtChatEx").once("value",YtChatEx=>{
                
            YtChatEx = YtChatEx.val()||{};

            YtChatEx[ G.control.yt_id ] = YtChatEx[ G.control.yt_id ]||{"list":{}};

            for(var k in G.localStorage[ G.control.yt_id ])
            {
                if(k==="list")
                {
                    for(var id in G.localStorage[ G.control.yt_id ].list)
                    {
                        YtChatEx[ G.control.yt_id ].list[ id ] = 
                        G.localStorage[ G.control.yt_id ].list[ id ];
                    }
                }
                else
                {
                    YtChatEx[ G.control.yt_id ][k] = 
                    G.localStorage[ G.control.yt_id ][k];
                }
            }


            G.DB.ref(`YtChatEx/${G.control.yt_id}`).update(YtChatEx[ G.control.yt_id ]);

            alert("存檔完成");
        });

    },
    "Load":()=>{

        G.DB_set();

        G.DB.ref(`YtChatEx/${G.control.yt_id}`).once("value",YtChatEx=>{
                
            YtChatEx = YtChatEx.val()||{"list":{}};

            G.localStorage = JSON.parse(localStorage.YtChatEx||`{"${G.control.yt_id}":{"list":{}}}`);


            for(var k in YtChatEx)
            {
                if(k==="list")
                {
                    for(var id in YtChatEx.list)
                    {
                        G.localStorage[ G.control.yt_id ].list[id] = YtChatEx.list[id];
                    }
                }
                else
                {
                    G.localStorage[ G.control.yt_id ][k] = 
                    YtChatEx[k];
                }
            }

            localStorage.YtChatEx = JSON.stringify(G.localStorage);

            alert("讀檔完成");

            G.ReStart();
        });
    },
    "ReStart":()=>{
        G.Exit();

        G.style_set();
        G.chat_set();
        G.menu_set();

        window.addEventListener("click",G.click);
        window.addEventListener("dragend",G.dragend);
        window.addEventListener("mousedown",G.mousedown);
    },
    "Exit":()=>{

        clearTimeout(G.timer);

        window.removeEventListener("click",G.click);
        window.removeEventListener("dragend",G.dragend);
        window.removeEventListener("mousedown",G.mousedown);
        G.styleSheet.disabled = true;
    
        G.chat.remove();
        G.menu.remove();
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

if( confirm("確定要執行外掛嗎?")===false ) G.control.run = true;


window.addEventListener("click",G.click = (e)=>{

    if(e.target.dataset.search_time)
    {
        G.video.currentTime = G.YtCurrentTime( 
            e.target.dataset.search_time.split(":")
        );

        return;
    }

    if(e.target.dataset.save)
    {
        if(e.target.dataset.save==="local")
        {
            G.Save();

            alert("存檔完成");
        }

        if(e.target.dataset.save==="online")
        {
            G.Save();
        }
    }

    if(e.target.dataset.load==="")
    {
        G.Load();
    }

    if(e.target.dataset.exit==="")
    {       
        G.Exit();
    }


    if(e.target.dataset.control)
    {
        var control = G.control[ e.target.dataset.control ];
        
        e.target.innerHTML = e.target.innerHTML.replaceAll(G.sys_word[control],G.sys_word[!control]);
        
        G.control[ e.target.dataset.control ] = 
        !G.control[ e.target.dataset.control ];
    }
});



window.addEventListener("dragend",G.dragend = (e)=>{

    if(e.target.getAttribute("draggable")==="true")
    {
        e.target.style.left = e.clientX - G.mousedown.offsetX + "px";
        e.target.style.top = e.clientY - G.mousedown.offsetY + window.scrollY + "px";
    }
});


window.addEventListener("mousedown",G.mousedown = (e)=>{
    G.mousedown = e;
});


if(G.control.run!==false)
{
    var firebasejs1 = document.createElement("script");
    firebasejs1.src="https://www.gstatic.com/firebasejs/5.5.6/firebase.js";
    document.head.appendChild(firebasejs1);


    G.style_set();
    G.chat_set();
    G.menu_set();
    //G.DB_set();
}




/*
var js = document.createElement("script");
js.src =  `https://kfsshrimp.github.io/plurk/YtChatEx.js?s=${new Date().getTime()}`;
document.head.prepend(js);
*/