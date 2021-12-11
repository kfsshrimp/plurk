var firebasejs1 = document.createElement("script");
firebasejs1.src="https://www.gstatic.com/firebasejs/5.5.6/firebase.js";
document.head.appendChild(firebasejs1);

if( typeof(G)!=='undefined' )
{
    G.chat.remove();
}

var G = {
    "style":`
        #top_chat{
            border-radius: 10px;
            background: rgba(125,125,125,0.5);
            z-index: 9999;
            position: absolute;
            resize: both;
            overflow: auto;
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
    `,
    "selector":`[author-type="moderator"]`,//
    "style_set":()=>{
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = G.style;
        document.head.appendChild(styleSheet);
    },
    "chat_set":()=>{

        G.chatframe = document.querySelector("iframe#chatframe");
        G.node = G.chatframe.contentDocument.querySelectorAll(G.selector);

        G.chat = document.createElement("div");
        G.chat.id = "top_chat";
        G.chat.setAttribute("draggable","true");

        var chat_info = G.chatframe.getBoundingClientRect();
        G.chat.style.left = `${chat_info.left}px`;
        G.chat.style.top = `${chat_info.top}px`;
        G.chat.style.height = `${chat_info.height}px`;
        G.chat.style.width = `${chat_info.width}px`;

        window.addEventListener("resize",()=>{
            var chat_info = G.chatframe.getBoundingClientRect();
            G.chat.style.left = `${chat_info.left}px`;
            G.chat.style.top = `${chat_info.top}px`;
            G.chat.style.height = `${chat_info.height}px`;
            G.chat.style.width = `${chat_info.width}px`;
        });

        document.body.prepend(G.chat);

        for(var i=0;i<G.node.length;i++)
        {
            var message = G.node[i];

            var html = message.innerText;
            html = html.split("\n").map((t)=>{
                return `<a>${t}</a>`;
            });
            html[2] = message.querySelector("#message").innerHTML;

            var div = document.createElement("div");
            div.id = message.id;
            div.innerHTML = html.join(" ");

            G.chat.appendChild(div);
        }

        G.chat_ref();

    },
    "chat_ref":()=>{

        G.node = G.chatframe.contentDocument.querySelectorAll(G.selector);

        for(var i=0;i<G.node.length;i++)
        {
            var message = G.node[i];

            if(G.chat.querySelector(`[id="${message.id}"]`)!==null) continue;

            var html = message.innerText;
            html = html.split("\n").map((t)=>{
                return `<a>${t}</a>`;
            });
            html[2] = message.querySelector("#message").innerHTML;

            var div = document.createElement("div");
            div.innerHTML = html.join(" ");
            div.id = message.id;
            G.chat.appendChild(div);
        }

        if(G.stop===true) return;

        G.chat.scrollTo( 0,G.chat.scrollHeight );

        setTimeout(()=>{G.chat_ref();},1000);
    },
    DB_set:()=>{
        
        if(typeof(firebase)==='undefined')
        {
            setTimeout(()=>{G.DB_set();},0);
            return;
        }
        
        G.DB = firebase;
        G.DB.initializeApp({databaseURL:"https://kfs-plurk-default-rtdb.firebaseio.com/"});
        G.DB = G.DB.database();
    }
    


};

window.addEventListener("dragend",function(e){

    if(e.target.getAttribute("draggable")==="true")
    {
        e.target.style.left = e.clientX - G.mousedown.offsetX + "px";
        e.target.style.top = e.clientY - G.mousedown.offsetY + window.scrollY + "px";
    }
});


window.addEventListener("mousedown",function(e){
    G.mousedown = e;
});



G.style_set();
G.chat_set();
//G.DB_set();





/*
var js = document.createElement("script");
js.src = "https://kfsshrimp.github.io/plurk/YtChatEx.js";
document.head.prepend(js);
*/