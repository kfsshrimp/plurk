(function(){
    var Ex = {
        "id":"Ytscreenshot",
        "DB":false,
        "Storage":{
            "local":false,
            "session":false
        },
        "Clock":{
            "setInterval":{},
            "setTimeout":{}
        },
        "flag":{
            "watermark_set":true,
            "c2d":{
                "font":"bold 10px sans-serif",
                "textAlign":"start",
                "textBaseline":"top",
                "x":2,
                "y":2,
                "fillStyle":"#fff",
                "strokeStyle":"#000"
            },
            "watermark":{
                "font":"10px sans-serif",
                "textAlign":"start",
                "textBaseline":"top",
                "x":100,
                "y":100,
                "fillStyle":"#fff",
                "strokeStyle":"#000"
            },
            "quickkey":81,
            "quickkey_set":false,
            "yt_chat":{
                
            },
            "yt_chat_on":false
        },
        "config":{
            "DB_url":"https://kfs-plurk-default-rtdb.firebaseio.com/",
            "selector":`[author-type="moderator"]`,
            "yt_id":new URLSearchParams(location.search).get("v")
        },
        "template":{},
        "style":()=>{
            return `
            :root{
                
            }
            #${Ex.id}{
                
            }

            #${Ex.id}-Msg{
                display:none;
                border:1px solid #000;
                border-radius: 5px;
                background: #fff5;
                position: absolute;
                padding:5px;
                color: #000;
                z-index:9999;
            }

            #${Ex.id}-Menu{
                display:none;
                border:1px solid #000;
                border-radius: 5px;
                background: #fff5;
                position: absolute;
                padding:5px;
                color: #000;
            }

            #${Ex.id}-Loading{
                width: 100%;
                height: 100%;
                background:#222;
                opacity: 1;
                display: block;
                transition-duration: 1s;
                position: fixed;
                cursor:wait;
                z-index: 99;
                color:#fff;
            }
            #${Ex.id}-Loading div{
                position: absolute;
                height: 50px;
                width: 50px;
                top: calc(50% - 50px);
                left: calc(50% - 50px);
                border-radius: 50%;
                background: transparent;
            }
            
            #${Ex.id}-Loading div:nth-child(1){
                
                border-top:3px solid #aaa;
                animation: load 1s infinite linear;
            }

            #${Ex.id}-Loading div:nth-child(2){
                top: calc(50% - -10px);
                left: calc(50% - 58px);
            }

            @keyframes load {
                to {
                    transform: rotateZ(360deg);
                }
            }

            #screenshot{
                top: 0px;
                left: 0px;
                position: absolute;
                z-index: 9999;
            }
            #screenshot canvas{
                margin:2px;
                height: 60px;
                border: 1px solid #f00;
                position: absolute;
            }
            .quickkey{
                margin:0 2px;
            }
            .quickkey:hover{
                color:#f00;
            }

            .quickkey_set_div{
                background:#fff;
                color:#000;
                border:1px solid #000;
                margin:4px;
                padding:4px;
                border-radius: 5px;
                text-align:center;
            }



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


            `
        },
        "obj":{},
        "f":{
            "ChatEx":()=>{

                var yt_id = Ex.config.yt_id;
                var flag_yt = Ex.flag.yt_chat;

                if(Ex.obj.chatframe===null)
                {
                    setTimeout(()=>{Ex.f.ChatEx();},1000);
                    return;
                }
                   
                Ex.DB.ref(`YtChatEx/${yt_id}`).once("value",YtChatEx=>{

                    YtChatEx = YtChatEx.val()||{};

                    flag_yt = {};
                    flag_yt[yt_id] = {"list":{}};

                    for(var k in YtChatEx)
                    {
                        if(k==="list")
                        {
                            for(var id in YtChatEx.list)
                            {
                                flag_yt[yt_id].list[id] = YtChatEx.list[id];
                            }
                        }
                        else
                        {
                            flag_yt[yt_id][k] = YtChatEx[k];
                        }
                    }

                    if(YtChatEx.chanel!==undefined)
                    {
                        YtChatEx.chanel = document.querySelector("yt-formatted-string.ytd-channel-name a").innerText;
                        YtChatEx.title = document.querySelector("h1.ytd-video-primary-info-renderer").children[0].innerHTML;
                        YtChatEx.date = document.querySelector("#info-strings yt-formatted-string").innerText;
        
                        Ex.DB.ref(`YtChatEx/${yt_id}`).update(YtChatEx);
                    }

                    var ary = [];
                    
                    for(var id in flag_yt[yt_id].list)
                    {
                        ary.push( flag_yt[yt_id].list[id] );
                    }

                    ary.sort( (a,b)=>{ return a.sec-b.sec;} );

                    for(var i=0;i<ary.length;i++)
                    {
                        var message = ary[i];

                        if(Ex.obj.chat.querySelector(`[id="${message.id}"]`)!==null) continue;

                        var div = document.createElement("div");
                        div.id = message.id;

                        div.innerHTML = 
                        `<a data-event="ClickEvent" 
                        data-mode="SearchTime" 
                        data-time="${message.sec}">${Ex.f.YtCurrentTime(message.sec)}</a> 
                        <a>${message.user}</a> 
                        <a>${message.msg}</a>`            
                        Ex.obj.chat.appendChild(div);
                    }


                    Ex.Clock.setInterval.ChatEx = setInterval(()=>{

                        if(Ex.flag.yt_chat_on) Ex.f.ChatRef();

                    },1000);
                });

            },
            "ChatRef":()=>{


                var yt_id = Ex.config.yt_id;
                var flag_yt = Ex.flag.yt_chat;

                var message_list = Ex.obj.chatframe.contentDocument.querySelectorAll(Ex.config.selector);
                var new_messages = [];

                for(var i=0;i<message_list.length;i++)
                {
                    var message = message_list[i];

                    if(Ex.obj.chat.querySelector(`[id="${message.id}"]`)!==null) continue;

                    var div = document.createElement("div");
                    div.id = message.id;

                    var sec = message.querySelector("#timestamp").innerText;

                    if(sec.toLocaleLowerCase().indexOf("am")!==-1 || 
                    sec.toLocaleLowerCase().indexOf("pm")!==-1)
                    {
                        sec = Ex.f.YtCurrentTime(Math.floor(Ex.obj.video.currentTime));
                    }
                    
                    div.innerHTML = 
                    `<a data-event="ClickEvent" 
                    data-mode="SearchTime" 
                    data-time="${Ex.f.YtCurrentTime(sec.split(":"))}">${(sec)}</a> 
                    <a>${message.querySelector("#author-name").innerText}</a> 
                    <a>${message.querySelector("#message").innerHTML}</a>`  

                    Ex.obj.chat.appendChild(div);

                    new_messages.push( message.id );
                }

                if(new_messages.length>0)
                {
                    var list = {};
                    for(var id of new_messages)
                    {
                        var msg = Ex.obj.chat.querySelector(`[id="${id}"]`);

                        list[ msg.id ] = {
                            "id":msg.id,
                            "sec":msg.querySelectorAll("a")[0].dataset.time,
                            "user":msg.querySelectorAll("a")[1].innerText,
                            "msg":msg.querySelectorAll("a")[2].innerHTML
                        }
                    }

                    flag_yt[ yt_id ] = {
                        "chanel":document.querySelector("yt-formatted-string.ytd-channel-name a").innerText,
                        "title":document.querySelector("h1.ytd-video-primary-info-renderer").children[0].innerHTML,
                        "date":document.querySelector("#info-strings yt-formatted-string").innerText,
                        "list":list
                    }

                    Ex.DB.ref(`YtChatEx/${yt_id}`).once("value",YtChatEx=>{
                
                        YtChatEx = YtChatEx.val()||{"list":{}};
            
                        for(var k in flag_yt[ yt_id ])
                        {
                            if(k==="list")
                            {
                                for(var id in flag_yt[ yt_id ].list)
                                {
                                    YtChatEx.list[ id ] = 
                                    flag_yt[ yt_id ].list[ id ];
                                }
                            }
                            else
                            {
                                YtChatEx[k] = 
                                flag_yt[ yt_id ][k];
                            }
                        }
            

                        Ex.DB.ref(`YtChatEx/${yt_id}`).update(YtChatEx);
                    });
                }
                //setTimeout(()=>{Ex.f.ChatRef();},1000);

            },
            "custome_obj_set":()=>{

                Ex.obj.video = document.querySelector("video");
                
                Ex.obj.screenshot = document.createElement("div");
                Ex.obj.screenshot.id = "screenshot";
                document.body.prepend(Ex.obj.screenshot);


                var div2 = document.createElement("div");
                div2.id = Ex.id;
                div2.className = `ytp-menuitem`;
                div2.setAttribute("aria-checked","true");
                div2.innerHTML = `
                <div class="ytp-menuitem-icon"></div>
                <div class="ytp-menuitem-label">影像90度</div>
                <div class="ytp-menuitem-content"></div>
                </div>
                </div>`;
                div2.addEventListener("click",e=>{
                    
                })


                var ExMenu = `
                <div id="Ytscreenshot" class="ytp-menuitem" aria-checked="true">
                <div class="ytp-menuitem-icon" data-event="ClickEvent" data-mode="ExInfo">
                <img title="外掛資訊" 
                class="icon-img"  data-event="ClickEvent" data-mode="ExInfo" 
                src="https://avatars.plurk.com/14556765-small9788529.gif">
                </div>
                <div class="ytp-menuitem-label" 
                data-event="ClickEvent" 
                data-mode="GetImg">快速截圖 (<span title="快截鍵更改" data-event="ClickEvent" data-mode="quickkey" class="quickkey">Q</span>)
                </div>
                <div title="截圖左上時間浮水印" class="ytp-menuitem-content" 
                data-event="ClickEvent" data-mode="watermark_set">
                <div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="watermark_set"></div>
                </div>
                </div>

                <div id="Ytscreenshot" class="ytp-menuitem" aria-checked="true">
                <div class="ytp-menuitem-icon" 
                data-event="ClickEvent" data-mode="Video90"></div>
                <div class="ytp-menuitem-label" 
                data-event="ClickEvent" data-mode="Video90">影像90度</div>
                <div class="ytp-menuitem-content" 
                data-event="ClickEvent" data-mode="Video90"></div>
                </div>

                <div id="Ytscreenshot" class="ytp-menuitem" aria-checked="true">
                <div class="ytp-menuitem-icon" 
                data-event="ClickEvent" data-mode="PopVideo"></div>
                <div class="ytp-menuitem-label" 
                data-event="ClickEvent" data-mode="PopVideo">子母視窗</div>
                <div class="ytp-menuitem-content" 
                data-event="ClickEvent" data-mode="PopVideo"></div>
                </div>

                <div id="Ytscreenshot" class="ytp-menuitem" aria-checked="true">
                <div class="ytp-menuitem-icon" 
                data-event="ClickEvent" data-mode="ChatRecord"></div>
                <div class="ytp-menuitem-label" 
                data-event="ClickEvent" data-mode="ChatRecord">監錄聊天視窗</div>
                <div class="ytp-menuitem-content" 
                data-event="ClickEvent" data-mode="ChatRecord"></div>
                </div>
                

                `

                document.addEventListener("contextmenu",(e)=>{

                    var video = Ex.obj.video;

                    if(document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu")!==null && 
                    document.querySelector(`.ytp-popup.ytp-contextmenu .ytp-panel-menu #${Ex.id}`)===null)
                    {
                        /*
                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").prepend(div3);
                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").prepend(div2);
                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").prepend(div);
                        */

                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").innerHTML = ExMenu + document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").innerHTML;


                    }

                    if(e.target.nodeName==="CANVAS")
                    {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        var n_w = window.open("",``,`width=${video.clientWidth+5},height=${video.clientHeight+5}`);
                        n_w.document.body.style = "margin:0px";
                        n_w.document.body.innerHTML = `<img src="${e.target.toDataURL()}">`;
                    }
                });

                document.addEventListener("keydown",(e)=>{

                    if(Ex.flag.quickkey_set===true)
                    {
                        Ex.flag.quickkey = e.keyCode;
                        document.querySelectorAll(".quickkey").forEach(o=>{
                            o.innerHTML = e.key.toUpperCase();
                        });
                    }
                    else
                        if(e.keyCode===Ex.flag.quickkey) Ex.f.getImage();
                })


            },
            "ClickEvent":(e)=>{
                

                switch (e.target.dataset.mode)
                {
                    case "SearchTime":
                        
                        Ex.obj.video.currentTime = Ex.f.YtCurrentTime( 
                            e.target.dataset.time.split(":")
                        );

                    break;


                    case "GetImg":
                        Ex.f.getImage();
                    
                        document.querySelector(".ytp-popup.ytp-contextmenu").style.display = "none";
                    break;

                    case "quickkey":
                        Ex.flag.quickkey_set = true;
                        Ex.f.MsgPop(`<div class="quickkey_set_div">按下鍵盤按鍵更改快截鍵<BR>目前快截： (<span class="quickkey">Q</span>)<div>`,e);
                        Ex.obj.msg.querySelector("input").addEventListener("click",()=>{Ex.flag.quickkey_set = false;});
                    break;

                    case "ExInfo":
                        window.open("https://www.plurk.com/p/oplic7","plurk");
                    break;

                    case "watermark_set":
                        if(e.target.className==="ytp-menuitem-content")
                        {
                            Ex.flag.watermark_set = true;
                            e.target.innerHTML = `<div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="watermark_set"></div>`;
                        }
                        else
                        {
                            Ex.flag.watermark_set = false;
                            e.target.remove();
                        }
                    break;

                    case "Video90":
                        if(e.target.parentElement.querySelector(".ytp-menuitem-content").children.length===0)
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = `<div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="Video90"></div>`;
                        }
                        else
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = ``;
                        }
                        Ex.f.VideoRotate();
                    break;

                    case "PopVideo":
                        if(document.pictureInPictureElement===null)
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = `<div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="PopVideo"></div>`;
                            Ex.obj.video.requestPictureInPicture();
                        }
                        else
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = ``;
                            document.exitPictureInPicture();
                        }
                    break;


                    case "ChatRecord":

                        Ex.obj.chat = (!document.querySelector("#top_chat"))?document.createElement("div"):document.querySelector("#top_chat");
                        Ex.obj.chat.id = "top_chat";
                        Ex.obj.chat.setAttribute("draggable","true");
        
                        Ex.obj.chatframe = document.querySelector("iframe#chatframe");
                        var chat_info = Ex.obj.chatframe.getBoundingClientRect();
                        Ex.obj.chat.style.left = `${chat_info.left}px`;
                        Ex.obj.chat.style.top = `${chat_info.top}px`;
                        Ex.obj.chat.style.height = `${chat_info.height}px`;
                        Ex.obj.chat.style.width = `${chat_info.width}px`;
                        document.body.prepend(Ex.obj.chat);

                        if(Ex.Clock.setInterval.ChatEx===undefined)
                        {
                            Ex.f.DB_set( Ex.config.DB_url, ()=>{Ex.f.ChatEx();} );
                        }

                        if(e.target.parentElement.querySelector(".ytp-menuitem-content").children.length===0)
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = `<div class="ytp-menuitem-toggle-checkbox" data-event="ClickEvent" data-mode="ChatRecord"></div>`;
                            Ex.flag.yt_chat_on = true;
                            Ex.obj.chat.style.display = "block";
                        }
                        else
                        {
                            e.target.parentElement.querySelector(".ytp-menuitem-content").innerHTML = ``;
                            Ex.flag.yt_chat_on = false;
                            Ex.obj.chat.style.display = "none";
                        }

                        

                    break;

                }

                
            },
            "VideoRotate":()=>{

                if(document.querySelector("#player").style.transform!==``){
                    document.querySelector("#player").style.transform=``;
                    document.querySelector(".ytp-chrome-bottom").style=``;
                    document.querySelector(".html5-video-player").appendChild(document.querySelector(".ytp-chrome-bottom"));
                }else{
                    document.querySelector("#player").style.transform ="translate(-450px, 0px) rotateZ(90deg) scale(0.7)";
                    document.querySelector(".ytp-chrome-bottom").style = `width:`+document.querySelector(".ytp-chrome-bottom").style.width+`;left:300px;top:10px;opacity: 1;z-index: 9999;background: #000;`;
                    document.querySelector("#player").parentElement.prepend( document.querySelector(".ytp-chrome-bottom") );
                }
            },
            "getImage":()=>{

                Ex.obj.video = document.querySelector("video");

                var canvas = document.createElement("canvas");
                var c2d = canvas.getContext("2d");
                var video = Ex.obj.video;
                canvas.id = Math.floor(video.currentTime);
                canvas.setAttribute("draggable","true");
                canvas.dataset.draggable_remove = "true";
                canvas.width = video.clientWidth;
                canvas.height = video.clientHeight;
                c2d.drawImage(video,0,0,video.clientWidth,video.clientHeight);


                if(Ex.flag.watermark_set===true)
                {
                    c2d.font = Ex.flag.c2d.font;
                    c2d.textAlign = Ex.flag.c2d.textAlign;
                    c2d.textBaseline = Ex.flag.c2d.textBaseline;
                    c2d.fillStyle = Ex.flag.c2d.fillStyle;
                    c2d.strokeStyle = Ex.flag.c2d.strokeStyle;
                    c2d.strokeText( Ex.f.YtCurrentTime( Math.floor(video.currentTime) ), Ex.flag.c2d.x, Ex.flag.c2d.y);
                    c2d.fillText( Ex.f.YtCurrentTime( Math.floor(video.currentTime) ), Ex.flag.c2d.x, Ex.flag.c2d.y);
                }

                c2d.font = Ex.flag.watermark.font;
                Ex.flag.watermark.x = Ex.obj.video.clientWidth - 90;
                Ex.flag.watermark.y = Ex.obj.video.clientHeight - 12;
                c2d.textAlign = Ex.flag.watermark.textAlign;
                c2d.textBaseline = Ex.flag.watermark.textBaseline;
                c2d.fillStyle = Ex.flag.watermark.fillStyle;
                c2d.fillText("plurk@kfsshrimp4", Ex.flag.watermark.x, Ex.flag.watermark.y);


                Ex.obj.screenshot.querySelectorAll("canvas").forEach(o=>{
                    if(o.style.left===canvas.style.left && o.style.top===canvas.style.top)
                    {
                        canvas.style.left = o.style.left.split("px")[0]*1+20 + 'px';
                        canvas.style.top = o.style.top.split("px")[0]*1+20 + 'px';
                    }
                });
                
                Ex.obj.screenshot.appendChild(canvas);

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
            "DB_set":function( URL,func ){

                if( typeof(firebase)!=='undefined' )
                {
                    Ex.DB = firebase;
                    Ex.DB = Ex.DB.database();

                    func();
                    return;
                }

                var firebasejs1 = document.createElement("script");
                firebasejs1.src="https://www.gstatic.com/firebasejs/5.5.6/firebase.js";
                document.head.appendChild(firebasejs1);

                var _t = setInterval(() => {
                    if( typeof(firebase)!=='undefined' )
                    {
                        clearInterval(_t);
                        Ex.DB = firebase;
                        Ex.DB.initializeApp({databaseURL:URL});
                        Ex.DB = Ex.DB.database();

                        func();
                    }
                },100);
                
            },
            "style_set":function(){
                
                Ex.obj.styleSheet = document.createElement("style");
                Ex.obj.styleSheet.type = "text/css";
                Ex.obj.styleSheet.title = Ex.id;
                Ex.obj.styleSheet.innerText = Ex.style();
                
                document.head.appendChild( Ex.obj.styleSheet );
            },
            "obj_set":function(){

                Ex.obj.Ex_div = document.createElement("div");
                Ex.obj.Ex_div.setAttribute("draggable","true");
                Ex.obj.Ex_div.id = Ex.id;

                Ex.obj.Ex_div.innerHTML = ``;


                Ex.obj.msg = document.createElement("div");
                Ex.obj.msg.id = `${Ex.id}-Msg`;
                Ex.obj.msg.setAttribute("draggable","true");
                Ex.obj.msg.innerHTML = `
                <div></div>
                <input type="button" data-event="close" data-obj="${Ex.id}-Msg" value="關閉">
                `;

                Ex.obj.menu = document.createElement("div");
                Ex.obj.menu.id = `${Ex.id}-Menu`;
                Ex.obj.menu.setAttribute("draggable","true");
                Ex.obj.menu.innerHTML = `
                <ul>
                </ul>
                `;

                Ex.obj.load = document.createElement("div");
                Ex.obj.load.id = `${Ex.id}-Loading`;
                Ex.obj.load.innerHTML = `
                <div></div>
                <div>LOADING...</div>
                `;
                
                //document.body.prepend( Ex.obj.load );

                document.body.appendChild( Ex.obj.Ex_div );
                document.body.appendChild( Ex.obj.msg );
                document.body.appendChild( Ex.obj.menu );
            },
            "FlagUpd":()=>{
                document.querySelectorAll(`[data-flag]`).forEach(o=>{
                    o.innerHTML = Ex.flag[o.dataset.flag];
                });
            },
            "StorageUpd":()=>{
                localStorage[Ex.id] = JSON.stringify(Ex.Storage.local);
                sessionStorage[Ex.id] = JSON.stringify(Ex.Storage.session);
            },
            "MsgPop":(str,e = document.createEvent("mouseEvents"))=>{

                Ex.obj.msg.style.left = e.clientX + 'px';
                Ex.obj.msg.style.top = e.clientY + 'px';
                Ex.obj.msg.style.display = "block";
                Ex.obj.msg.querySelector("div").innerHTML = str;

            },
            "close":(e)=>{
                document.querySelector(`#${e.target.dataset.obj}`).style.display = "none";
            },
            "rad":(n)=>{
                return Math.floor(Math.random() * n)+1;
            },
            "shuffle":(ary)=>{
                for (let i = ary.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [ary[i], ary[j]] = [ary[j], ary[i]];
                }
            },
            "default":()=>{

                Ex.Clock.setInterval.flag = setInterval(()=>{
                    Ex.f.FlagUpd();
                },1000);


                document.addEventListener("dragend",function(e){


                    if(e.target.getAttribute("draggable")==="true")
                    {
                        e.target.style.left = e.clientX - Ex.flag.mousedown.offsetX + "px";
                        e.target.style.top = e.clientY - Ex.flag.mousedown.offsetY + "px";

                        if(e.target.dataset.draggable_remove==="true" && e.target.style.top.split("px")[0]*-1>=Math.floor(e.target.clientHeight/2))
                        {
                            e.target.remove();
                        }

                    }
                });
                    

                document.addEventListener("mousedown",function(e){
                    Ex.flag.mousedown = e;
                });

                document.addEventListener("click",(e)=>{
                    

                    if(e.target.dataset.event!==undefined) Ex.f[ e.target.dataset.event ](e);
                });
            
                document.addEventListener("contextmenu",(e)=>{

                    if(e.target.dataset.r_event!==undefined)
                    {
                        e.stopPropagation();
                        e.preventDefault();

                        Ex.f[ e.target.dataset.r_event ](e);
                    }
                });

                Ex.Storage = {
                    "local":JSON.parse(localStorage[Ex.id]||`{}`),
                    "session":JSON.parse(sessionStorage[Ex.id]||`{}`)
                }

                
                Ex.f.style_set();
                Ex.f.obj_set();
                Ex.f.custome_obj_set();
                
            }
        }
    };

    Ex.f.default();

})();


//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/youtube.js?s=${new Date().getTime()}`;document.head.prepend(js);
//'dmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7anMuc3JjID0gIGBodHRwczovL2tmc3NocmltcC5naXRodWIuaW8vcGx1cmsveW91dHViZS5qcz9zPSR7bmV3IERhdGUoKS5nZXRUaW1lKCl9YDtkb2N1bWVudC5oZWFkLnByZXBlbmQoanMpOw=='

