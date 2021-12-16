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
        #top_chat{
            border-radius: 10px;
            border: 1px solid #000;
            background: rgba(125,125,125,0.4);
            z-index: 9999;
            position: fixed;
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
            background: rgba(255,255,255,0.8);
            z-index: 9999;
            margin: 5px;
            padding: 5px;
            position: fixed;
            cursor: move;
        }
        #kfsshrimp_menu a{
            color:#000;
            cursor: pointer;
        }
        #kfsshrimp_menu a:hover{
            color:#f00;
        }
        #kfsshrimp_menu a[data-ytchatexinfo]{
            border: 1px solid #000;
            border-radius: 5px;
            background: #999;
            color: #fff;
        }
        #kfsshrimp_menu a[data-ytchatexinfo]:hover{
            background: #fff;
            color: #000;
        }
        #ytchatexinfo{
            border-radius: 10px;
            border: 1px solid #000;
            overflow: auto;
            width: auto;
            height: auto;
            left: 0px;
            top: 0px;
            background: rgba(255,255,255,1);
            z-index: 9999;
            margin: 5px;
            padding: 5px;
            position: fixed;
        }
        #ytchatexinfo div{
            margin: 5px;
            padding: 5px;
        }
        #ytchatexinfo input[type=button]{
            border-radius: 4px;
            cursor: pointer;
            margin: 2px;
        }
        #ytchatexinfo input[type=button]:hover{
            background: #00f;
            color: #fff;
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

        if(G.chatframe===null)
        {
            G.timer = setTimeout(()=>{G.chat_set();},1000);
            return;
        }


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

        //G.localStorage = JSON.parse(localStorage.YtChatEx||`{"${G.control.yt_id}":{"list":{}}}`);

        //G.localStorage[G.control.yt_id] = G.localStorage[G.control.yt_id]||{"list":{}};

        var ary = [];
        /*for(var id in G.localStorage[G.control.yt_id].list)
        {
            ary.push( G.localStorage[G.control.yt_id].list[id] );
        }
        ary.sort( (a,b)=>{ return a.sec-b.sec;} );
        */
        for(var id in G.msg_list[G.control.yt_id].list)
        {
            ary.push( G.msg_list[G.control.yt_id].list[id] );
        }
        ary.sort( (a,b)=>{ return a.sec-b.sec;} );


        for(var i=0;i<ary.length;i++)
        {
            var message = ary[i];

            if(G.chat.querySelector(`[id="${message.id}"]`)!==null) continue;

            var div = document.createElement("div");
            div.id = message.id;

            div.innerHTML = `<a data-search_time="${message.sec}">${G.YtCurrentTime(message.sec)}</a> <a>${message.user}</a> <a>${message.msg}</a></div>`            
            G.chat.appendChild(div);
        }


        G.chat.addEventListener("mouseover",()=>{
            G.control.auto_scroll = false;
        });
        G.chat.addEventListener("mouseleave",()=>{
            G.control.auto_scroll = true;
        });

        G.click_timer = setInterval(()=>{

            if(G.chatframe.contentDocument.querySelectorAll(".yt-simple-endpoint.yt-dropdown-menu")[1]!==null)
            {
                G.chatframe.contentDocument.querySelectorAll(".yt-simple-endpoint.yt-dropdown-menu")[1].click();
                clearInterval(G.click_timer);
            }

        },1000);
        

        setTimeout(()=>{G.chat_ref();},1000);

    },
    "chat_ref":()=>{


        G.x = G.x||0;
        //console.log(G.x++);
        
        if( G.control.yt_id !== new URLSearchParams(location.search).get("v") )
        {
            G.menu.querySelector("#yt_time").innerHTML = "無影片";

            G.video = document.querySelector("video");


            if(G.video.src!=="" && new URLSearchParams(location.search).get("v")!==null)
            {
                console.log("restart");
                G.control.yt_id = new URLSearchParams(location.search).get("v");
                G.ReStart();
                return;
            }

            G.timer = setTimeout(()=>{G.chat_ref();},1000);
            return;
        }

        
        /*
        if(G.control.run===false)
        {
            G.timer = setTimeout(()=>{G.chat_ref();},1000);
            return;
        }
        */

        G.save_list = G.save_list||[];

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
                sec = G.YtCurrentTime(Math.floor(G.video.currentTime));
            }
            
            div.innerHTML = 
            `<a data-search_time="${G.YtCurrentTime(sec.split(":"))}">${(sec)}</a>
            <a>${message.querySelector("#author-name").innerText}</a>
            <a>${message.querySelector("#message").innerHTML}</a>`;

            G.chat.appendChild(div);

            G.save_list.push( message.id );
        }

        if(G.save_list.length>0) G.Save();

        G.menu.querySelector("#yt_time").innerHTML = G.YtCurrentTime(G.video.currentTime);
        


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
    "menu_set":()=>{

        G.menu = (!document.querySelector("#kfsshrimp_menu"))?document.createElement("div"):document.querySelector("#kfsshrimp_menu");
        G.menu.id = "kfsshrimp_menu";
        G.menu.setAttribute("draggable","true");

        G.menu.innerHTML = `<a>實況時間：<span id="yt_time">00:00:00</span></a> / <a data-exit>關閉外掛</a> / <a data-restart>
        重啟外掛</a> / <a data-ytchatexinfo title="功能說明">？</a><BR>${document.querySelector("h1.ytd-video-primary-info-renderer").children[0].innerHTML}

        <!--<a data-save="online">
        存檔
        </a> / <a data-load>
        讀檔
        </a> / -->
        `;

        document.body.prepend( G.menu );
    },
    "DB_set":( func )=>{
        
        if(typeof(firebase)==='undefined')
        {
            setTimeout(()=>{G.DB_set( func );},0);
            return;
        }

        if(!G.DB)
        {
            G.DB = firebase;
            G.DB.initializeApp({databaseURL:"https://kfs-plurk-default-rtdb.firebaseio.com/"});
            G.DB = G.DB.database();
        }


        if(typeof(func)==='function') func();

    },
    "Save":()=>{

        console.log("G.Save");
        G.DB_set();

        var list = {};
        for(var id of G.save_list)
        {
            var msg = G.chat.querySelector(`[id="${id}"]`);

            list[ msg.id ] = {
                "id":msg.id,
                "sec":msg.querySelectorAll("a")[0].dataset.search_time,
                "user":msg.querySelectorAll("a")[1].innerText,
                "msg":msg.querySelectorAll("a")[2].innerHTML
            }
        }

        G.save_list = [];


        G.msg_list[ G.control.yt_id ] = {
            "chanel":document.querySelector("yt-formatted-string.ytd-channel-name a").innerText,
            "title":document.querySelector("h1.ytd-video-primary-info-renderer").children[0].innerHTML,
            "date":YtChatEx.date = document.querySelector("#info-strings yt-formatted-string").innerText,
            "list":list
        }

        G.DB.ref(`YtChatEx/${G.control.yt_id}`).once("value",YtChatEx=>{
                
            YtChatEx = YtChatEx.val()||{"list":{}};

            for(var k in G.msg_list[ G.control.yt_id ])
            {
                if(k==="list")
                {
                    for(var id in G.msg_list[ G.control.yt_id ].list)
                    {
                        YtChatEx.list[ id ] = 
                        G.msg_list[ G.control.yt_id ].list[ id ];
                    }
                }
                else
                {
                    YtChatEx[k] = 
                    G.msg_list[ G.control.yt_id ][k];
                }
            }

            G.DB.ref(`YtChatEx/${G.control.yt_id}`).update(YtChatEx);

            console.log("SAVE");
            //alert("存檔完成");
        });



      

    },
    "Load":( func )=>{

        console.log("G.Load");

        G.DB_set();

        G.DB.ref(`YtChatEx/${G.control.yt_id}`).once("value",YtChatEx=>{
                
            YtChatEx = YtChatEx.val()||{"list":{}};

            //G.localStorage = JSON.parse(localStorage.YtChatEx||`{"${G.control.yt_id}":{"list":{}}}`);

            G.msg_list = {};
            G.msg_list[ G.control.yt_id ] = {"list":{}};


            for(var k in YtChatEx)
            {
                if(k==="list")
                {
                    for(var id in YtChatEx.list)
                    {
                        //G.localStorage[ G.control.yt_id ].list[id] = YtChatEx.list[id];

                        G.msg_list[ G.control.yt_id ].list[id] = YtChatEx.list[id];
                    }
                }
                else
                {
                    //G.localStorage[ G.control.yt_id ][k] = 
                    //YtChatEx[k];

                    G.msg_list[ G.control.yt_id ][k] = 
                    YtChatEx[k];
                }
            }


            if(YtChatEx.chanel!==undefined)
            {
                YtChatEx.chanel = document.querySelector("yt-formatted-string.ytd-channel-name a").innerText;
                YtChatEx.title = document.querySelector("h1.ytd-video-primary-info-renderer").children[0].innerHTML;
                YtChatEx.date = document.querySelector("#info-strings yt-formatted-string").innerText;

                console.log('test');
                console.log(YtChatEx);

                G.DB.ref(`YtChatEx/${G.control.yt_id}`).update(YtChatEx);
            }

            //localStorage.YtChatEx = JSON.stringify(G.localStorage);

            console.log("LOAD");
            //alert("讀檔完成");
            //G.ReStart();

            if(typeof(func)==='function') func();
        });
    },
    "ReStart":()=>{

        G.Exit();

        G.Load( ()=>{

            G.style_set();
            G.chat_set();
            G.menu_set();

        } );

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
    },
    "YtPostDate":(str)=>{

        if(str==="") return ``;

        str = str.split("：")[1];

        return `${str.split("年")[0]}/${str.split("年")[1].split("月")[0]}/${str.split("月")[1].split("日")[0]}`;

    }
};

if( prompt("警告！此執行方式有可能會寫入惡意程式，請確定該執行方式的程式來源為可信任的開發者！\n該程式開發者為噗浪帳號：kfsshrimp4\n聯絡方式可前往下網址\n確定要安裝外掛嗎？\n(該外掛為一次性，重整或關閉網頁即失效)","https://www.plurk.com/p/oo6cxp")===null ) G.control.run = false;


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

    if(e.target.dataset.ytchatexinfo==="")
    {
        var div = document.createElement("div");
        div.id = "ytchatexinfo";
        div.setAttribute("draggable","true");
        
        div.innerHTML = `
            <div>
            程式開發者：<a href="https://www.plurk.com/kfsshrimp4" target="_blank">https://www.plurk.com/kfsshrimp4</a><BR>
            程式碼公開位置：<a href="https://kfsshrimp.github.io/plurk/YtChatEx.js" target="_blank">https://kfsshrimp.github.io/plurk/YtChatEx.js</a><BR>
            問題回報可在：<a href="https://www.plurk.com/p/oo6cxp" target="_blank">https://www.plurk.com/p/oo6cxp</a><BR>
            Youtube聊天視窗出現扳手訊息時會自動新增到外掛視窗<BR>
            如Youtube聊天視窗停下來的話看不到新訊息便不會更新<BR>
            請單獨重整Youtube聊天視窗<BR>
            點選留言時間可以快速移動到該時間點<BR>
            所有外掛視窗皆可移動位置<BR>
            外掛聊天視窗可以縮放大小<BR>
            </div><hr>
            <input style="" type="button" value="關閉">
        `;

        div.querySelector("input").addEventListener("click",(e)=>{
            e.target.parentElement.remove();
        });

        G.menu.appendChild(div);
    }

    if(e.target.dataset.load==="")
    {
        G.Load();
    }

    if(e.target.dataset.exit==="")
    {       
        G.Exit();
    }

    if(e.target.dataset.restart==="")
    {       
        G.ReStart();
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
        e.target.style.top = e.clientY - G.mousedown.offsetY + "px";// + window.scrollY 
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

    G.DB_set( ()=>{

        G.Load( ()=>{

            G.style_set();
            G.chat_set();
            G.menu_set();

        } );

    } );
    

    
}




/*
var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/YtChatEx.js?s=${new Date().getTime()}`;document.head.prepend(js);
*/