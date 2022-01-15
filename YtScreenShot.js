var Ex;
(function(){
    Ex = {
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
            "quickkey_set":false
        },
        "config":{},
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


            `
        },
        "obj":{},
        "f":{
            "custome_obj_set":()=>{

                Ex.obj.video = document.querySelector("video");
                
                Ex.obj.screenshot = document.createElement("div");
                Ex.obj.screenshot.id = "screenshot";
                document.body.prepend(Ex.obj.screenshot);

                var div = document.createElement("div");
                div.id = Ex.id;
                div.className = `ytp-menuitem`;
                div.setAttribute("aria-checked","true");
                div.innerHTML = `
                <div class="ytp-menuitem-icon">
                <img title="外掛資訊" class="icon-img" src="https://avatars.plurk.com/14556765-small9788529.gif"></div>
                <div class="ytp-menuitem-label">快速截圖 (<span class="quickkey">Q</span>)</div>
                <div title="截圖左上時間浮水印" class="ytp-menuitem-content">
                <div class="ytp-menuitem-toggle-checkbox"></div>
                </div>
                </div>`;

                div.addEventListener("click",(e)=>{

                    console.log(e.target.className);
                    switch (e.target.className)
                    {
                        case "ytp-menuitem-icon":
                            window.open("https://www.plurk.com/p/oplic7","_target");
                        break;

                        case "icon-img":
                            window.open("https://www.plurk.com/p/oplic7","_target");
                        break;

                        case "ytp-menuitem-toggle-checkbox":
                            Ex.flag.watermark_set = false;
                            e.target.remove();
                        break;
                        
                        case "ytp-menuitem-content":
                            
                            if(e.target.children.length===0)
                            {
                                Ex.flag.watermark_set = true;
                                e.target.innerHTML = `<div class="ytp-menuitem-toggle-checkbox"></div>`;
                            }
                            
                        break;
                        case "quickkey":
                            Ex.flag.quickkey_set = true;
                            Ex.f.MsgPop(`<div class="quickkey_set_div">按下鍵盤按鍵更改快截鍵<BR>目前快截： (<span class="quickkey">Q</span>)<div>`,e);
                            Ex.obj.msg.querySelector("input").addEventListener("click",()=>{Ex.flag.quickkey_set = false;});

                        break;
                        case "ytp-menuitem-label":
            
                            Ex.f.getImage();
                    
                            document.querySelector(".ytp-popup.ytp-contextmenu").style.display = "none";
            
                        break;
                    }
            
                });

                document.addEventListener("contextmenu",(e)=>{

                    var video = Ex.obj.video;

                    if(document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu")!==null && 
                    document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu #kfsshrimp")===null)
                    {
                        document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").prepend(div);
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
            "quickkey_set_end":()=>{
                Ex.flag.quickkey_set = false;
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


//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/YtScreenShot.js?s=${new Date().getTime()}`;document.head.prepend(js);
