importScripts("core-min.js");
importScripts("sha1-min.js");
importScripts("hmac-min.js");
importScripts("enc-base64-min.js");
importScripts("api.js");


var System = {
    "CORS":"https://us-central1-kfs-plurk.cloudfunctions.net/corsAnyWhere?",
    "XmlAsync":false,
    "config":{
        "api":{},
        "plurk":{}
    },
    "plurk":{},
    "replurk":{},
    "api":new PlurkApi()
};

function _x(){
    return [
    "PjKhvBiudHOl",
    "xdNl7fNTBMISKOCPzY1RM49mJXK8fwOG",
    "TDVM8Q8iwq6O",
    "K7TtXccPALzfCVrtohLffJOjCc63XauX"];
}




onmessage = function(msg){

    var mode = msg.data.mode;
    console.log(`mode:${mode}`)

    if(mode==="config")
    {
        var config_id = msg.data.config_id;

        System.config.api = new PlurkApi({
            act:"Timeline/getPlurk",
            arg:{
                plurk_id:config_id,
            },
            func:function(xml){

                var plurk = JSON.parse((xml.response));
                System.config.plurk[ plurk.plurk.plurk_id ] = plurk;

                setTimeout(()=>{

                    System.config.api.act = "Responses/get";
                    System.config.api.func = function(xml){
                        
                        var replurk = JSON.parse((xml.response));
                        for(var r_id in replurk.responses)
                        {
                            let f_data = replurk.responses[r_id];
                            if(f_data.user_id!==plurk.plurk.user_id) continue;

                            System.config.plurk[ f_data.plurk_id ].responses = 
                            System.config.plurk[ f_data.plurk_id ].responses||{};

                            System.config.plurk[ f_data.plurk_id ].responses[ f_data.id ] = f_data;
                        }


                        var plurk_id_list = [];
                        for(var i in System.config.plurk[ config_id ].responses)
                        {
                            var f_data = System.config.plurk[ config_id ].responses[i];
                            f_data_content = JSON.parse((
                                
                                unescape( f_data.content_raw.replaceAll("\n","").trim())
                            ));
                            
                            if(f_data_content.type==="plurk")
                            plurk_id_list.push(f_data_content.id);
                        }
                        plurk_id_list.map(a=>{return PlurkId(a);});


                        /*
                        postMessage( {
                            "mode":"plurk_id_count",
                            "r":plurk_id_list
                        } );
                        */
                        

                        //ApiGetList(plurk_id_list);


                        postMessage( {
                            "mode":mode,
                            "r":System.config.plurk
                        } );
                    }
                    System.config.api.Send();

                },1);
                
            }
        });
        System.config.api.Send();


        //postMessage(plurk_id);
        return;
    }


    /*
    var SBS = msg.data.SBS;
    var act = msg.data.act;


    var STR = "GET&";
    STR += encodeURIComponent("https://www.plurk.com/APP/"+act)+"&";
    STR += encodeURIComponent(SBS);

    var oauth_signature = encodeURIComponent( CryptoJS.HmacSHA1(STR,_x()[1] + "&" + _x()[3]).toString( CryptoJS.enc.Base64 ) );


    //for firebase cloud function
    var url = System.CORS + ("app="+act+"&oauth_signature="+oauth_signature +"&"+ SBS);

    var xml;
    xml = new XMLHttpRequest();
    xml.open("GET",url, System.XmlAsync );
    xml.setRequestHeader('Content-type','application/x-www-form-urlencoded;');

    //if( typeof(func)==="function" )
    //    xml.onreadystatechange = ()=>{ func(xml); }

    xml.onreadystatechange = ()=>{ 

        

        postMessage({
            "response":xml.response
        });
        //postMessage(xml);
    }

    xml.send();
    */


    if(mode==="get_replurk")
    {
        ApiGetRePlurk(msg.data.plurk_id)
    }
}

function ApiGetRePlurk(plurk_id)
{
    var plurk = {};
    System.api.arg.plurk_id = plurk_id;
    System.api.act = "Timeline/getPlurk";
    System.api.func = function(xml){

        plurk = JSON.parse((xml.response));
        setTimeout( ()=>{ 

            if(System.plurk[ plurk.plurk.plurk_id ]!==undefined)
            {
                postMessage( {
                    "mode":"plurk",
                    "r":System.plurk
                } );
                return; 
            }

            System.plurk[ plurk.plurk.plurk_id ] = plurk;
            System.plurk[ plurk.plurk.plurk_id ].api = new PlurkApi({
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

                        

                        System.plurk[ plurk.plurk.plurk_id ].responses = 
                        System.plurk[ plurk.plurk.plurk_id ].responses||{};
                        
                        System.plurk[ f_data.plurk_id ].responses[ f_data.id ] = f_data;
                    }

                }
            });

            System.plurk[ plurk.plurk.plurk_id ].api.Send();

            for(var k in System.plurk)
            {
                delete System.plurk[k].api;
            }

            postMessage( {
                "mode":"plurk",
                "r":System.plurk
            } );
        

        },1000);
    }
    System.api.Send();
}




var x = 0;
function ApiGetList(plurk_id)
{
    var plurk = {};

    System.api.arg.plurk_id = plurk_id.pop();
    System.api.act = "Timeline/getPlurk";
    System.api.func = function(xml){

        plurk = JSON.parse((xml.response));

        setTimeout( ()=>{ 

            if(System.plurk[ plurk.plurk.plurk_id ]!==undefined)
            {
                console.log("LOOP STOP");
                return; 
            }

            System.plurk[ plurk.plurk.plurk_id ] = plurk;
            System.plurk[ plurk.plurk.plurk_id ].api = new PlurkApi({
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

                        System.plurk[ plurk.plurk.plurk_id ].responses = 
                        System.plurk[ plurk.plurk.plurk_id ].responses||{};
                        
                        System.plurk[ f_data.plurk_id ].responses[ f_data.id ] = f_data;
                    }

                }
            });

            System.plurk[ plurk.plurk.plurk_id ].api.Send();

            
            if(plurk_id.length>0)
            {
                setTimeout(()=>{ApiGetList(plurk_id);},500);
            }
            else
            {
                for(var k in System.plurk)
                {
                    delete System.plurk[k].api;
                }

                postMessage( {
                    "mode":"plurk",
                    "r":System.plurk
                } );
            }


        },1000);
    }
    System.api.Send();
}

