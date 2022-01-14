var Ex;
(function(){

    Ex = {
        "id":"Maze",
        "DB":false,
        "Storage":{
            "local":false,
            "session":false
        },
        "flag":{
            "confirm":{}
        },
        "style":()=>{
            return `
            :root{
                --width:150px;
            }

            #${Ex.id}{
                width:150px;
                height:150px;
                top:20%;
                left:50%;
                background: transparent;
                position: absolute;
                /*overflow: hidden;*/
            }
            #${Ex.id} div{
                position: absolute;
            }

            #${Ex.id} #eye{
                perspective: 50px;
                transform-style: preserve-3d;
                width:100%;
                height:100%;
                position: absolute;
                transform: translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
            }
            #${Ex.id} .floor {
                width:100%;
                height:100%;
                background: #0f08;
                transform-origin: bottom;
                transform: translateX(0px) translateY(0px) translateZ(0px) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .floor:nth-child(2) {
                transform: translateX(var(--width)) translateY(0px) translateZ(0px) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .floor:nth-child(3) {
                transform: translateX(var(--width)) translateY(0px) translateZ(var(--width)) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .floor:nth-child(4) {
                transform: translateX(var(--width)) translateY(0px) translateZ(calc(var(--width) * 2)) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .floor:nth-child(5) {
                transform: translateX(0px) translateY(0px) translateZ(calc(var(--width) * 2)) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .floor:nth-child(6) {
                transform: translateX(calc(var(--width) * -1)) translateY(0px) translateZ(calc(var(--width) * 2)) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .floor:nth-child(7) {
                transform: translateX(calc(var(--width) * -1)) translateY(0px) translateZ(var(--width)) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .floor:nth-child(8) {
                transform: translateX(calc(var(--width) * -1)) translateY(0px) translateZ(0px) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .floor:nth-child(9) {
                transform: translateX(0px) translateY(0px) translateZ(var(--width)) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
            }


            #${Ex.id} .ceiling {
                width:100%;
                height:100%;
                background: #00f8;
                transform-origin: top;
                transform: translateX(0px) translateY(0px) translateZ(0px) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
            }

            #${Ex.id} .ceiling:nth-child(11) {
                transform: translateX(var(--width)) translateY(0px) translateZ(0px) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .ceiling:nth-child(12) {
                transform: translateX(var(--width)) translateY(0px) translateZ(var(--width)) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .ceiling:nth-child(13) {
                transform: translateX(var(--width)) translateY(0px) translateZ(calc(var(--width) * 2)) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .ceiling:nth-child(14) {
                transform: translateX(0px) translateY(0px) translateZ(calc(var(--width) * 2)) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .ceiling:nth-child(15) {
                transform: translateX(calc(var(--width) * -1)) translateY(0px) translateZ(calc(var(--width) * 2)) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .ceiling:nth-child(16) {
                transform: translateX(calc(var(--width) * -1)) translateY(0px) translateZ(var(--width)) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .ceiling:nth-child(17) {
                transform: translateX(calc(var(--width) * -1)) translateY(0px) translateZ(0px) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
            }
            #${Ex.id} .ceiling:nth-child(18) {
                transform: translateX(0px) translateY(0px) translateZ(var(--width)) rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
            }


            #${Ex.id} .wall{
                
                background: #0008;
                color:#f00;
                width:100%;
                height:100%;
                text-align: center;
                transform: translateX(0px) translateY(0px) translateZ(-150px) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            }
            

            /*
            transform: translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
            */
            
            `
        },
        "obj":{},
        "f":{
            "DB_set":function( func ){

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
                        Ex.DB.initializeApp({databaseURL:"https://kfs-plurk-default-rtdb.firebaseio.com/"});
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
                Ex.obj.Ex_div.id = Ex.id;

                var floor = ``,ceiling = ``,wall = ``;

                for(var i=0;i<1;i++)
                {
                    floor+=`<div class="floor"></div>`;
                    ceiling+=`<div class="ceiling"></div>`;
                    
                }



                var wall_tr = [
                    [0,0,-150,0,0,0,"unset"],
                    [0,0,-150,0,90,0,"right"],
                    [-150,0,-150,0,90,0,"right"],
                ];



                for(var i=0;i<4;i++)
                {
                    wall_tr[i] = wall_tr[i]||[0,0,-150,0,0,0,"unset"];

                    wall+=`<div class="wall" style="
                    transform-origin:${wall_tr[i][6]};
                    transform:
                    translateX(${wall_tr[i][0]}px)
                    translateY(${wall_tr[i][1]}px)
                    translateZ(${wall_tr[i][2]}px) 
                    rotateX(${wall_tr[i][3]}deg)
                    rotateY(${wall_tr[i][4]}deg)
                    rotateZ(${wall_tr[i][5]}deg);
                    "></div>`;
                }
                

                

                /*
                var wall_tr = [
                    [0,0,-150,0,0,0,"unset"],
                    [150,0,-150,0,0,0,"unset"],
                    [-150,0,-150,0,0,0,"unset"],
                    [300,0,-150,0,-90,0,"left"],
                    [300,0,0,0,-90,0,"left"],
                    [300,0,150,0,-90,0,"left"],
                    [-300,0,-150,0,90,0,"right"],
                    [-300,0,0,0,90,0,"right"],
                    [-300,0,150,0,90,0,"right"],
                    [0,0,300,0,0,0,"unset"],
                    [150,0,300,0,0,0,"unset"],
                    [-150,0,300,0,0,0,"unset"]
                ];


                for(var i=0;i<12;i++)
                {
                    wall_tr[i] = wall_tr[i]||[0,0,-150,0,0,0,"unset"];

                    wall+=`<div class="wall" style="
                    transform-origin:${wall_tr[i][6]};
                    transform:
                    translateX(${wall_tr[i][0]}px)
                    translateY(${wall_tr[i][1]}px)
                    translateZ(${wall_tr[i][2]}px) 
                    rotateX(${wall_tr[i][3]}deg)
                    rotateY(${wall_tr[i][4]}deg)
                    rotateZ(${wall_tr[i][5]}deg);
                    ">牆壁</div>`;
                }*/


                Ex.obj.Ex_div.innerHTML = `
                <div id="eye">
                    ${floor}
                    ${ceiling}

                    ${wall}
                </div>
                `;




                Ex.obj.msg = document.createElement("div");
                Ex.obj.msg.id = `${Ex.id}-Msg`;
                Ex.obj.msg.innerHTML = `
                <div></div>
                <a data-event="close" data-obj="${Ex.id}-Msg">關閉</a>
                `;

                Ex.obj.menu = document.createElement("div");
                Ex.obj.menu.id = `${Ex.id}-Menu`;
                Ex.obj.menu.innerHTML = `
                <ul>
                </ul>
                `;
                

                document.body.appendChild( Ex.obj.Ex_div );
                document.body.appendChild( Ex.obj.msg );
                document.body.appendChild( Ex.obj.menu );
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
            "shuffle":(ary)=>{
                for (let i = ary.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [ary[i], ary[j]] = [ary[j], ary[i]];
                }
            },
            "default":()=>{

                document.addEventListener("dragend",function(e){

                    if(e.target.getAttribute("draggable")==="true")
                    {
                        e.target.style.left = e.clientX - Ex.flag.mousedown.offsetX + "px";
                        e.target.style.top = e.clientY - Ex.flag.mousedown.offsetY + "px";
                    }
                });
                    

                document.addEventListener("mousedown",function(e){
                    Ex.flag.mousedown = e;
                });


                document.addEventListener("click",(e)=>{

                    if(e.target.dataset.event!==undefined) Ex.f[ e.target.dataset.event ](e);
                
                    if(e.target.dataset.flag!==undefined)
                    {
                        Ex.flag[ e.target.dataset.flag.split(":")[0] ] = e.target.dataset.flag.split(":")[1];
                    }
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

                Ex.f.DB_set( ()=>{

                    Ex.f.style_set();
                    Ex.f.obj_set();
                });
                
            }
        }
    };

    Ex.f.default();

})();


//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/PlurkEx.js?s=${new Date().getTime()}`;document.head.prepend(js);
//eval(atob('dmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7anMuc3JjID0gIGBodHRwczovL2tmc3NocmltcC5naXRodWIuaW8vcGx1cmsvUGx1cmtFeC5qcz9zPTE2NDE4OTU2MTg0MDRgO2RvY3VtZW50LmhlYWQucHJlcGVuZChqcyk7'))



/*
撈出好友
var x = new FriendsSelectList({});
ID撈出個人訊息
Users.getUserById(4208109)

*/
