var Ex;
(()=>{
    Ex = {
        "OtherExSet":(ExName)=>{
            var js = document.createElement("script");
            js.src =  `https://kfsshrimp.github.io/plurk/${ExName}.js?s=${new Date().getTime()}`;
            document.head.prepend(js);

            Ex.OtherEx[ ExName ] = eval(`new ${ExName}()`);


        },
        "OtherEx":{

        },
        "id":"Plurk",
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
            "plurk":{}
           
        },
        "config":{
            "canvas":{
                "height":80,
                "width":80
            },
            "vote_max":6
        },
        "template":{},
        "style":()=>{
return `
:root{
    
}
#${Ex.id}{
    display:none;
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
#${Ex.id}-Msg input[type="button"]{
    padding: 4px 6px;
    font-size: 12px;
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
canvas{
    position: absolute;
    left: 100%;
    border-radius: 50%;
    border: 1px double #fff;
    transition-duration: 0.8s;
}
canvas:hover{
    transform: scale(1.2);
}
div#VoteInfo{
    position: absolute;
    width: auto;
    height: auto;
    left: 100%;
    top: 90px;
    background: #fff8;
    color: #000;
    padding: 2px 2px;
    margin: 2px;
    border-radius: 5px;
    border: 2px double #fff;
    opacity:0;
    transition-duration: 0.8s;
}
div#VoteInfo:hover{
    opacity:1 !important;
}
div#VoteInfo li{
    
    border-radius: 5px;
    padding: 1px 8px;
    margin-bottom: 2px;
}
div#VoteOption {
    display: grid;
}
div#VoteOption>div{
    display: grid;
    min-width: 110px;
}
div#VoteOption>div input[type="text"]{
    width: 100px;
}
div#VoteOption>div span{
    display:none;
    color:#f00;
    width: 0px;
    margin: -20px 0 0 104px;
}
div#VoteOption>div span.error{
    display:block;
}
#response-search {
    transition-duration: 0.1s;
    position: absolute;
    z-index: 9999;
    display: inline;
    margin-top: 0px;
    margin-left: 260px;
}
#response-search input{
    height: 20px;
    font-size: 12px;
    width: 80px;
}
.img-holder{
    overflow:hidden !important;
}
.cbox_img{
    width:auto !important;
    max-height:${document.body.clientHeight-50}px;
}`
        },
        "obj":{},
        "f":{
            "GetPlurk":(pid)=>{

                Ex.flag.plurk[ pid ] = PlurksManager.getPlurkById(pid);

                Ex.f.GetRePlurk( pid );

            },
            "GetRePlurk":(pid)=>{

                ResponsesManager.loadResponses( pid );

                var _t = setInterval(()=>{

                    if(ResponsesManager.getPlurkResponses( pid ).length!==0)
                    {
                        clearInterval(_t);

                        ResponsesManager.loadOlderResponses( pid,!0);
                        Ex.flag.plurk[ pid ]._replurk =  ResponsesManager.getPlurkResponses( pid );

                        if(Ex.flag.plurk[ pid ].owner_id!==99999)
                        {
                            Ex.flag.plurk[ pid ]._re_user = ResponsesManager.getPlurkResponsesUsers(pid).map( d=>{
                                return Users.getUserById(d)
                            });
                        }
                        
                        if(document.querySelector(`div[data-pid="${pid}"]`).innerHTML.indexOf("【投票】")!==-1)
                        {
                            Ex.f.RePlurkToPieChart( pid );
                        }
                        
                    }

                },500);

                /*"ResponsesManager":ResponsesManager
                ResponsesManager.loadResponses( parseInt('ophxn9',36) )
                ResponsesManager.loadOlderResponses( parseInt('ophxn9',36) , !0)
                ResponsesManager.getPlurkResponses( parseInt('ophxn9',36) )


                PlurkAdder.addPlurk({qualifier: ":",content:"test1" })
                PlurkAdder.addResponse( {plurk_id:parseInt("opmub0",36),owner_id:14556765},"test2",":")
                PlurkAdder.editPlurk({plurk_id:parseInt("opmub0",36),id:parseInt("opmub0",36)},"aaa")

                */
            },
            "RePlurkToPieChart":(pid)=>{

                replurk = Ex.flag.plurk[ pid ]._replurk

                //console.log(replurk);
                if(replurk[0]===undefined)
                {
                    document.querySelector(`.block_cnt:nth-child(1)>div[data-uid="${GLOBAL.session_user.uid}"][data-pid="${pid}"]`).querySelectorAll("canvas,#VoteInfo").forEach(o=>{o.remove();})

                    return;
                }

                //[data-uid="${GLOBAL.session_user.uid}"]
                var plurk_div = document.querySelector(`.block_cnt:nth-child(1)>div[data-pid="${pid}"]`);

                var plurk = Ex.flag.plurk[ replurk[0].plurk_id ];

                plurk._vote = {
                    "1":0,
                    "2":0,
                    "3":0,
                    "4":0,
                    "5":0,
                    "6":0
                };

                var user_check = [];
                replurk.forEach(v=>{
                    
                    
                    v.content = v.content.match(/[0-9]/);
                    v.content = (v.content===null)?v.content:v.content[0];
                    if(
                        isNaN(parseInt(v.content))===true ||
                        user_check.indexOf( v.handle||v.user_id )!==-1 || 
                        v.content>Ex.config.vote_max
                    ) return;

                    user_check.push( v.handle||v.user_id );


                    plurk._vote[ v.content ] = 
                    (plurk._vote[ v.content ]||0)+1;
                });

                if(Object.keys(plurk._vote).length>0)
                {
                    Ex.f.PieChart(plurk_div);
                }

            },
            "plurk_obj_set":()=>{

                
                Ex.obj.vote_btn = document.createElement("div");
                Ex.obj.vote_btn.className = "submit_img submit_img_color";
                Ex.obj.vote_btn.style.fontSize = "20px";
                Ex.obj.vote_btn.innerHTML = "建立投票";

                Ex.obj.vote_btn.dataset.event = "ClickEvent";
                Ex.obj.vote_btn.dataset.mode = "CreateVote";

                if( document.querySelector("#input_big")!==null)
                {
                    document.querySelector(".plurkForm:not(.mini-mode) .submit_img").parentElement.insertBefore( Ex.obj.vote_btn ,document.querySelector(".plurkForm:not(.mini-mode) .submit_img"));
                }


                Ex.Clock.setInterval.GetVotePlurk = setInterval(()=>{

                    /*
                    :not(${Object.keys(Ex.flag.plurk).map(a=>{return `[data-pid="${a}"]`;}).join(",")||'a'})`
                    */

                    document.querySelectorAll(`.block_cnt:nth-child(1)>div[data-uid="${GLOBAL.session_user.uid}"],.block_cnt:nth-child(1)>div[data-uid="99999"]`).forEach(o=>{

                        if(o.innerHTML.indexOf("【投票】")===-1) return;
    
                        if(Ex.flag.plurk[ o.dataset.pid ]===undefined) 
                            Ex.f.GetPlurk( o.dataset.pid );

                       
                        if( Ex.flag.plurk[ o.dataset.pid ]._replurk!==undefined )
                            Ex.f.RePlurkToPieChart( o.dataset.pid );

                    });

                    
                    document.querySelectorAll(`#cbox_response,#form_holder,#plurk_responses`).forEach(o=>{

                        if(o.querySelector(`#response-search`)!==null)
                        {
                            if(o.id==="plurk_responses")
                            {
                                var mtop = window.scrollY - document.querySelector(".bigplurk").clientHeight;
                                mtop = (mtop<0)?0:mtop;

                                o.querySelector(`#response-search`).style.marginTop = mtop + 'px';
                                o.querySelector(`#response-search`).style.right = '0px'
                            }
                            else
                            {
                                o.querySelector(`#response-search`).style.marginTop = o.querySelector(".response_box").scrollTop + 'px';
                            }
                        }
                        else
                        {


                            var search_div = document.createElement("div");
                            search_div.id = "response-search";
                            search_div.innerHTML = `
                            
                                <input type="text" id="content" placeholder="內容">
                                <input type="text" id="name" placeholder="暱稱(帳號)">
                            `;

                            o.querySelector(".response_info").prepend(search_div);
                            
                            search_div.querySelectorAll("input").forEach(input=>{

                                input.addEventListener("keydown",Ex.f.ReplurkSearch);

                            });
                        }
                    });
                

                },1000);
                
            },
            "ReplurkSearch":(e)=>{
                                
                if(
                    e.code.toLocaleLowerCase()==="enter" || 
                    e.code.toLocaleLowerCase()==="numpadenter")
                {
                    var response_box = e.path[3]; 
                    var pid = response_box.querySelector(".list .cboxAnchor").dataset.pid;

                    Ex.f.GetPlurk(pid);

                    response_box.querySelectorAll(`[data-rid]`).forEach(o=>{
                        o.style.display = "none";
                    });

                    var content = e.target.parentElement.querySelector("#content").value;
                    var name = e.target.parentElement.querySelector("#name").value;
                    


                    setTimeout(()=>{

                        
                        Ex.flag.plurk[pid]._replurk.forEach(r=>{

                            var _re_user = Ex.flag.plurk[pid]._re_user||[];

                            var display_name = (_re_user.find(a=>a.uid===r.user_id)||{}).display_name||"";
                            var nick_name = (_re_user.find(a=>a.uid===r.user_id)||{}).nick_name||"";
                            var handle = r.handle||"";


                            if(
                                r.content_raw.indexOf(content)!==-1 &&
                                ( 
                                    handle.indexOf(name)!==-1 || 
                                    display_name.indexOf(name)!==-1 || 
                                    nick_name.indexOf(name)!==-1
                                )
                            ){
                                if(document.querySelector(`[data-rid="${r.id}"]`))
                                document.querySelector(`[data-rid="${r.id}"]`).style.display = "block";
                            }
                        });
                        response_box.scrollTo(0,0);

                    },500);
                }
            },
            "PieChart":(plurk_div)=>{


                if(plurk_div.querySelector("canvas")===null)
                {
                    plurk_div.innerHTML = `
                        <canvas style="opacity:0;" 
                        data-m_event="MouseEvent" 
                        data-mode="VoteInfo" 
                        height="${Ex.config.canvas.height}" width="${Ex.config.canvas.width}">
                        </canvas>
                        <div id="VoteInfo"></div>
                        ${plurk_div.innerHTML}
                    `;

                    plurk_div.querySelector("canvas").addEventListener("mouseleave",(e)=>{
                        e.target.parentElement.querySelector("div#VoteInfo").style.opacity = "0";
                    });

                }

                var canvas = plurk_div.querySelector("canvas")
                var c2d = canvas.getContext("2d");
                var x = Math.floor(canvas.width/2);
                var y = Math.floor(canvas.height/2);
                var r = x;
                var p = 2*Math.PI;
                var deg_start = 0;
                var deg_end; 
                var vote = Ex.flag.plurk[ canvas.parentElement.dataset.pid ]._vote;

                var total = Object.values(vote).reduce( (a,b)=>{return a+b;});


                var color = [
                    "#8f8681",
                    "#32435F",
                    "#E4B660",
                    "#FE7773",
                    "#028C6A",
                    "#1D6A96"
                ];

                
                /*
                var color = [
                    "#f00",
                    "#0f0",
                    "#00f",
                    "#ff0",
                    "#f0f",
                    "#0ff",
                    "#000"
                ]
                */
               
                var word = ``;
                var count = 0;
                for(var i in vote)
                {
                    word+=`<li style="background:${color[count]}8">${count+1}：${vote[i]}票(${Math.floor((vote[i]/total*100)||0)}%)</li>`;

                    deg_end = deg_start + vote[i];

                    c2d.beginPath();
                    c2d.moveTo(x,y);
                    c2d.arc(x,y,r,deg_start/total*p,deg_end/total*p);

                    var grd = c2d.createRadialGradient(x,y,0,x,y,r);
                    grd.addColorStop(0,"#888");
                    grd.addColorStop(1,color[count]);


                    c2d.fillStyle = grd;
                    c2d.strokeStyle = "#fff";
                    c2d.fill();
                    //c2d.stroke();

                    count++;

                    deg_start = deg_end;
                }
                
                word +=`<li>總票數：${total}</li>`;

                plurk_div.querySelector("#VoteInfo").innerHTML = `<ul>${word}</ul>`;

                setTimeout(()=>{
                    if(plurk_div.querySelector("canvas")!==null)
                    plurk_div.querySelector("canvas").style.opacity = "1";
                },1000);
                

            },
            "ClickEvent":(e)=>{

                switch (e.target.dataset.mode)
                {
                    case "CreateVote":

                        e =  new MouseEvent("click",{
                            clientX: Math.floor(window.innerWidth/2),
                            clientY: Math.floor(window.innerHeight/4)
                        });
                        

                        Ex.f.MsgPop(`
                        <div id="VoteOption">
                        <div>
                        <input type="text" placeholder="選項1"><span>*</span>
                        <input type="text" placeholder="選項2"><span>*</span>
                        </div>
                        <input 
                        data-event="ClickEvent" 
                        data-mode="SubmitVote"
                        type="button" value="完成">
                        <input 
                        data-event="ClickEvent" 
                        data-mode="AddOption"
                        type="button" value="增加選項">
                        </div>`,e);

                    break;

                    case "AddOption":

                        var option = document.createElement("input");
                        option.type = "text";
                        option.setAttribute("placeholder",`選項${e.target.parentElement.querySelectorAll(`input[type="text"]`).length+1}`);
                        var span = document.createElement("span");
                        span.innerHTML = "*";


                        e.target.parentElement.querySelector("div").appendChild(option);
                        e.target.parentElement.querySelector("div").appendChild(span);

                        if(e.target.parentElement.querySelectorAll(`input[type="text"]`).length>=Ex.config.vote_max) e.target.setAttribute("disabled","disabled");

                    break;

                    case "SubmitVote":

                        var content = `【投票】\n`;
                        var check = false;
                        var opt = [];

                        e.target.parentElement.querySelectorAll(`input[type="text"]`).forEach( (o,i)=>{
                            if(o.value===``)
                            {
                                o.focus();
                                e.target.parentElement.querySelectorAll(`span`)[i].classList.add("error");
                                check = true;
                            }
                            else
                            {
                                e.target.parentElement.querySelectorAll(`span`)[i].classList.remove("error");
                            }

                            opt.push(`【${i+1}】${o.value}`);
                        });

                        content += opt.join("\n");
                        

                        if(check)
                        {
                            return;
                        }

                        document.querySelector("#input_big").value = content;

                        document.querySelector("#input_big").style.height = document.querySelector("#input_big").scrollHeight + 'px'

                        /*
                        PlurkAdder.addPlurk({
                            qualifier: ":",
                            content:content
                        });
                        

                        Ex.f.MsgPop('投票噗建立完成',e);
                        */
                    break;


                    

                }
            },
            "MouseEvent":(e)=>{

                switch (e.target.dataset.mode)
                {
                    case "VoteInfo":
                        e.target.parentElement.querySelector("div#VoteInfo").style.opacity = "1";
                    break;

                }
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


                /*
                Ex.Clock.setInterval.flag = setInterval(()=>{
                    Ex.f.FlagUpd();
                },1000);
                */

                if(document.querySelectorAll(".plurkForm:not(.mini-mode) .submit_img").length>1)
                {
                    return;
                }


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

                document.addEventListener("mouseover",function(e){
                    if(e.target.dataset.m_event!==undefined) Ex.f[ e.target.dataset.m_event ](e);
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
                Ex.f.plurk_obj_set();
                
            }
        }
    };

    Ex.f.default();

})();


//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/YtScreenShot.js?s=${new Date().getTime()}`;document.head.prepend(js);
