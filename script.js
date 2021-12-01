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
    "timer":{
        "count":new Date().getTime()
    },
    "config":{
        "plurk_id":PlurkId("onburz"),
        "api":new PlurkApi({
            act:"Timeline/getPlurk",
            arg:{
                plurk_id:PlurkId("onburz"),
            },
            func:function(xml){

                setTimeout(()=>{ 
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


                        var plurk_id_list = [
                            //"omkzh9",
                            //"of50t3",
                            //"no5x7f",
                            /*"noplba",
                            "npiqwi",
                            "nqdwra",
                            "o1vtlu",
                            "o5oq3y"
                            */ 
                        ];
                        for(var i in ALL.config.plurk[ ALL.config.plurk_id ].responses)
                        {
                            var f_data = ALL.config.plurk[ ALL.config.plurk_id ].responses[i];
                            f_data_content = JSON.parse(decodeHTML(f_data.content));
                            console.log(f_data);

                            plurk_id_list.push(f_data_content.id);

                            if(document.querySelector("#setting ul"))
                            document.querySelector("#setting ul").innerHTML += `
                                <li><a target="_blank" href="https://www.plurk.com/p/${f_data_content.url}">${f_data_content.title}</a> (<a data-setting_act="edit_plurk" id="${f_data.id}">刪除</a>)</li>
                            `;

                        }
                        plurk_id_list.map(a=>{return PlurkId(a);});
                        console.log(plurk_id_list);

                        var total_sec = plurk_id_list.length * 1 * 1000;
                        var progress = 0;
                        var p = ALL.obj.block.querySelector("div");
                        console.log(total_sec);

                        var _t = setInterval(()=>{
                            p.style.background = `linear-gradient(to right,#0f0 ${progress+=1}%,#fff 0%)`;
                            p.innerText = `${progress}%`;
                                                    
                            if(progress>=100)
                            {
                                clearInterval(_t);
                                LoadingBlock();
                            }
                        },(total_sec/100));
                        
                        ALL.timer.time1 = new Date().getTime();
                        ApiGetList( plurk_id_list );
                    }
                    ALL.config.api.Send();

                },100);
            }
        }),
        "plurk":{}
    }

}
window.onload = function(){
    
    ALL.api = ALL.api||new PlurkApi();

    ALL.config.api.Send();



    ALL.obj.block = document.querySelector("#block");
    if(ALL.obj.block===null)
    {
        ALL.obj.block = document.createElement("div");
        ALL.obj.block.id = "block";
        ALL.obj.block.style.display = "block";

        var progress = document.createElement("div");
        progress.style.background = "linear-gradient(to right,#0f0 0%,#fff 0%";
        ALL.obj.block.appendChild(progress);

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
            ALL.obj.menu.querySelector("#detail_search input[type=text]").value = e.target.dataset.search;
            Search( e.target.dataset.search , "" );
        }

        if(e.target.dataset.detail_search)
        {
            Search( ALL.obj.menu.querySelector("#detail_search input[type=text]").value , "" );
        }

        if(e.target.dataset.sort)
        {
            Search( ALL.obj.menu.querySelector("#detail_search input[type=text]").value , e.target.dataset.sort );

            if(e.target.dataset.sort.indexOf("desc")===-1)
            {
                e.target.dataset.sort += " desc";
                e.target.value = e.target.value.replace("↑","↓");
            }
            else
            {
                e.target.dataset.sort = e.target.dataset.sort.replace("desc","");
                e.target.value = e.target.value.replace("↓","↑");
            }
        }

        if(e.target.dataset.setting_act)
        {
            if(e.target.dataset.setting_act==="edit_plurk")
            {
                if(confirm(`確定要刪除[${e.target.parentElement.querySelector("a").innerHTML}]嗎`)===false) return;
                

                ALL.config.api.act = "Responses/responseDelete";
                ALL.config.api.arg.response_id = e.target.id;
                ALL.config.api.func = function(){};

                ALL.config.api.Send();
                e.target.parentElement.remove();
            }

            if(e.target.dataset.setting_act==="add_plurk")
            {
                var plurk_id = prompt("輸入噗浪網址");
                var title = prompt("輸入標題");
                
                if(plurk_id===null || title===null || plurk_id==="" || title==="") return;

                plurk_id = plurk_id.split("/").pop();


                ALL.config.api.act = "Responses/responseAdd";
                ALL.config.api.arg.content = `
                {"title":"${title}","url":"${plurk_id}","type":"plurk","id":"${PlurkId(plurk_id)}"}
                `;
                ALL.config.api.func = function(xml)
                {
                    var r = JSON.parse(xml.response);
                }

                ALL.config.api.Send();
            }
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

        var list = document.querySelectorAll("#main>div>div:not([class=''])[hide]");


        if(window.innerHeight+window.scrollY>=document.body.scrollHeight)
        {
            var show_count = Math.floor(document.querySelector("#main").offsetWidth / (document.querySelector("#main>div>div:not([hide])").offsetWidth));
            for(var i=0;i<show_count;i++)
            {
                if(list[i]) list[i].removeAttribute("hide");
            }
        }


    });


    


    
    

    MenuCr("MENU",ALL.obj.menu);
}

var x = 0;
function ApiGetList(plurk_id)
{
    if(x>99 || plurk_id.length===0)
    {
        LoadingBlock();
        return;
    }

    var plurk = {};

    ALL.api.arg.plurk_id = plurk_id.pop();
    ALL.api.act = "Timeline/getPlurk";
    ALL.api.func = function(xml){

        setTimeout( ()=>{ 

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

            ALL.plurk[ plurk.plurk.plurk_id ].api.Send(); 

        },500);
    }
    ALL.api.Send();


    if(plurk_id.length>0)
    {
        setTimeout( ()=>{ApiGetList(plurk_id)},1000 );
    }
    else
    {
        console.log("END");
        ALL.timer.time2 = new Date().getTime();
        ALL.timer.time3 = ALL.timer.time2 - ALL.timer.time1;
        //setTimeout( ()=>{LoadingBlock();},1000 );
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
            btn.setAttribute("title",menu[key].join(" "));
            btn.dataset.search = key+" "+menu[key].join(" ");
        }
        else
        {
            btn.dataset.menu = path+"."+key;
        }

        if( obj.querySelector(`[value="${key}"]`) ) continue;

        div.appendChild(btn);
        obj.appendChild(div);        
    }

    if(ALL.obj.menu.querySelector("#detail_search")===null)
    {

        obj.innerHTML += `
        <div id="detail_search">
            關鍵字搜尋<br>
            <select>
            <option value="">搜尋類型</option>
            <option value="youtu">youtube</option>
            <option value="nhentai">nhentai</option>
            </select>
            <input type="text">
            <input type="button" value="搜尋" data-detail_search="true">
        </div>
        `;


        obj.innerHTML += `
        <div id="sort_search">
            排序<br>
            <input type="button" value="日期 ↑" data-sort="posted">
        </div>
        `;

        if(location.hash==="#shrimp" || location.protocol==="file:")
        obj.innerHTML += `
        <div id="setting">
            設定<br>
            <input type="button" value="新增" data-setting_act="add_plurk">
            <ul></ul>
        </div>
        `;

        

    }


}



function Search(keyword,sort)
{
    var search_result = {};
    for(var id in ALL.plurk)
    {
        for(var r_id in ALL.plurk[id].responses)
        for(var key in keyword.split(" "))
        {
            var str = keyword.split(" ")[key];
            if(str==="") continue;

            var f_data = ALL.plurk[id].responses[r_id];

            if(f_data.user_id!==ALL.plurk[id].plurk.owner_id) continue;

            if(f_data.content.toLocaleLowerCase().indexOf(str.toLocaleLowerCase())!==-1 && 
            f_data.content.toLocaleLowerCase().indexOf(document.querySelector("#detail_search select").value)!==-1 )
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

    search_result = JsonToList(search_result,sort);

    console.log(search_result);

    var div = document.createElement("div");
    
    for(var id in search_result)
    {
        var f_data = search_result[ id ];

        var list = document.createElement("div");
        list.id = f_data.id;
        list.dataset.plurk_id = f_data.plurk_id;

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
            if(document.querySelector("#detail_search select").value==="nh")
                list.setAttribute("hide","");

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
            if(document.querySelector("#detail_search select").value==="yt")
                list.setAttribute("hide","");

            var url = list.querySelectorAll("a:not([class*=pictureservices])");
            var img = list.querySelectorAll("a[class*=pictureservices]");
            var date = list.querySelector("date").innerHTML;
            var plurk_id = parseInt(list.dataset.plurk_id).toString(36);

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
        document.body.style.background = "#aaa";
        ALL.obj.block.style.opacity = "0";
        setTimeout(()=>{
            ALL.obj.block.style.display = "none";
        },1000);
    }
    else
    {
        
        ALL.obj.block.style.display = "block";
        setTimeout(()=>{
            ALL.obj.block.style.opacity = "1";
        },0);
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


function JsonToList(json,sort)
{
    var list = [];
    for(var id in json)
    {
        var i = list.length;
        list[i] = json[id];
    }

    
    list.sort((a,b)=>{

        var desc = false;
        var s = sort.toString().split(" ");
        if(s.indexOf("desc")!==-1) desc = true;

        a = a[s["0"]];
        b = b[s["0"]];

        if(s["0"]==="posted")
        {
            a = new Date(a).getTime();
            b = new Date(b).getTime();
        }

        if(desc)
            return a - b;
        else
            return b - a;
    });

    return list;
}

function decodeHTML(html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};