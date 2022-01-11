/*Array.prototype.shuffle = function(){

    for (let kfs_i = this.length - 1; kfs_i > 0; kfs_i--) {
        let kfs_j = Math.floor(Math.random() * (kfs_i + 1));
        [this[kfs_i], this[kfs_j]] = [this[kfs_j], this[kfs_i]];
    }
}
*/

(function(){

//GLOBAL = {"session_user":{"nick_name":"test"}};

var Ex = false;

//var Ex = false;
var kfsshrimp = {
    "id":"PlurkEx",
    "Ex_set":()=>{

        if( document.querySelector(`#${kfsshrimp.id}`)!==null )
        {
            alert("外掛運作中不可重覆執行");
            return;
        }

        kfsshrimp["Ex"][ kfsshrimp.id ] = {
            "DB":kfsshrimp["Ex"].DB||false,
            "Storage":{
                "local":JSON.parse(localStorage[kfsshrimp.id]||`{}`),
                "session":JSON.parse(sessionStorage[kfsshrimp.id]||`{}`)
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
                    Ex.obj.styleSheet.title = kfsshrimp.id;
                    Ex.obj.styleSheet.innerText = Ex.style;
                    
                    document.head.appendChild( Ex.obj.styleSheet );
                },
                "obj_set":function(){

                    Ex.obj.Ex_div = document.createElement("div");
                    Ex.obj.Ex_div.id = kfsshrimp.id;

                    Ex.obj.msg = document.createElement("div");
                    Ex.obj.msg.id = `${kfsshrimp.id}-Msg`;
                    Ex.obj.msg.innerHTML = `
                    <div></div>
                    <a data-event="close" data-obj="${kfsshrimp.id}-Msg">關閉</a>
                    `;

                    Ex.obj.menu = document.createElement("div");
                    Ex.obj.menu.id = `${kfsshrimp.id}-Menu`;
                    Ex.obj.menu.innerHTML = `
                    <ul>
                    <li><a data-event="Game" data-mode="PostCard">出牌</a></li>
                    <li><a data-event="Game" data-mode="PostCard2">收回出牌</a></li>
                    <li><a data-event="Game" data-mode="PostCardPass">結束出牌</a></li>
                    </ul>
                    `;
                    

                    document.body.appendChild( Ex.obj.Ex_div );
                    document.body.appendChild( Ex.obj.msg );
                    document.body.appendChild( Ex.obj.menu );
                },
                "DB_on":(r)=>{

                    if(r===null)
                    {
                        delete Ex.Storage.local.game_id;
                        Ex.f.StorageUpd();
                        Ex.f.MsgPop(`牌局已結束<BR><a data-event="Restart">刷新</a>`);
                        return;
                    }

                    Ex.flag.game = r;
                    
                    
                    Ex.obj.Ex_div.querySelector("ul#players").innerHTML = '';

                    for(var k in r.players)
                    {
                        Ex.obj.Ex_div.querySelector("ul#players").innerHTML += 
                        `<li 
                        data-event="Game" data-mode="Kick" 
                        ${(r.players[k].nick_name===Ex.flag.game.flag)?`class="now_turn"`:""}>${r.players[k].nick_name}</li>`;
                    }
                    

                    if(Ex.flag.game.flag!=="wait")
                    {
                        Ex.f.game_start();
                    }

                    
                },
                "game_start":()=>{

                    //var players = Object.values(Ex.flag.game.players);
                    var player_div = document.querySelectorAll(".player_cards");

                    var players = [];
                    var values = Object.values(Ex.flag.game.players);
                    var self_i;

                    values.forEach((p,i)=>{
                        if(p.nick_name===GLOBAL.session_user.nick_name)
                        {
                            self_i = i;
                        }
                    });
                    
                    players[0] = values[ self_i ];
                    for(var i=1;i<4;i++)
                    {
                        self_i++;
                        if(self_i>3) self_i = 0;
                        
                        players[i] = values[ self_i ];

                        
                        
                    }
                    




                    
                    for(var i in players)
                    {
                        if(players[i].nick_name===GLOBAL.session_user.nick_name)
                        {
                            player_div[0].dataset.player = players[i].nick_name;
                            player_div[0].innerHTML = ``;
                            for(var card of players[i].cards||[])
                            {
                                var _class = `color${card.split(",")[0]} nu${card.split(",")[1]}`;

                                player_div[0].innerHTML += 
                                `<div draggable="true" class="poker ${_class}" data-event="Game" 
                                data-r_event="PokerMenu" data-mode="PokerSelect"></div>`;
                            }
                            players.splice(i,1);
                        }
                    }

                    for(var i in players)
                    {
                        player_div[i*1+1].dataset.player = players[i].nick_name;
                        player_div[i*1+1].innerHTML = ``;

                        for(var card of players[i].cards)
                        {
                            player_div[i*1+1].innerHTML += 
                            `<div draggable="true" class="poker back"></div>`;
                        }
                    }

                    player_div.forEach((o,eq)=>{
                        o.style.display = (eq%2===0)?"flex":"block";

                        (o.dataset.player===Ex.flag.game.flag)?o.classList.add("now_trun"):o.classList.remove("now_trun");
                    });

                    
                    if(Ex.flag.game.post_card===undefined)
                    {
                        document.querySelectorAll(`.post_card`).forEach(o=>{
                            o.remove();
                        });
                    }

                    document.querySelectorAll(`.post_card`).forEach(o=>{
                        
                        if( Object.keys(Ex.flag.game.post_card).indexOf(o.id)===-1 )
                        {
                            o.remove();
                        }

                    });

                    for(var id in Ex.flag.game.post_card)
                    {
                        if(document.querySelector(`[id="${id}"].post_card`)!==null)
                        {
                            continue;
                        }

                        var post_card_info = Ex.flag.game.post_card[id];

                        var post_card_div = document.createElement("div");
                        post_card_div.className = "post_card";
                        post_card_div.id = id;
                        post_card_div.dataset.post_card_id = id;
                        post_card_div.dataset.r_event = "PokerMenu";
                        post_card_div.setAttribute("draggable","true");
                        post_card_div.innerHTML = `<span>${post_card_info.nick_name}</span>`;

                        post_card_info.cards.forEach(c=>{

                            var _class = `color${c.split(",")[0]} nu${c.split(",")[1]}`;

                            post_card_div.innerHTML += `<div
                            data-post_card_id="${id}" 
                            data-r_event="PokerMenu" 
                            draggable="true" class="poker ${_class}" ></div>`;
                        });

                        var count = document.querySelectorAll(".post_card").length;

                        post_card_div.style.top = `${window.innerHeight/4+count*20}px`;
                        post_card_div.style.left = `${window.innerWidth/4+count*20}px`;


                        Ex.obj.Ex_div.appendChild(post_card_div);
                    }


                    Ex.obj.Ex_div.querySelectorAll(`[data-mode="start"]`).forEach(o=>{o.remove()});


                },
                "game_join":(path)=>{
                    
                    Ex.DB.ref(path).off();

                    Ex.DB.ref(path).on("value",r=>{
                        
                        Ex.f.DB_on(r.val());

                    });

                    Ex.obj.msg.style.display = "none";
                },
                "game_set":function(){

                    var word = '';
                    if(GLOBAL.session_user===null)
                    {
                        word = `<input data-event="PlurkLogin" type="button" value="必須登入PLURK帳號"><hr>`;
                    }

                    if(Ex.Storage.local.game_id!==undefined)
                    {
                        word = `目前加入牌局：${Ex.Storage.local.game_id}<BR>`;
                    }

                    Ex.obj.Ex_div.innerHTML = `

                    <div draggable="true" class="player_cards"></div>
                    <div draggable="true" class="player_cards"></div>
                    <div draggable="true" class="player_cards"></div>
                    <div draggable="true" class="player_cards"></div>


                            <div draggable="true">
                            ${word}
                                <input ${(word!='')?disabled="disabled":""} 
                                type="button" data-event="Game" data-mode="join" value="參加牌局">
                                <input ${(word!='')?disabled="disabled":""} 
                                type="button" data-event="Game" data-mode="new" value="建立牌局">
                                <BR>
                                <input 
                                type="button" data-event="Exit" value="關閉外掛">
                                <input 
                                type="button" data-event="Restart" value="重啟外掛">
                                <ul id="players">
                                </ul>
                            </div>
                        `;

                    if(Ex.Storage.local.game_id!==undefined)
                    {
                        Ex.f.game_join(`poker/${Ex.Storage.local.game_id}/`);

                        if(Ex.Storage.local.game_id===GLOBAL.session_user.nick_name)
                        {
                            Ex.obj.Ex_div.querySelector("div:last-child").innerHTML += '<input type="button" data-event="Game" data-mode="start" value="開始牌局">';
                        }

                        Ex.obj.Ex_div.querySelector("div:last-child").innerHTML += 
                        '<input type="button" data-event="Game" data-mode="leave" value="離開牌局">';
                    }                    

                },
                "PokerMenu":(e)=>{

                    Ex.obj.menu.style.left = e.clientX + 'px';
                    Ex.obj.menu.style.top = e.clientY + 'px';
                    Ex.obj.menu.style.display = "block";

                    for(var k in e.target.dataset)
                    {
                        if(k.indexOf("event")===-1)
                            Ex.obj.menu.dataset[k] = e.target.dataset[k];
                    }
                    
                },
                "Game":(e)=>{
                    

                    Ex.obj.Ex_div.querySelectorAll(`input[data-event="Game"]`).forEach(o=>{
                        //o.setAttribute("disabled","disabled");
                    });

                    (Ex.flag.confirm[ e.target.dataset.mode ]===undefined)?Ex.flag.confirm[ e.target.dataset.mode ]=true:'';


                    switch(e.target.dataset.mode)
                    {
                        case "new":
                            console.log("new");

                            Ex.obj.Ex_div.querySelectorAll(`[data-mode="join"],[data-mode="new"]`).forEach(o=>{o.setAttribute("disabled","disabled")});

                            Ex.DB.ref(`poker/${GLOBAL.session_user.nick_name}/`).off();

                            Ex.DB.ref(`poker/${GLOBAL.session_user.nick_name}/`).on("value",r=>{

                                Ex.f.DB_on(r.val());

                            });

                            Ex.Storage.local.game_id = GLOBAL.session_user.nick_name;

                            Ex.f.StorageUpd();



                            Ex.DB.ref(`poker/${GLOBAL.session_user.nick_name}/`).set( Ex.flag.game );

                            Ex.DB.ref(`poker/${GLOBAL.session_user.nick_name}/players`).push( {
                                "nick_name":GLOBAL.session_user.nick_name
                            } );

                            Ex.obj.Ex_div.querySelector("div:last-child").innerHTML = `目前加入牌局：${Ex.Storage.local.game_id}<BR>` + Ex.obj.Ex_div.querySelector("div:last-child").innerHTML;

                            Ex.obj.Ex_div.querySelector("div:last-child").innerHTML += '<input type="button" data-event="Game" data-mode="start" value="開始牌局"><input type="button" data-event="Game" data-mode="leave" value="離開牌局">';

                        break;

                        case "join":
                            Ex.f.MsgPop(`
                            開局噗浪帳號：
                            <input type="text" value=""><BR>
                            <a data-event="Game" data-mode="join2">加入</a>
                            `,e);
                            
                        break;

                        case "join2":
                            var join_nick_name = e.target.parentElement.querySelector(`input[type="text"]`).value;

                            if(join_nick_name===GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop(`不可輸入自己帳號`,e);
                                return;
                            }
                        

                            Ex.DB.ref(`poker/${join_nick_name}/`).once("value",r=>{
                                
                                r = r.val();
                                Ex.flag.game = r;

                                if(Ex.flag.game===null)
                                {
                                    Ex.f.MsgPop(`無此牌局`,e);
                                    Ex.obj.Ex_div.querySelectorAll(`input[data-event="Game"]`).forEach(o=>{
                                        o.removeAttribute("disabled","disabled");
                                    });
                                    return;
                                }

                                if(Object.keys(Ex.flag.game.players).length>=4)
                                {
                                    Ex.f.MsgPop("玩家人數已滿",e);
                                    Ex.obj.Ex_div.querySelectorAll(`input[data-event="Game"]`).forEach(o=>{
                                        o.removeAttribute("disabled","disabled");
                                    });
                                    return;
                                }

                                Ex.Storage.local.game_id = join_nick_name;

                                Ex.f.StorageUpd();



                                Ex.DB.ref(`poker/${join_nick_name}/players`).push( {
                                    "nick_name":GLOBAL.session_user.nick_name
                                } );


                                Ex.f.game_join(`poker/${join_nick_name}/`);
                                

                                Ex.obj.Ex_div.querySelector("div:last-child").innerHTML += '<input type="button" data-event="Game" data-mode="leave" value="離開牌局">';

                            });
                            

                        break;

                        case "leave":
                            if( Ex.flag.confirm.leave )
                            {
                                Ex.f.MsgPop(`確定要離開牌局嗎？<BR>
                                <a data-event="Game" data-mode="leave">離開牌局</a>
                                `,e);
                                Ex.flag.confirm.leave = false;

                                setTimeout(()=>{
                                    Ex.flag.confirm.leave = true;
                                },5000);
                                return;
                            }


                            for(var i in Ex.flag.game.players)
                            {
                                var player = Ex.flag.game.players[i];
                                
                                if(player.nick_name===GLOBAL.session_user.nick_name)
                                {
                                    delete Ex.flag.game.players[i];
                                }
                            }

                            if(Object.keys(Ex.flag.game.players||{}).length===0 || Ex.Storage.local.game_id===GLOBAL.session_user.nick_name)
                            {
                                Ex.flag.game = {};
                            }

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).off();

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).set( Ex.flag.game );

                            delete Ex.Storage.local.game_id;

                            Ex.f.StorageUpd();
                            Ex.f.Restart();

                        break;


                        case "Kick":

                            if(e.target.innerHTML===GLOBAL.session_user.nick_name || GLOBAL.session_user.nick_name!==Ex.Storage.local.game_id) return;


                            if( Ex.flag.confirm.Kick )
                            {
                                Ex.f.MsgPop(`確定要退出【${e.target.innerHTML}】該玩家？<BR>
                                <a data-event="Game" data-mode="Kick" data-player="${e.target.innerHTML}">確定</a>
                                `,e);
                                Ex.flag.confirm.Kick = false;

                                setTimeout(()=>{
                                    Ex.flag.confirm.Kick = true;
                                },5000);
                                return;
                            }

                            
                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/players/${Ex.f.GetPlayerNo(e.target.dataset.player)}`).remove();

                            Ex.obj.msg.style.display = "none";

                        break;


                        case "start":

                            if(Object.keys(Ex.flag.game.players).length<4)
                            {
                                Ex.f.MsgPop("玩家人數未滿",e);
                                Ex.obj.Ex_div.querySelectorAll(`input[data-event="Game"]`).forEach(o=>{
                                    //o.removeAttribute("disabled","disabled");
                                });
                                return;
                            }

                            var poker = [];
                            for(var nu=1;nu<=13;nu++)
                            for(var color=1;color<=4;color++)
                            {
                                poker.push( `${color},${nu}` )
                            }
                            Ex.f.shuffle(poker);

                            for(var i in Ex.flag.game.players)
                            {
                                Ex.flag.game.players[i].cards = [];

                                for(var card=1;card<=13;card++)
                                {
                                    var get_card = poker.pop();
                                    if(get_card==="1,3") Ex.flag.game.flag = Ex.flag.game.players[i].nick_name;

                                    Ex.flag.game.players[i].cards.push( get_card );
                                }
                            }

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).update( Ex.flag.game );

                        break;

                        case "PokerSelect":
                            e.target.classList.add("select");
                            e.target.innerHTML = `<div 
                            data-post_card_id="" 
                            data-r_event="PokerMenu" 
                            data-event="Game" data-mode="PokerUnSelect"></div>`;
                        break;

                        case "PokerUnSelect":
                            e.target.parentElement.classList.remove("select");
                            e.target.remove();
                        break;


                        case "PostCard":
                            if(Ex.flag.game.flag!==GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop(`等待${Ex.flag.game.flag}的出牌`,e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            var post_card = [];
                        /*
                            Ex.flag.game.post_card = Ex.flag.game.post_card||[];
                            var post_card = [];
                            
                            var post_card_div = document.createElement("div");
                            post_card_div.className = "post_card";
                            post_card_div.setAttribute("draggable","true");
                            post_card_div.innerHTML = `<span>${GLOBAL.session_user.nick_name}</span>`;
                        */ 
                            if(document.querySelectorAll(".poker.select").length===0)
                            {
                                Ex.f.MsgPop('未選擇牌',e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }
                            

                            document.querySelectorAll(".poker.select").forEach(o=>{

                                o.classList.remove("select");
                                //post_card_div.appendChild( o );

                                post_card.push( 

                                    [...o.classList].filter( c=>{ return (c!=="poker"); } ).map(d=>{return d.match(/\d+/)[0];}).join(",")

                                );
                            });

                            /*
                            Ex.flag.game.post_card[ Ex.flag.game.post_card.length ] = {
                                "nick_name":GLOBAL.session_user.nick_name,
                                "cards":post_card
                            };
                            */

                            Object.values(Ex.flag.game.players).forEach((p)=>{
                                if(p.nick_name===GLOBAL.session_user.nick_name)
                                {
                                    var new_cards = [];
                                    p.cards.forEach( (c)=>{
                                        if(post_card.indexOf(c)===-1)
                                        {
                                            new_cards.push( c );
                                        }
                                    });
                                    p.cards = new_cards;
                                }
                            });

                            for(var id in Ex.flag.game.players)
                            {
                                var p = Ex.flag.game.players[id];
                                if(p.nick_name===GLOBAL.session_user.nick_name)
                                {
                                    var new_cards = [];
                                    p.cards.forEach( (c)=>{
                                        if(post_card.indexOf(c)===-1)
                                        {
                                            new_cards.push( c );
                                        }
                                    });
                                    //p.cards = new_cards;
                                    Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/players/${id}/cards`).set( new_cards );
                                }
                            }


                            //Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/turn`).set( Ex.flag.game.turn*1+1 );


                            //Ex.obj.Ex_div.appendChild(post_card_div);

                            //Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).update( Ex.flag.game );

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/post_card`).push({
                                "turn":Ex.flag.game.turn,
                                "nick_name":GLOBAL.session_user.nick_name,
                                "cards":post_card
                            });

                            Ex.obj.menu.style.display = "none";
                            
                        break;

                        case "PostCard2":

                            if(Ex.flag.game.flag!==GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop(`等待${Ex.flag.game.flag}的出牌`,e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            if(Ex.flag.game.post_card[ Ex.obj.menu.dataset.post_card_id ].turn!==Ex.flag.game.turn)
                            {
                                Ex.f.MsgPop('不可收回之前的出牌',e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            if(Ex.obj.menu.dataset.post_card_id===``)
                            {
                                Ex.f.MsgPop('未選擇出牌',e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }
                            var post_card_div = document.querySelector(`[id="${Ex.obj.menu.dataset.post_card_id}"].post_card`);

                            if(post_card_div.querySelector("span").innerHTML!==GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop('不可回收其他玩家的牌',e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            post_card_div.querySelectorAll(".poker").forEach(o=>{
                                
                                Object.values(Ex.flag.game.players).forEach(p=>{
                                    if(p.nick_name===GLOBAL.session_user.nick_name)
                                    {
                                        p.cards = p.cards||[];
                                        p.cards.push(
                                            [...o.classList].filter( c=>{ return (c!=="poker"); } ).map(d=>{return d.match(/\d+/)[0];}).join(",")
                                        );
                                    }
                                });
                            });

                            
                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/players`).update(Ex.flag.game.players);

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/post_card/${Ex.obj.menu.dataset.post_card_id}`).remove();


                            Ex.obj.menu.style.display = "none";
                        break;

                        case "PostCardPass":

                            if(Ex.flag.game.flag!==GLOBAL.session_user.nick_name)
                            {
                                Ex.f.MsgPop(`等待${Ex.flag.game.flag}的出牌`,e);
                                Ex.obj.menu.style.display = "none";
                                return;
                            }

                            var values = Object.values(Ex.flag.game.players);
                            var keys = Object.keys(Ex.flag.game.players);

                            
                            var _flag;
                            values.forEach((p,i)=>{
                                if(p.nick_name===GLOBAL.session_user.nick_name)
                                {
                                    _flag = (i+1>=values.length)?Ex.flag.game.players[ keys[0] ].nick_name:Ex.flag.game.players[ keys[i+1] ].nick_name;
                                }
                            });

                            Ex.flag.game.turn++;
                            Ex.flag.game.flag = _flag;

                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/`).update( Ex.flag.game );

                            Ex.obj.menu.style.display = "none";


                        break;


                        default:
                        break;
                    }


                },
                "Restart":()=>{
                    
                    Ex.f.Exit();
                    setTimeout(()=>{
                        kfsshrimp.Ex_set();
                    },500);
                    
                },
                "Exit":()=>{
                    for(var k in Ex.obj)
                    {
                        Ex.obj[k].remove();
                        delete Ex.obj[k];
                    }
                    delete kfsshrimp.Ex[kfsshrimp.id];
                },
                "StorageUpd":()=>{
                    localStorage[kfsshrimp.id] = JSON.stringify(Ex.Storage.local);
                    sessionStorage[kfsshrimp.id] = JSON.stringify(Ex.Storage.session);
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
                "PlurkLogin":()=>{
                    location.href = 'https://www.plurk.com/login';
                },
                "shuffle":(ary)=>{
                    for (let i = ary.length - 1; i > 0; i--) {
                        let j = Math.floor(Math.random() * (i + 1));
                        [ary[i], ary[j]] = [ary[j], ary[i]];
                    }
                },
                "GetPlayerNo":(nick_name)=>{
                    for(var no in Ex.flag.game.players)
                    {
                        if(Ex.flag.game.players[no].nick_name===nick_name)
                        {
                            return no;
                        }
                    }
                },
                "default":()=>{


                    if( kfsshrimp.default_event!==true )
                    {
                        kfsshrimp.default_event = true;

                        document.addEventListener("dragend",function(e){

                            if(e.target.getAttribute("draggable")==="true")
                            {
                                e.target.style.left = e.clientX - Ex.flag.mousedown.offsetX + "px";
                                e.target.style.top = e.clientY - Ex.flag.mousedown.offsetY + "px";

                                if(e.target.classList.contains("poker"))
                                {
                                    for(var i=0;i<e.target.parentElement.children.length;i++)
                                    {
                                        var o = e.target.parentElement.children[i];

                                        if(o===e.target)
                                        {
                                            var x_move = Math.round( (e.clientX - Ex.flag.mousedown.clientX) / 70);

                                            if(x_move>0)x_move++;
                                            if(x_move<0 && i===0) x_move = 0;
                                            
                                            e.target.parentElement.insertBefore(e.target,e.target.parentElement.children[i*1 + x_move*1]);

                                            var new_cards = [];

                                            e.target.parentElement.children.forEach(o=>{ 
                                                
                                                new_cards.push(
                                                    [...o.classList].filter( c=>{ return (c!=="poker"); } ).map(d=>{return d.match(/\d+/)[0];}).join(",")
                                                );
                                            });


                                            Ex.DB.ref(`poker/${Ex.Storage.local.game_id}/players/${Ex.f.GetPlayerNo(GLOBAL.session_user.nick_name)}/cards`).update( new_cards );

                                            break;
                                        }
                                    }

                                }
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

                    }
                        

                    Ex.f.DB_set( ()=>{

                        Ex.f.style_set();
                        Ex.f.obj_set();
                        Ex.f.game_set();
                    });
                    
                }
            },
            "flag":{
                "game":{
                    "players":{
                        
                    },
                    "flag":'wait',
                    "turn":1
                },
                "confirm":{}
            },
            "style":`
                #${kfsshrimp.id}{
                    color:#fff;
                    padding:0px;
                    margin:0px;
                    left:0;
                    top:0;
                    position:absolute;
                }
                #${kfsshrimp.id}-Msg {
                    display:none;
                    border-radius: 5px;
                    border: 2px solid #000;
                    background: #00f5;
                    padding: 2px;
                    text-align: center;
                    position: fixed;
                }

                #${kfsshrimp.id}-Msg div{
                    color:#fff;
                }
                #${kfsshrimp.id}-Msg input[type=text]{
                    height: 20px;
                    width: 100px;
                }

                #${kfsshrimp.id}-Msg a{
                    color:#fff;
                }

                #${kfsshrimp.id}-Msg a:hover{
                    color:#f00;
                    text-decoration: underline;
                }

                #${kfsshrimp.id}-Menu {
                    display:none;
                    border-radius: 5px;
                    border: 2px solid #000;
                    background: #00f5;
                    padding: 2px;
                    text-align: center;
                    position: fixed;
                }

                #${kfsshrimp.id}-Menu li {
                    border-radius: 5px;
                    padding: 2px 8px;
                }


                #${kfsshrimp.id}-Menu a{
                    color:#fff;
                }

                #${kfsshrimp.id}-Menu a:hover{
                    color:#f00;
                    text-decoration: underline;
                }

                

                

                #${kfsshrimp.id} [draggable="true"]{
                    cursor:move;
                }
                #${kfsshrimp.id}>div{
                    top: 10%;
                    border-radius: 5px;
                    border: 2px solid #000;
                    padding: 4px;
                    background: #00f5;
                    position: fixed;
                }

                #${kfsshrimp.id} .player_cards{
                    display:none;
                    padding-bottom: 20px;
                }

                #${kfsshrimp.id} .player_cards.now_trun{
                    background:#f005;
                    
                }
                

                #${kfsshrimp.id} .player_cards:nth-child(1){
                    padding-top: 20px;
                    top: calc(90% - 100px);
                    left: 15%;
                }

                #${kfsshrimp.id} .player_cards:nth-child(1) .poker:hover{
                    transform: scale(1.1);
                }
                #${kfsshrimp.id} .player_cards:nth-child(1) .poker.select{
                    transform: translateY(-20px);
                }
                #${kfsshrimp.id} .player_cards:nth-child(1) .poker div{
                    width: 100%;
                    height: 100%;
                    border: 2px dotted #00f;
                    background: #fff9;
                }
                


                #${kfsshrimp.id} .player_cards:nth-child(2){
                    top: 30%;
                    left: calc(90% - 100px);
                }

                #${kfsshrimp.id} .player_cards:nth-child(3){
                    left: 30%;
                    top: 5%;
                }

                #${kfsshrimp.id} .player_cards:nth-child(4){
                    top: 30%;
                    left: 10%;
                }


                #${kfsshrimp.id} .player_cards:nth-child(3) .poker{
                    margin-left: -40px;
                }

                #${kfsshrimp.id} .player_cards:nth-child(2) .poker,
                #${kfsshrimp.id} .player_cards:nth-child(4) .poker{
                    transform: rotateZ(90deg); 
                    margin-top: -80px;
                }

                #${kfsshrimp.id} .post_card {
                    min-height:100px;
                    min-width:210px;
                    background: transparent;
                    position:absolute;
                    display: flex;
                    border: none;
                    padding:20px 10px 10px 10px;
                }

                #${kfsshrimp.id} .post_card span{
                    position: absolute;
                    margin-top: -18px;
                    background: #FF574D;
                    color: #fff;
                    border-radius: 5px;
                    padding: 0px 4px;
                    cursor: pointer;
                }
                

                #${kfsshrimp.id} .post_card:hover{
                    background:#fff5;
                }
                




                

                #${kfsshrimp.id} input{
                    padding: 8px;
                    margin: 2px;
                }

                #${kfsshrimp.id} input[disabled]{
                    cursor:not-allowed;
                }

                #${kfsshrimp.id} ul{
                    border: 1px solid #fff;
                    border-radius: 5px;
                    padding: 5px;
                    margin: 5px;
                }
                #${kfsshrimp.id} ul li{
                    background: #FF574D;
                    color: #fff;
                    border-radius: 5px;
                    padding: 2px 10px;
                    margin: 4px 2px;
                    cursor: pointer;
                }
                #${kfsshrimp.id} ul li:hover,#${kfsshrimp.id} input:hover:not([disabled]){
                    background: #00f !important;
                }


                #${kfsshrimp.id} ul li.now_turn{
                    animation: ani1 1s linear infinite;
                }

                @keyframes ani1 {
                    0%,100% {
                        opacity:1;
                    }
                    50% {
                        opacity:0;
                    }
                }

                #${kfsshrimp.id} .poker{
                    transition-duration: 0.5s;
                    width:70px;
                    height:100px;
                    background: url(https://upload.wikimedia.org/wikipedia/commons/a/a1/Svg-cards-2.0.svg);
                    background-size: 1285%;
                    cursor:pointer;
                }

                #${kfsshrimp.id} .poker.back{
                    background-position: -138px -402px;
                }

                #${kfsshrimp.id} .poker.nu1{
                    background-position-x: 0;
                }
                #${kfsshrimp.id} .poker.nu2{
                    background-position-x: calc(-68px * 1);
                }
                #${kfsshrimp.id} .poker.nu3{
                    background-position-x: calc(-69px * 2);
                }
                #${kfsshrimp.id} .poker.nu4{
                    background-position-x: calc(-69px * 3);
                }
                #${kfsshrimp.id} .poker.nu5{
                    background-position-x: calc(-69px * 4);
                }
                #${kfsshrimp.id} .poker.nu6{
                    background-position-x: calc(-69px * 5);
                }
                #${kfsshrimp.id} .poker.nu7{
                    background-position-x: calc(-69px * 6);
                }
                #${kfsshrimp.id} .poker.nu8{
                    background-position-x: calc(-69px * 7);
                }
                #${kfsshrimp.id} .poker.nu9{
                    background-position-x: calc(-69px * 8);
                }
                #${kfsshrimp.id} .poker.nu10{
                    background-position-x: calc(-69px * 9);
                }
                #${kfsshrimp.id} .poker.nu11{
                    background-position-x: calc(-69px * 10);
                }
                #${kfsshrimp.id} .poker.nu12{
                    background-position-x: calc(-69px * 11);
                }
                #${kfsshrimp.id} .poker.nu13{
                    background-position-x: calc(-69px * 12);
                }


                #${kfsshrimp.id} .poker.color1{
                    background-position-y: calc(-100px * 0);
                }

                #${kfsshrimp.id} .poker.color2{
                    background-position-y: calc(-100px * 1);
                }

                #${kfsshrimp.id} .poker.color3{
                    background-position-y: calc(-100px * 2);
                }

                #${kfsshrimp.id} .poker.color4{
                    background-position-y: calc(-100px * 3);
                }

                
                

            `
        }

        Ex = kfsshrimp.Ex[ kfsshrimp.id ];

        Ex.f.default();
    },
    "Ex":{}
};



kfsshrimp.Ex_set();


})();


//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/PlurkEx.js?s=${new Date().getTime()}`;document.head.prepend(js);
//eval(atob('dmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7anMuc3JjID0gIGBodHRwczovL2tmc3NocmltcC5naXRodWIuaW8vcGx1cmsvUGx1cmtFeC5qcz9zPTE2NDE4OTU2MTg0MDRgO2RvY3VtZW50LmhlYWQucHJlcGVuZChqcyk7'))