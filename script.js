var ALL = {
    "MENU":{
        "HOLO":{
            "JP":{
                "友人A":["A醬","えーちゃん"],
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
                    "不知火フレア":["不知火","フレア"],
                    "白銀ノエル":["團長"],
                    "宝鐘マリン":["船長"],
                    "潤羽るしあ":["露西亞","潤羽","るしあ"]
                },
                "4期生":{
                    "天音かなた":["天音","猩","かなた","天使"],
                    "桐生ココ":["會長","可可"],
                    "角巻わため":["羊"],
                    "常闇トワ":["TOWA","TMT"],
                    "姫森ルーナ":["LUNA","露娜","公主"]
                },
                "5期生":{
                    "雪花ラミィ":["雪","拉米","菈米"],
                    "桃鈴ねね":["捏捏"],
                    "獅白ぼたん":["446","獅"],
                    "尾丸ポルカ":["座長","尾丸"]
                },
                "6期生":{
                    "ラプラス・ダークネス":["總帥","山田"],
                    "鷹嶺ルイ":["rui","鷹"],
                    "博衣こより":["博衣"],
                    "沙花叉クロヱ":["虎鯨","沙花叉"],
                    "風真いろは":["狗扎魯","風真"]
                },
            },
            "EN":{
                "1期生":{
                    "森カリオペ":["cali","Mori Calliope"],
                    "小鳥遊キアラ":["Kiara","Takanashi Kiara"],
                    "一伊那尓栖":["ina","Ninomae Ina'nis"],
                    "がうる・ぐら":["gura","Gawr Gura"],
                    "ワトソン・アメリア":["Watson Amelia","ame"]
                },
                "2期生":{
                    "九十九佐命":["sana","Tsukumo Sana"],
                    "セレス・ファウナ":["fauna","Ceres Fauna"],
                    "オーロ・クロニー":["kronii","Ouro Kronii"],
                    "七詩ムメイ":["七詩","mumei","Nanashi Mumei"],
                    "ハコス・ベールズ":["鼠","Hakos Baelz"]
                },
                "IRyS":[]
            },
            "ID":{
                "1期生":{
                    "Ayunda Risu":[],
                    "Moona Hoshinova":[],
                    "Airani Iofifteen":["iofi"]
                },
                "2期生":{
                    "Kureiji Ollie":[],
                    "Anya Melfissa":[],
                    "Pavolia Reine":[]
                }
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
        "api":null,
        "plurk":{}
    },
    "localStorage":{},
    "sessionStorage":{}
}

ALL.localStorage = JSON.parse(localStorage.kfs_plurk||`{}`);
ALL.sessionStorage = JSON.parse(sessionStorage.kfs_plurk||`{}`);



ALL.worker = new Worker("worker_xml.js");


ALL.worker.onmessage = (msg)=>{
    
    var mode = msg.data.mode;
    console.log(`mode:${mode}`)

    if(mode==="config")
    {
        ALL.config.plurk = msg.data.r;

        ALL.config.plurk[ ALL.config.plurk_id ].plurk.value = JSON.parse(
            unescape(ALL.config.plurk[ ALL.config.plurk_id ].plurk.content_raw.replaceAll("\n","").trim())
        );

        for(var i in ALL.config.plurk[ ALL.config.plurk_id ].responses)
        {
            var f_data = ALL.config.plurk[ ALL.config.plurk_id ].responses[i];
            f_data_content = JSON.parse(
                
                unescape( f_data.content_raw.replaceAll("\n","").trim())
            );

            ALL.config.plurk[ ALL.config.plurk_id ].responses[i].value = f_data_content;
            
            if( document.querySelector("#setting ul") )
            {
                if(f_data_content.type==="plurk")
                document.querySelector("#setting ul").innerHTML += `
                <li><a target="_blank" href="https://www.plurk.com/p/${f_data_content.url}">${f_data_content.title}</a> (<a data-setting_act="edit_plurk" id="${f_data.id}">刪除</a>)</li>`;                
            }

        }

        document.querySelector("#menu").innerHTML += `<div>瀏覽次數：<a>${ALL.config.plurk[ ALL.config.plurk_id ].plurk.value.web_count++}</a></div>`;


        ALL.config.api.act = "Timeline/plurkEdit";
        ALL.config.api.arg.content = `
        {"web_count":${ALL.config.plurk[ ALL.config.plurk_id ].plurk.value.web_count}}
        `;

        ALL.config.api.Send();

    }

    if(mode==="plurk")
    {
        ALL.plurk = msg.data.r;


        for(var k in ALL.config.plurk[ ALL.config.plurk_id ].responses)
        {
            let f_data = ALL.config.plurk[ ALL.config.plurk_id ].responses[k];
            
            if(f_data.value.type==="web_count")
            {
                ALL.config.api.act = "Responses/responseDelete";
                ALL.config.api.arg.response_id = f_data.id;
                ALL.config.api.func = function(){
        
                    setTimeout( ()=>{
                        ALL.config.api.act = "Responses/responseAdd";
                        ALL.config.api.arg.content = `
                        {"title":"網站記數器","url":"","type":"web_count","id":"","count":"${parseInt(f_data.value.count)+1}"}`;

                        ALL.config.api.func = function(xml)
                        {
                            //console.log((xml.response));
                        }
            
                        ALL.config.api.Send();

                    },100);
                };
                ALL.config.api.Send();
            }
        }
    }


    if(mode==="plurk_id_count")
    {
        var total_sec = msg.data.r.length * 1000;
        var progress = 0;
        var p = ALL.obj.block.querySelector("div");

        var _t = setInterval(()=>{
            p.style.background = `linear-gradient(to right,#0f0 ${progress+=1}%,#fff 0%)`;
            p.innerText = `${progress}%`;
                                    
            if(progress>=100)
            {
                clearInterval(_t);
                setTimeout(()=>{LoadingBlock();},500);
            }
        },(total_sec/100));
    }


};





window.onload = function(){

    ALL.config.api = new PlurkApi({
        "arg":{
            "plurk_id":ALL.config.plurk_id
        }
    });
    //ALL.config.api.Send();
    //ALL.api = new PlurkApi();


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

    ALL.obj.main = document.querySelector("#main");
    if(ALL.obj.main===null)
    {
        ALL.obj.main = document.createElement("div");
        ALL.obj.main.id = "main";
        document.body.appendChild(ALL.obj.main);
    }

    ALL.obj.top_bar = document.querySelector("#top_bar");
    if(ALL.obj.top_bar===null)
    {
        ALL.obj.top_bar = document.createElement("div");
        ALL.obj.top_bar.id = "top_bar";
        ALL.obj.top_bar.dataset.setting_act = "top";
        ALL.obj.top_bar.innerHTML = `▲`;
        document.body.appendChild(ALL.obj.top_bar);
    }

    window.addEventListener("click",(e)=>{



        if(e.target.dataset.search)
        {
            ALL.obj.menu.querySelector("#detail_search input[type=text]").value = e.target.dataset.search;
            document.querySelector("#detail_search select").value = "youtu";
            var sort_obj = document.querySelector("[data-sort]");
            Search( e.target.dataset.search ,  sort_obj.dataset.sort );
        }

        if(e.target.dataset.detail_search)
        {
            var sort_obj = document.querySelector("[data-sort]");
            Search( ALL.obj.menu.querySelector("#detail_search input[type=text]").value , sort_obj.dataset.sort );
        }

        if(e.target.dataset.tag_search)
        {
            ALL.obj.menu.querySelector("#detail_search input[type=text]").value = e.target.dataset.tag_search;
            var sort_obj = document.querySelector("[data-sort]");
            Search( e.target.dataset.tag_search , sort_obj.dataset.sort );
        }

        if(e.target.dataset.sort)
        {
            var sort_obj = e.target;
            if(e.target.dataset.sort.indexOf("desc")===-1)
            {
                sort_obj.dataset.sort = sort_obj.dataset.sort.trim();
                sort_obj.dataset.sort += " desc";
                sort_obj.value = sort_obj.value.replace("↑","↓");
            }
            else
            {
                sort_obj.dataset.sort = sort_obj.dataset.sort.replace("desc","");
                sort_obj.value = sort_obj.value.replace("↓","↑");
            }


            Search( ALL.obj.menu.querySelector("#detail_search input[type=text]").value , e.target.dataset.sort );
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
                {"title":"${title}","url":"${plurk_id}","type":"plurk","id":"${PlurkId(plurk_id)}"}`;
                ALL.config.api.func = function(xml)
                {
                    //console.log((xml.response));
                }

                ALL.config.api.Send();
            }

            if(e.target.dataset.setting_act==="top")
            {
                document.body.scrollTo(0,0);
            }

        }



        if(e.target.dataset.menu)
        {
            if(e.target.parentElement.querySelector("div")!==null)
            {
                var child = e.target.parentElement.querySelectorAll("div");
                for(var i=0;i<child.length;i++)
                {
                    (child[i].getAttribute("hide")!==null)?
                    child[i].removeAttribute("hide"):child[i].setAttribute("hide","");
                }
            }


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
            e.target.style.top = e.clientY - ALL.mousedown.offsetY + window.scrollY;
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



    var progress = 0;
    var p = ALL.obj.block.querySelector("div");
    p.innerText = `0%`;


    ALL.worker.postMessage( {
        "mode":"config",
        "config_id":ALL.config.plurk_id
    } );


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
            if(menu[key].length===0)
                btn.dataset.search = key;
            else
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
            <option value="asmr">ASMR</option>
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

    var type = document.querySelector("#detail_search select").value.toLocaleLowerCase();

    if((type==="" || type==="nhentai") && 
        ALL.sessionStorage.h_confirm!==1)
    {
        if(confirm("此搜尋條件或許會出現18X封面,確定要繼續嗎?")===false) return;

        ALL.sessionStorage.h_confirm = 1;
        sessionStorage.kfs_plurk = JSON.stringify(ALL.sessionStorage);
    }

    if(type!=="" && type!=="nhentai")
    {
        ALL.sessionStorage.h_confirm = 0;
        sessionStorage.kfs_plurk = JSON.stringify(ALL.sessionStorage);
    }
    

    for(var id in ALL.plurk)
    {
        for(var r_id in ALL.plurk[id].responses)
        for(var key in keyword.split(" "))
        {
            var str = keyword.split(" ")[key].toLocaleLowerCase();
            //if(str==="") continue;

            var f_data = ALL.plurk[id].responses[r_id];

            if(f_data.user_id!==ALL.plurk[id].plurk.owner_id) continue;

            var content = f_data.content.toLocaleLowerCase();
            content_text = DelHtmlTag(content);
            var tag = f_data.content_raw.split("\n")[0].toLocaleLowerCase();
            var tag_not = [];

            if( tag.indexOf("not")!==-1 )
            {
                tag = tag.split(" ");
                for(var i in tag)
                {
                    if(tag[i].indexOf("not")!==-1)
                    {
                        tag_not.push( tag[i].split(":")[1] )
                        tag[i] = "";
                    }
                }
                tag = tag.join(" ");
            }

            f_data.tag = (f_data.content_raw.split("\n").length>1)?tag:"";

            

            if(
                (
                    tag.indexOf(str)!==-1 || 
                    content_text.indexOf(str)!==-1
                ) && 
                    content.indexOf(type)!==-1 
                    &&
                    tag_not.indexOf(str)===-1
            )
            {
                search_result[ f_data.id ] = f_data;
            }
        }
    }

    ALL.obj.main.innerHTML = "";
    
    /*
    var table = document.createElement("table");
    var tr,td;
    */

    search_result = JsonToList(search_result,sort);

    

    



    var div = document.createElement("div");
    
    for(var id in search_result)
    {
        var f_data = search_result[ id ];

        var list = document.createElement("div");
        list.id = f_data.id;
        list.dataset.plurk_id = f_data.plurk_id;

        list.innerHTML = 
        `${f_data.content}<BR><date>${DateF(( f_data.posted ))}</date><tag>${f_data.tag}</tag>`;

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


    console.log(search_result);

    for(var idx=0;idx<div.querySelectorAll("div[id]").length;idx++)
    {
        var list = div.querySelectorAll("div[id]")[idx];

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
            var plurk_id = parseInt(list.dataset.plurk_id).toString(36);
            var tag = list.querySelector("tag").innerHTML.split(" ").map(t=>{
                return `<a data-tag_search=${t}>${t}</a>`
            }).join(" ");
            img = img.split("/");
            var yt_id = img["4"];
            img.pop();
            img.push("hqdefault.jpg");
            img = img.join("/");

            list.innerHTML = `
            <a target="_blank" href="https://www.plurk.com/p/${plurk_id}">PLURK</a>
            <tag>${tag}</tag>
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
            var tag = list.querySelector("tag").innerHTML.split(" ").map(t=>{
                return `<a data-tag_search=${t}>${t}</a>`
            }).join(" ");

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
            <tag>${tag}</tag>
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


        if(
            list.offsetTop>=window.innerHeight+window.scrollY && 
            ![/Android/i,/webOS/i,/iPhone/i,/iPad/i,/iPod/i,/BlackBerry/i,/Windows Phone/i].some((x)=>{return navigator.userAgent.match(x);})
            )
        {
            list.setAttribute("hide","");
        }
    }

    document.body.scrollTo(0,0);

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

function DelHtmlTag(str) {
    return str.replace(/<(?:.|\s)*?>/g,"");
}