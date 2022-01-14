(()=>{
    var mousedown;
    var video = document.querySelector("video");
    var screenshot = document.createElement("div");
    screenshot.id = "screenshot";
    document.body.prepend(screenshot);


    var styleSheet = document.createElement("style");
    styleSheet.innerText = `
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
    `;
    document.head.appendChild( styleSheet );

    var div = document.createElement("div");
    div.className = `ytp-menuitem`;
    div.innerHTML = `
    <div class="ytp-menuitem-icon">
    <img src="https://avatars.plurk.com/14556765-small9788529.gif"></div>
    <div class="ytp-menuitem-label">快速截圖</div>
    <div class="ytp-menuitem-content"></div>
    </div>`;
    div.addEventListener("click",()=>{

        var canvas = document.createElement("canvas");
        canvas.setAttribute("draggable","true");
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        canvas.getContext("2d").drawImage(video,0,0,video.clientWidth,video.clientHeight);

        var idx = `${new URLSearchParams(location.search).get("v")}-${Math.floor(video.currentTime)}`
        sessionStorage[ idx ] = canvas.toDataURL();

        screenshot.appendChild(canvas);

        document.querySelector(".ytp-popup.ytp-contextmenu").style.display = "none";

    });

    document.addEventListener("contextmenu",(e)=>{
        if(document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu")!==null)
        {
            document.querySelector(".ytp-popup.ytp-contextmenu .ytp-panel-menu").prepend(div);
        }
        if(e.target.nodeName==="CANVAS")
        {
            e.preventDefault();
            e.stopPropagation();
            var n_w = window.open("","_target",`width=${video.clientWidth},height=${video.clientHeight}`);
            n_w.document.body.style = "margin:0px";
            n_w.document.body.innerHTML = `<img src="${e.target.toDataURL()}">`;
        }
    });

    screenshot.addEventListener("dragend",function(e){

        if(e.target.getAttribute("draggable")==="true")
        {
            e.target.style.left = e.clientX - mousedown.offsetX + "px";
            e.target.style.top = e.clientY - mousedown.offsetY + "px";
        }
    });
        
    document.addEventListener("mousedown",function(e){
        mousedown = e;
    });


})();