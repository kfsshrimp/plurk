var System = {
    //"CORS":"https://cors-anywhere.herokuapp.com/",
    //"CORS":"https://api.allorigins.win/get?url=",
    "CORS":"https://us-central1-kfs-plurk.cloudfunctions.net/corsAnyWhere?",
    "XmlAsync":false
};

function _x(){
    return [
    "GZnqVRyModGx",
    "mXR7FvSsqTcJ2A2AJQABcN6yDLCvi3o1",
    "O7lP5EhW9jB1",
    "ICgzEfekzUQUzpWIB5ByAWdehbiFg0SI"];
}


//PlurkSearch/search 噗文內容 搜尋關鍵字


function PlurkApi( opt = {})
{
    this.func = opt.func||function(){};
    this.arg = opt.arg||{};

    for(var key in opt) this[key] = opt[key]||"";
    

    var api_row = [
        "content&","limited_to","no_comments&","&plurk_id","count&","from_response&","&response_id"
    ];

    this.Send = ()=>{

        for(var key of api_row)
        {
            var word = key.split("&").filter(a=>a!=="")[0]||"";

            this.arg[word] = this.arg[word]||"";

            
            this.arg[word] = (this.arg[word]).toString();

            this.arg[word] = 
            (!this.arg[word])?"":word+"="+encodeURIComponent(this.arg[word]);

            if(key.indexOf("limited_to")!==-1)
                this.arg[word] = 
                (!this.arg[word])?"":word+"="+encodeURIComponent("["+this.arg[word]+"]");


            if(key.substr(0,1)==="&" && !!this.arg[word]) this.arg[word] = "&"+this.arg[word];
            if(key.substr(-1,1)==="&" && !!this.arg[word]) this.arg[word] = this.arg[word]+"&";
        }

        switch (this.act)
        {
            case "Timeline/getPlurk":

                this.SBS = 
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0"+this.arg.plurk_id;
            break;

            case "Responses/get":

                this.SBS = 
                this.arg.count + 
                this.arg.from_response + 
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0"+this.arg.plurk_id;
            break;

            case "Timeline/plurkAdd":

                this.SBS = 
                this.arg.content+
                this.arg.limited_to+
                this.arg.no_comments+"oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0&qualifier="+encodeURIComponent(":");
            break;

            case "Timeline/plurkDelete":
                this.SBS = 
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0"+this.arg.plurk_id;
            break;

            case "Timeline/plurkEdit":

                this.SBS = 
                this.arg.content + 
                this.arg.no_comments+
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0"+this.arg.plurk_id;
            break;


            case "Responses/responseAdd":
                this.SBS = 
                this.arg.content + "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0"+this.arg.plurk_id+"&qualifier="+encodeURIComponent(":");
            break;

            case "Responses/responseDelete":
                this.SBS = 
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0"+this.arg.plurk_id+this.arg.response_id;
            break;


            case "checkTime":
                this.SBS = 
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0";
            break;


            default:
            break;
        }
        XmlSend( this.SBS, this.act , this.func );

        for(var key in this.arg )
        {
            this.arg[key] = this.arg[key]||"";
            
            this.arg[key] = this.arg[key].split("&").filter(a=>a!=="")[0]||"";

            this.arg[key] = decodeURIComponent( this.arg[key].split("=")[1]||"" );
        }

    }
}







//GET
function XmlSend(SBS,act,func)
{    
    var STR = "GET&";
    STR += encodeURIComponent("https://www.plurk.com/APP/"+act)+"&";
    STR += encodeURIComponent(SBS);

    var oauth_signature = encodeURIComponent( CryptoJS.HmacSHA1(STR,_x()[1] + "&" + _x()[3]).toString( CryptoJS.enc.Base64 ) );

    //Data url 順序隨意
    //var url = System.CORS + ("https://www.plurk.com/APP/"+act+"?oauth_signature="+oauth_signature +"&"+ SBS);

    //for api.allorigins.win
    //var url = System.CORS + encodeURIComponent("https://www.plurk.com/APP/"+act+"?oauth_signature="+oauth_signature +"&"+ SBS);


    //for firebase cloud function
    var url = System.CORS + ("app="+act+"&oauth_signature="+oauth_signature +"&"+ SBS);

    console.log(url);

    var xml;
    xml = new XMLHttpRequest();
    xml.open("GET",url, System.XmlAsync );
    xml.setRequestHeader('Content-type','application/x-www-form-urlencoded;');

    if( typeof(func)==="function" )
        xml.onreadystatechange = ()=>{ func(xml); }

    xml.send();
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




function PlurkId(input,)
{
    return (isNaN(parseInt(input))) ? parseInt(input,36) : parseInt(input);
}



function DateF(date)
{
    var _d = new Date(date);
    var _w = "";

    
    _w = _d.getFullYear() + "/" + parseInt(_d.getMonth()+1) + "/" + _d.getDate() + " " + _d.getHours() + ":" + _d.getMinutes() + ":" + _d.getSeconds();

    return _w;
}
