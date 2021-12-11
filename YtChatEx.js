var G = {
    "style":`
        #top_chat{
            background: #000;
            z-index: 9999;
            position: absolute;
            color:#fff;
            resize: both;
            overflow: auto;
            cursor: pointer;
        }
        #top_chat div{
            border:1px solod #f00;
            margin:2px;
            padding:2px;
            color:#000;
            background: #fff;
        }
    `,
    "selector":`[author-type="moderator"]`,
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

        document.body.prepend(G.chat);


        for(var i=0;i<G.node.length;i++)
        {
            var message = G.node[i];
            //console.log(message[i].innerText);

            //console.log(message[i].querySelector("#author-name"));

            console.log(message.innerText);
                
            var div = document.createElement("div");
            div.innerHTML = message.innerText;
            div.style = `
            background: #fff;
            color:#000;
            `;

            G.chat.appendChild(div);
        }
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