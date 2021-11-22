var ALL = {
    "MENU":{
        "HOLO":{
            "JP":{
                "1期生":{
                    "白上フブキ":["FBK","白上吹雪"],
                    "夜空メル":["梅露"],
                    "夏色まつり":["夏哥"]
                },
                "兎田ぺこら":["兔","佩克拉"],
                "大神ミオ":["Mio","狼媽"],
            },
            "EN":
            {
                "Ninomae Ina'nis":["ina"]
            }
        },
        "ASMR":{
    
        }
    },
    "api":null,
    "plurk":{},
    "obj":{}

}
window.onload = function(){



    

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


    ALL.api = ALL.api||new PlurkApi();

    ApiGetList( [PlurkId("omkzh9")] );
    

    MenuCr(ALL.MENU,ALL.obj.menu);
}

var x = 0;
function ApiGetList(plurk_id)
{
    console.log(x++);
    if(x>99) return;
    
    LoadingBlock();

    var plurk = {};

    ALL.api.arg.plurk_id = plurk_id.pop();
    ALL.api.act = "Timeline/getPlurk";
    ALL.api.func = function(xml){

        plurk = JSON.parse((xml.response));
        //data = JSON.parse(data.contents);
        ALL.plurk[ plurk.plurk.plurk_id ] = plurk;
        ALL.plurk[ plurk.plurk.plurk_id ].responses = 
        ALL.plurk[ plurk.plurk.plurk_id ].responses||{};


        console.log(plurk);

        ALL.api.act = "Responses/get";
        ALL.api.func = function(xml){

            var replurk = JSON.parse((xml.response))
            
            console.log( replurk );
            
            for(var r_id in replurk.responses)
            {
                var f_data = replurk.responses[r_id];

                ALL.plurk[ f_data.plurk_id ].responses[ f_data.id ] = f_data;
            }
            

            if(plurk_id.length==0)
            {
                console.log("END");
                LoadingBlock();
            }
        }
        setTimeout( ()=>{ALL.api.Send();},100);


    }
    ALL.api.Send();


    if(plurk_id.length>0)
        setTimeout( ()=>{ApiGetList(plurk_id)},500 );
}



function MenuCr(menu,obj)
{
    for(let key in menu)
    {
        let div = document.createElement("div");
        let btn = document.createElement("input");
        btn.type = "button";
        btn.value = key;

        if( Array.isArray(menu[key]) )
        btn.setAttribute("title",menu[key].join(" , "));

        if( obj.querySelector(`[value="${key}"]`) ) continue;

        div.appendChild(btn);
        obj.appendChild(div);


        btn.addEventListener("click",function(){

            if( Array.isArray(menu[key]) )
            {
                menu[key].push(key);
                Search(menu[key]);
            }
            else
            {
                if( Object.keys(menu[key]).length>0 )
                    MenuCr(menu[key],div);
            }

        });
    }

    
}



function Search(keyword)
{
    var search_result = {};
    for(var id in ALL.plurk)
    {
        for(var r_id in ALL.plurk[id].responses)
        for(var key of keyword)
        {
            var f_data = ALL.plurk[id].responses[r_id];

            if(f_data.content.toLocaleLowerCase().indexOf(key.toLocaleLowerCase())!==-1)
            {
                search_result[ f_data.id ] = f_data;
            }
        }
    }

    console.log(search_result);

    ALL.obj.main.innerHTML = "";
    var table = document.createElement("table");
    var tr,td;
    
    for(var id in search_result)
    {
        var f_data = search_result[ id ];

        tr = document.createElement("tr");

        td = document.createElement("td");
        td.innerHTML = f_data.content;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = DateF(( f_data.posted ));
        tr.appendChild(td);



        table.appendChild(tr);

        //Append(ALL.list[id]);
    }


    ALL.obj.main.appendChild(table);
}


function Append(data)
{
    
    var div = document.createElement("div");
    div.innerHTML = data.content;
    div.id = data.id;


    ALL.obj.main.appendChild(div);
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



