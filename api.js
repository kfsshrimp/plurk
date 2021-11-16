

function _x(){
    return [
    "GZnqVRyModGx",
    "mXR7FvSsqTcJ2A2AJQABcN6yDLCvi3o1",
    "O7lP5EhW9jB1",
    "ICgzEfekzUQUzpWIB5ByAWdehbiFg0SI"];
}


//取得帳號資訊
function GetPlurkAccountInfo(user_id = "",nick_name = "")
{
    if(nick_name!="") nick_name = "nick_name="+nick_name+"&";
    if(user_id!="") user_id = "&user_id="+user_id;

    var SBS = "include_plurks=false&"+ nick_name + "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0"+user_id;//15827606

    XmlSend(SBS,"Profile/getPublicProfile");
}


//發噗 //15826094
function AddPlurk(content,limited_to,no_comments = 0)
{
    //"" 公開噗
    //"0" 好友私噗
    if(limited_to!="")
    {
        limited_to = "&limited_to="+encodeURIComponent("["+limited_to+"]");
    }

    //no_comments 關閉回應
    var SBS = "content="+encodeURIComponent(content)+limited_to+"&no_comments="+no_comments+"&oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&qualifier="+encodeURIComponent(":");

    XmlSend(SBS,"Timeline/plurkAdd");
   
}


//修改噗
function EditPlurk(content,plurk_id,no_comments = 0)
{
    if(content!="")
    {
        content = "content="+encodeURIComponent(content)+"&";
    }

    var SBS = content+"no_comments="+no_comments+"&oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&plurk_id="+plurk_id;

    XmlSend(SBS,"Timeline/plurkEdit");
}



//回噗
function RePlurk(content,plurk_id)
{
    var SBS = "content="+encodeURIComponent(content)+"&oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&plurk_id="+plurk_id+"&qualifier="+encodeURIComponent(":");

    XmlSend(SBS,"Responses/responseAdd");

}


function DelRePlurk(plurk_id,re_plurk_id)
{
    var SBS = "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&plurk_id="+plurk_id+"&response_id="+re_plurk_id;

    XmlSend(SBS,"Responses/responseDelete");

}


//ID搜尋噗
function GetPlurkId(plurk_id)
{
    var SBS = "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&plurk_id="+plurk_id;

    XmlSend(SBS,"Timeline/getPlurk");

}


//ID搜尋回噗
function GetRePlurkId(plurk_id,count = "",from_response = "")
{
    if(count!="") count = "count="+count+"&";
    if(from_response!="") from_response = "from_response="+from_response+"&";

    var SBS = count + from_response + "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&plurk_id="+plurk_id;

    XmlSend(SBS,"Responses/get");
}


//搜尋噗Polling/getPlurks
//2020-7-31T08:33:34
function GetPollingPlurk(offset = "0")
{
    var SBS = "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&offset="+offset;

    XmlSend(SBS,"Polling/getPlurks");
}


//搜尋噗Timeline/getPlurks
//2020-7-31T08:33:34
function GetTimelinePlurk(limit,filter,offset = "0")
{
    if(filter!="")
    {
        filter = "filter="+filter+"&";
    }
    if(limit!="")
    {
        limit = "limit="+limit+"&";
    }

    var SBS = filter + limit + "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&offset="+offset;


    XmlSend(SBS,"Timeline/getPlurks");

    
}


//關鍵字搜尋噗
function SearchPlurk(query)
{
    var SBS = "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&query="+encodeURIComponent(query);

    XmlSend(SBS,"PlurkSearch/search");

}


function CheckTime()
{
    var tmp;
    var SBS = "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0";

    XmlSend(SBS,"checkTime");

    //XmlData["now"];//"Mon, 03 Aug 2020 02:33:04 GMT"
    //XmlData["timestamp"];//1596421984
    XmlData["time"] = parseInt(XmlData["timestamp"]);
    XmlData["timestamp"] = parseInt(XmlData["timestamp"] + "000");
    
    tmp = new Date( XmlData["timestamp"] );

    XmlData["now_f"] = {
        "year":tmp.getFullYear(),
        "month":tmp.getMonth()+1,
        "date":tmp.getDate(),
        "h":tmp.getHours(),
        "m":tmp.getMinutes()
    }

    ToFloat(XmlData);
    
}


//POST
function XmlSend(SBS,act)
{

    
    var STR = "POST&";
    STR += encodeURIComponent("https://www.plurk.com/APP/"+act)+"&";
    STR += encodeURIComponent(SBS);

    var oauth_signature = encodeURIComponent( CryptoJS.HmacSHA1(STR,_x()[1] + "&" + _x()[3]).toString( CryptoJS.enc.Base64 ) );

    //Data url 順序隨意
    var url = "https://www.plurk.com/APP/"+act;

    var xml;
    xml = new XMLHttpRequest();
    xml.open("POST",url, System.XmlAsync);
    xml.setRequestHeader('Content-type','application/x-www-form-urlencoded;');


    xml.onreadystatechange = function()
    {
        console.log(xml);
        if(xml.readyState==4)
        {
            if(xml.response!="")
            {
                XmlData = JSON.parse(xml.response);

                ToFloat(XmlData);
            }
        }
    }

    xml.send(SBS + "&oauth_signature="+oauth_signature);
}




function _time(s = 10)
{
    return new Date().getTime().toString().substr(0,s);
}

function _nonce()
{
    return new Date().getTime().toString().substr(-8);
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shuffleJSON(json) {
    var ary = [];
    
    for(key in json)
    {
        var tmp = {};
        tmp[key] = json[key];
        ary.push(  tmp );
    }
    shuffle(ary);

    var new_json = {};
    for(key in ary)
    {
        for(key2 in ary[key])
            new_json[key2] = ary[key][key2];
    }
    return new_json;
}



function PlurkId(input)
{
    return (isNaN(parseInt(input))) ? parseInt(input,36) : parseInt(input);
}




function JsonArray(data,idex = "__idx" )
{
    var _return;

    if( Array.isArray(data)===false )
    {
        _return = [];
        for(key in data)
        {
            data[key][idex] = key;
            _return.push(data[key]);
        }
    }
    else
    {
        _return = {};
        for(key in data)
        {
            var _idex = key;

            if(data[key][idex]!==undefined)
            {
                _idex = data[key][idex];
                delete data[key][idex];
            }

            delete data[key][idex];

            _return[ _idex ] = data[key];
        }
    }

    return _return;
}

function JsonSort(data,row,type = 0)
{
    var _data = JSON.parse(JSON.stringify(data));
    data = _data;

    for(key in data)
        data[key]["__sort"] = data[key][row];


    if(type==0)
    {
        data.sort( function(a,b){
            return b["__sort"] - a["__sort"];
        });
    }
    else
    {
        data.sort( function(a,b){
            return a["__sort"] - b["__sort"];
        });
    }

    for(key in data) 
        delete data[key]["__sort"];

    return data;
}




function ToFloat(obj)
{
    for(key in obj)
    {
        if( typeof(obj[key])=="object" )
        {
            ToFloat(obj[key]);
        }
        else
        {
            if( isNaN(Number(obj[key]))===false) 
            {
                obj[key] = Number(obj[key]);
            }
        }
    }

    return obj;
}


function Random(i){
    return Math.floor(Math.random()*i)+1;
}


function DateF(date)
{
    var _d = new Date(date);
    var _w = "";

    
    
    _w = _d.getFullYear() + "/" + parseInt(_d.getMonth()+1) + "/" + _d.getDate() + " " + _d.getHours() + ":" + _d.getMinutes() + ":" + _d.getSeconds();

    return _w;
}
