var ALL = {
    "MENU":{
        "HOLO":{
            "JP":{
                "0期生":{
                    "ときのそら":["空媽"],
                    "AZKi":["AZKI"],
                    "ロボ子さん":["RBC"],
                    "さくらみこ":["35","櫻"]
                },
                "GAMERS":{
                    "大神ミオ":["狼"],
                    "猫又おかゆ":["小粥"],
                    "戌神ころね":["狗"],
                    "白上フブキ":["FBK","白上吹雪"]
                },
                "1期生":{
                    "白上フブキ":["FBK","白上吹雪"],
                    "夜空メル":["梅露"],
                    "夏色まつり":["夏哥"],
                    "赤井はあと":["哈醬馬","哈洽馬","赤井心"],
                    "アキ・ローゼンタール":["AKI"]
                },
                "2期生":{
                    "湊あくあ":["夸"],
                    "癒月ちょこ":["巧可","老師"],
                    "百鬼あやめ":["百鬼","大小姐"],
                    "紫咲シオン":["詩音"],
                    "大空スバル":["486","昂","大空"]
                },
                "3期生":{
                    "兎田ぺこら":["兔","佩克拉"],
                    "不知火フレア":["火"],
                    "白銀ノエル":["團長"],
                    "宝鐘マリン":["船長"],
                    "潤羽るしあ":["露西亞"]
                },
                "4期生":{
                    "天音かなた":["天使","猩"],
                    "桐生ココ":["會長","可可"],
                    "角巻わため":["羊"],
                    "常闇トワ":["TOWA","TMT"],
                    "姫森ルーナ":["LUNA","露娜"]
                },
                "4期生":{
                    "雪花ラミィ":["雪"],
                    "桃鈴ねね":["捏捏"],
                    "獅白ぼたん":["446","獅"],
                    "尾丸ポルカ":["座長","尾丸"]
                }
            },
            "EN":
            {
                "Ninomae Ina'nis":["ina"]
            }
        }
    },
    "api":null,
    "plurk":{},
    "obj":{},
    "loading":false,
    "config":{
        "api":new PlurkApi({
            act:"Timeline/getPlurk",
            arg:{
                plurk_id:PlurkId("onburz"),
            },
            func:function(xml){
                var plurk = JSON.parse((xml.response));
                ALL.config.plurk[ plurk.plurk.plurk_id ] = plurk;

                ALL.config.api.act = "Responses/get";
                ALL.config.api.func = function(xml){
                    
                    var replurk = JSON.parse((xml.response));
                    for(var r_id in replurk.responses)
                    {
                        let f_data = replurk.responses[r_id];
                        if(f_data.user_id!==plurk.plurk.user_id) continue;

                        ALL.config.plurk[ f_data.plurk_id ].responses = 
                        ALL.config.plurk[ f_data.plurk_id ].responses||{};

                        ALL.config.plurk[ f_data.plurk_id ].responses[ f_data.id ] = f_data;
                    }
                }
                setTimeout(()=>{ ALL.config.api.Send(); },100);
            }
        }),
        "plurk":{}
    }

}
window.onload = function(){
    

    ALL.config.api.Send();



    ALL.obj.block = document.querySelector("#block");
    if(ALL.obj.block===null)
    {
        ALL.obj.block = document.createElement("div");
        ALL.obj.block.id = "block";
        document.body.appendChild(ALL.obj.block);
    }

    ALL.obj.menu = document.querySelector("#menu");
    if(ALL.obj.menu===null)
    {
        ALL.obj.menu = document.createElement("div");
        ALL.obj.menu.id = "menu";
        document.body.appendChild(ALL.obj.menu);
    }

    ALL.obj.main = document.querySelector("#list");
    if(ALL.obj.main===null)
    {
        ALL.obj.main = document.createElement("div");
        ALL.obj.main.id = "main";
        document.body.appendChild(ALL.obj.main);
    }


    window.addEventListener("click",(e)=>{

        if(e.target.dataset.search)
        {
            Search( e.target.dataset.search );
        }

        if(e.target.dataset.keyword_search)
        {
            Search( ALL.obj.menu.querySelector("#keyword_search input[type=text]").value );
        }

        if(e.target.dataset.menu)
        {
            var path = e.target.dataset.menu;
            var menu = ALL;
            
            for(var k in path.split("."))
            {
                menu = menu[path.split(".")[k]];
            }

            MenuCr(path,e.target.parentElement);
        }

        if(e.target.dataset.iframe)
        {
            var iframe_div = e.target.parentElement.querySelector("[iframe]");
            iframe_div.querySelector("iframe").src = e.target.dataset.iframe;

            //iframe_div.querySelector("iframe").onload = ()=> {  };
            setTimeout(()=>{
                iframe_div.removeAttribute("hide")
            },1000);
        }

        if(e.target.getAttribute("draggable")===true)
        {
            var touchLocation = e.targetTouches[0];
        
            e.target.style.left = touchLocation.pageX - window.clientWidth/2;
            e.target.style.top = touchLocation.pageY  - window.clientHeight/3;
        }

        if(e.target.dataset.menu)
        {
            var path = e.target.dataset.menu;
            var menu = ALL;
            
            for(var k in path.split("."))
            {
                menu = menu[path.split(".")[k]];
            }

            MenuCr(path,e.target.parentElement);
        }


        if(e.target.getAttribute("close")!==null)
        {
            e.target.parentElement.querySelector("iframe").setAttribute("src","");
            e.target.parentElement.setAttribute("hide","");
        }
    })


    window.addEventListener("dragend",function(e){

        if(e.target.getAttribute("draggable")=="true")
        {
            e.target.style.left = e.clientX - ALL.mousedown.offsetX;
            e.target.style.top = e.clientY - ALL.mousedown.offsetY;
        }
    });


    window.addEventListener("mousedown",function(e){
        ALL.mousedown = e;
    });


    window.addEventListener("scroll",(e)=>{

        var list = document.querySelectorAll("#main>div>div[hide]");


        if(window.innerHeight+window.scrollY>=document.body.scrollHeight)
        {
            var show_count = Math.floor(document.querySelector("#main").offsetWidth / (document.querySelector("#main>div>div").offsetWidth));
            for(var i=0;i<show_count;i++)
            {
                if(list[i])
                list[i].removeAttribute("hide");
            }
        }


    });


    ALL.api = ALL.api||new PlurkApi();


    //ApiGetList( [PlurkId("omkzh9")] );

    var plurk_id_list = [
        "of50t3",
        "no5x7f",
        "noplba",
        "npiqwi",
        "nqdwra",
        "o1vtlu",
        "o5oq3y",
        "omkzh9"
    ].map(a=>{return PlurkId(a);});

    ApiGetList( plurk_id_list );
    
    

    MenuCr("MENU",ALL.obj.menu);
}

var x = 0;
function ApiGetList(plurk_id)
{
    if(x>99) return;

    var plurk = {};

    ALL.api.arg.plurk_id = plurk_id.pop();
    ALL.api.act = "Timeline/getPlurk";
    ALL.api.func = function(xml){

        plurk = JSON.parse((xml.response));

        if(ALL.plurk[ plurk.plurk.plurk_id ]!==undefined)
        {
            console.log("LOOP STOP");
            return; 
        }
        
        ALL.plurk[ plurk.plurk.plurk_id ] = plurk;
        ALL.plurk[ plurk.plurk.plurk_id ].api = new PlurkApi({
            act:"Responses/get",
            arg:{
                "plurk_id":plurk.plurk.plurk_id
            },
            func:function(xml){

                ALL.loading = false;
                var replurk = JSON.parse((xml.response));
                
                for(var r_id in replurk.responses)
                {
                    let f_data = replurk.responses[r_id];
                    if(f_data.user_id!==plurk.plurk.user_id) continue;

                    /*
                    if(f_data.content_raw.indexOf("https://www.plurk.com/")!==-1)
                    {
                        ALL.loading = true;

                        let tmp = f_data.content_raw.split("/").pop();

                        setTimeout(()=>{
                            ApiGetList( [PlurkId(tmp)] );
                        },1000);
                    }
                    */

                    ALL.plurk[ plurk.plurk.plurk_id ].responses = 
                    ALL.plurk[ plurk.plurk.plurk_id ].responses||{};
                    
                    ALL.plurk[ f_data.plurk_id ].responses[ f_data.id ] = f_data;
                }

            }
        });

        


        setTimeout( ()=>{ ALL.plurk[ plurk.plurk.plurk_id ].api.Send(); },1000);
        
    }
    ALL.api.Send();


    if(plurk_id.length>0)
    {
        setTimeout( ()=>{ApiGetList(plurk_id)},1000 );
    }

}



function MenuCr(path,obj)
{
    var menu = ALL;
    for(var k in path.split("."))
    {
        menu = menu[ path.split(".")[k] ];
    }

    for(let key in menu)
    {
        let div = document.createElement("div");
        let btn = document.createElement("input");
        btn.type = "button";
        btn.value = key;

        if( Array.isArray(menu[key]) )
        {
            btn.setAttribute("title",menu[key].join(" , "));
            btn.dataset.search = key+","+menu[key].join(",");
        }
        else
        {
            btn.dataset.menu = path+"."+key;
        }

        if( obj.querySelector(`[value="${key}"]`) ) continue;

        div.appendChild(btn);
        obj.appendChild(div);        
    }

    if(ALL.obj.menu.querySelector("#keyword_search")===null)
    {
        var div = document.createElement("div");
        div.id = "keyword_search";

        var txt = document.createElement("input");
        txt.type = "text";
        var bnt = document.createElement("input");
        bnt.type = "button";
        bnt.value = "搜尋";
        bnt.dataset.keyword_search = "true";

        div.appendChild(txt);
        div.appendChild(bnt);

        obj.appendChild(div);
    }


}



function Search(keyword)
{
    var search_result = {};
    for(var id in ALL.plurk)
    {
        for(var r_id in ALL.plurk[id].responses)
        for(var key in keyword.split(","))
        {
            var str = keyword.split(",")[key];
            if(str==="") continue;

            var f_data = ALL.plurk[id].responses[r_id];

            if(f_data.user_id!==ALL.plurk[id].plurk.owner_id) continue;

            if(f_data.content.toLocaleLowerCase().indexOf(str.toLocaleLowerCase())!==-1)
            {
                search_result[ f_data.id ] = f_data;
            }
        }
    }

    console.log(search_result);

    ALL.obj.main.innerHTML = "";
    
    /*
    var table = document.createElement("table");
    var tr,td;
    */

    var div = document.createElement("div");
    
    for(var id in search_result)
    {
        var f_data = search_result[ id ];

        var list = document.createElement("div");
        list.id = id;

        list.innerHTML = 
        `${f_data.content}<BR><date>${DateF(( f_data.posted ))}</date>`;

        div.appendChild(list);

        /*
        tr = document.createElement("tr");

        td = document.createElement("td");
        td.innerHTML = f_data.content;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = DateF(( f_data.posted ));
        tr.appendChild(td);

        table.appendChild(tr);
        */
    }

    ALL.obj.main.appendChild(div);




    for(var idx=0;idx<div.querySelectorAll("div").length;idx++)
    {
        var list = div.querySelectorAll("div")[idx];

        var a = list.querySelectorAll("a");

        var content_type = "";
        for(var i=0;i<a.length;i++)
        {
            if( a[i].href.indexOf("youtu")!==-1 ) content_type = "yt";
            if( a[i].href.indexOf("nhentai")!==-1 ) content_type = "nh";
        }
        list.className = content_type;

        
        if(content_type==="yt")
        {
            var title = list.querySelector("a").text;
            var img = list.querySelector("img").src;
            var date = list.querySelector("date").innerHTML;
            img = img.split("/");
            var yt_id = img["4"];
            img.pop();
            img.push("hqdefault.jpg");
            img = img.join("/");

            list.innerHTML = `
            <a target="_blank" href="${a[0].href}">
            <yt_title>${title}</yt_title>
            </a>
            <img data-iframe="https://www.youtube.com/embed/${yt_id}" src="${img}">
            <div draggable="true" hide iframe>
            <input type="button" value="關閉" close>
            <iframe src=""></iframe></div>
            <date>${date}</date>`;
        }
        else if(content_type==="nh")
        {
            var url = list.querySelectorAll("a:not([class*=pictureservices])");
            var title = list.text;
            var img = list.querySelectorAll("a[class*=pictureservices]");
            var date = list.querySelector("date").innerHTML;
            var plurk_id = (search_result[list.id].plurk_id).toString(36);

            for(var i=0;i<img.length;i++)
            {
                var tmp = img[i].querySelector("img").src;
                tmp = tmp.split("/");
                tmp["3"] = tmp["3"].split("_");
                tmp["3"].shift();
                tmp["3"] = tmp["3"].toString().replace("jpg","png")
                img[i].querySelector("img").src = tmp.join("/");
            }

            list.innerHTML = `
            <a target="_blank" href="https://www.plurk.com/p/${plurk_id}">PLURK</a>
            <a target="_blank" href="${url[0].href}">
            <img src="${img[0].querySelector("img").src}">
            </a>
            <date>${date}</date>
            `;
        }
        else
        {
            list.setAttribute("hide","");
        }


        if(list.offsetTop>=window.innerHeight+window.scrollY)
        {
            list.setAttribute("hide","");
        }
    }

    //ALL.obj.main.appendChild(table);
}



function LoadingBlock()
{
    if(ALL.obj.block.style.display==="block")
    {
        ALL.obj.block.style.opacity = "0";
        setTimeout(()=>{
            ALL.obj.block.style.display = "none";
        },1000)
    }
    else
    {
        ALL.obj.block.style.opacity = "1";
        ALL.obj.block.style.display = "block";
    }
}


function DateF(date)
{
    var _d = new Date(date);
    
    return _d.getFullYear() + "/" + 
    parseInt(_d.getMonth()+1).toString().padStart(2,"0") + "/" + 
    _d.getDate().toString().padStart(2,"0") + " " + 
    _d.getHours().toString().padStart(2,"0") + ":" + 
    _d.getMinutes().toString().padStart(2,"0") + ":" + 
    _d.getSeconds().toString().padStart(2,"0");
}



