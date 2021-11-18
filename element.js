var ALL = {
    "MENU":{
        "HOLO":{
            "兎田ぺこら":["兔","佩克拉"],
            "大神ミオ":["Mio","狼媽"],
            "Ninomae Ina'nis":["ina"]
        },
        "ASMR":{
    
        }
    },
    "api":null,
    "list":{},
    "data":{}

}
window.onload = function(){

    ALL.api = ALL.api||new PlurkApi();

    ApiGetList( [PlurkId("omkzh9"),PlurkId("om005g")] );

    


    MenuCr(ALL.MENU,document.body);
}

var x = 0;
function ApiGetList(plurk_id)
{
    console.log(x++);
    if(x>99) return;

    ALL.api.arg.plurk_id = plurk_id.pop();
    ALL.api.act = "Timeline/getPlurk";
    ALL.api.func = function(xml){
        console.log(xml);

        var data = JSON.parse((xml.response));
        data = JSON.parse(data.contents);
        ALL.data.title_plurk = data.plurk;

        console.log(data);

        ALL.api.act = "Responses/get";
        ALL.api.func = function(xml){

            var data = JSON.parse((xml.response));
            data = JSON.parse(data.contents);
            
            for(var i in data.responses)
            {
                if(ALL.data.title_plurk.owner_id===data.responses[i].user_id)
                ALL.list[ data.responses[i].id ] = data.responses[i];
            }
        }
        setTimeout( ()=>{ALL.api.Send();},100);
    }
    ALL.api.Send();


    if(plurk_id.length>0)
        setTimeout( ()=>{ApiGetList(plurk_id)},500 );
}



function MenuCr(menu,ele)
{
    for(let key in menu)
    {
        let div = document.createElement("div");
        let btn = document.createElement("input");
        btn.type = "button";
        btn.value = key;


        if( ele.querySelector(`[value="${key}"]`) ) continue;


        div.appendChild(btn);
        ele.appendChild(div);


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

    ALL.main = document.querySelector("#list");
    if(ALL.main===null)
    {
        ALL.main = document.createElement("div");
        ALL.main.id = "list";
        document.body.appendChild(ALL.main);
    }
}



function Search(keyword)
{
    var search_id = [];
    for(var id in ALL.list)
    {
        var data = ALL.list[id];

        for(var key of keyword)
        {
            if(data.content.toLocaleLowerCase().indexOf(key.toLocaleLowerCase())!==-1)
            {
                if(search_id.indexOf(data.id)===-1) search_id.push(data.id);
            }
        }
    }

    

    ALL.main.innerHTML = "";
    for(var id of search_id)
    {
        Append(ALL.list[id]);
    }
}


function Append(data)
{
    
    var div = document.createElement("div");
    div.innerHTML = data.content;
    div.id = data.id;


    ALL.main.appendChild(div);
}





