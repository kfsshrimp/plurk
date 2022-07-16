var System = {
    //"CORS":"https://cors-anywhere.herokuapp.com/",
    //"CORS":"https://api.allorigins.win/get?url=",
    "CORS":"https://us-central1-kfs-plurk.cloudfunctions.net/corsAnyWhere?",
    "XmlAsync":false
};

function _x(){
    return [
    "PjKhvBiudHOl",
    "xdNl7fNTBMISKOCPzY1RM49mJXK8fwOG",
    "TDVM8Q8iwq6O",
    "K7TtXccPALzfCVrtohLffJOjCc63XauX"];
}



function PlurkApi( opt = {} )
{
    this.func = opt.func||function(){};
    this.arg = opt.arg||{};
    this.mode = "CORS";
    this.debug = false;

    for(var key in opt) this[key] = opt[key]||"";
    

    var api_row = [
        "content&",
        "limited_to&",
        "limit&",
        "no_comments&",
        "&plurk_id",
        "count&",
        "from_response&",
        "&response_id",
        "filter&",
        "nick_name&",
        "&offset",
        "minimal_data&",
        "minimal_user&"
    ];

    this.Send = ()=>{

        for(var key of api_row)
        {
            var word = key.split("&").filter(a=>a!=="")[0]||"";

            this.arg[word] = this.arg[word]||"";

            
            this.arg[word] = (this.arg[word]).toString();

           

            if(key.indexOf("limited_to")!==-1)
            {
                this.arg[word] = 
                (!this.arg[word])?"":word+"="+encodeURIComponent("["+this.arg[word]+"]");
            }
            else
            {
                this.arg[word] = 
                (!this.arg[word])?"":word+"="+encodeURIComponent(this.arg[word]);
            }


            if(key.substr(0,1)==="&" && !!this.arg[word]) this.arg[word] = "&"+this.arg[word];
            if(key.substr(-1,1)==="&" && !!this.arg[word]) this.arg[word] = this.arg[word]+"&";
        }
        

        switch (this.act)
        {
            case "Timeline/getPlurk":

                this.SBS = 
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0"+this.arg.plurk_id;
            break;

            case "Timeline/getPublicPlurks":

                this.SBS = 
                this.arg.limit + 
                this.arg.minimal_data +
                this.arg.minimal_user +
                this.arg.nick_name + 
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0" + 
                this.arg.offset;

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

            case "Timeline/getPlurks":
                this.SBS = 
                this.arg.filter + 
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0";
            break;

            case "Profile/getPublicProfile":

                this.SBS = 
                this.arg.nick_name +
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0";

            break;


            case "checkTime":
                this.SBS = 
                "oauth_consumer_key="+_x()[0]+"&oauth_nonce="+_nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+_time()+"&oauth_token="+_x()[2]+"&oauth_version=1.0";
            break;


            default:
            break;
        }

        /*
        System.Worker.postMessage( {
            "SBS":this.SBS,
            "act":this.act
        } );

        System.Worker.onmessage = (msg)=>{
            var xml = msg.data;
            
            console.log(xml);
            if( typeof(this.func)==="function" ) this.func(xml);

            
            for(var key in this.arg )
            {
                this.arg[key] = this.arg[key]||"";
                
                this.arg[key] = this.arg[key].split("&").filter(a=>a!=="")[0]||"";

                this.arg[key] = decodeURIComponent( this.arg[key].split("=")[1]||"" );
            }
        }
        */

        if(this.debug) console.log(this.SBS);

        XmlSend( this.SBS, this.act , this.func , this.mode);

        for(var key in this.arg )
        {
            this.arg[key] = this.arg[key]||"";
            
            this.arg[key] = this.arg[key].split("&").filter(a=>a!=="")[0]||"";

            this.arg[key] = decodeURIComponent( this.arg[key].split("=")[1]||"" );
        }

    }
}







//GET
function XmlSend(SBS,act,func,mode)
{

    var STR = "GET&";
    STR += encodeURIComponent("https://www.plurk.com/APP/"+act)+"&";
    STR += encodeURIComponent(SBS);

    var oauth_signature = encodeURIComponent( CryptoJS.HmacSHA1(STR,_x()[1] + "&" + _x()[3]).toString( CryptoJS.enc.Base64 ) );


    //Data url 順序隨意
    var url = (mode==="CORS")?System.CORS + ("app="+act+"&oauth_signature="+oauth_signature +"&"+ SBS):"https://www.plurk.com/APP/"+act+"?oauth_signature="+oauth_signature +"&"+ SBS;
    

    //for api.allorigins.win
    //var url = System.CORS + encodeURIComponent("https://www.plurk.com/APP/"+act+"?oauth_signature="+oauth_signature +"&"+ SBS);


    

    //console.log(url);

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




/*

api = new PlurkApi();
api.act = "Timeline/getPlurk";
api.mode = "no";

api.func = (r)=>{ 
    var r = JSON.parse(r.response);
    api.data = api.data||{};
    api.data[ r.plurk.plurk_id ] = r;
    console.log(r);
}
api.arg.plurk_id = parseInt('oxa347',36);
api.Send();







api = new PlurkApi();
api.act = "Timeline/getPublicPlurks";
api.mode = "no";
api.arg.nick_name = "kfsshrimp4";
api.arg.limit = "30";
api.arg.offset = "2022-7-15T21:55:34"; 
//new Date('Fri, 15 Jul 2022 05:31:26 GMT').toISOString()


api.func = (r)=>{ 
    var r = JSON.parse(r.response);
    
    console.log(r);
}
api.Send();

*/



/*

var api;

var js_a = [
    'https://kfsshrimp.github.io/sha1/core-min.js',
    'https://kfsshrimp.github.io/sha1/sha1-min.js',
    'https://kfsshrimp.github.io/sha1/hmac-min.js',
    'https://kfsshrimp.github.io/sha1/enc-base64-min.js',
    'https://kfsshrimp.github.io/plurk/api.js' 
]


for(var i in js_a){

    let j_src = js_a[i];
    setTimeout(()=>{ var js = document.createElement("script");js.src = j_src;document.head.prepend(js); },(i+1)*100);

}

setTimeout(()=>{ 
    
    api = new PlurkApi();
    api.act = "Timeline/getPlurk";
    api.mode = "no"
    api.func = (r)=>{ 
        var r = JSON.parse(r.response);
        api.data = api.data||{};
        api.data[ r.plurk.plurk_id ] = r;
    }

},js_a.length*1000);

function GetPlurk(plurk_id)
{
    api.arg.plurk_id = PlurkId(plurk_id);
    api.Send();
}

function XmlSend(SBS,act,func)
{

    var STR = "GET&";
    STR += encodeURIComponent("https://www.plurk.com/APP/"+act)+"&";
    STR += encodeURIComponent(SBS);

    var oauth_signature = encodeURIComponent( CryptoJS.HmacSHA1(STR,_x()[1] + "&" + _x()[3]).toString( CryptoJS.enc.Base64 ) );


    //Data url 順序隨意
    var url = "https://www.plurk.com/APP/"+act+"?oauth_signature="+oauth_signature +"&"+ SBS;

    //for api.allorigins.win
    //var url = System.CORS + encodeURIComponent("https://www.plurk.com/APP/"+act+"?oauth_signature="+oauth_signature +"&"+ SBS);


    //for firebase cloud function
    //var url = System.CORS + ("app="+act+"&oauth_signature="+oauth_signature +"&"+ SBS);

    //console.log(url);

    var xml;
    xml = new XMLHttpRequest();
    xml.open("GET",url, System.XmlAsync );
    xml.setRequestHeader('Content-type','application/x-www-form-urlencoded;');

    if( typeof(func)==="function" )
        xml.onreadystatechange = ()=>{ func(xml); }

    xml.send();
}





*/