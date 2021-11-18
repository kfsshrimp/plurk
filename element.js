
window.onload = function(){


    GetRePlurkId( PlurkId("of50t3"),"","",function(res,txt,url){

        var replurk = JSON.parse(res);

        for(var i in replurk.responses)
        {
            var html = replurk.responses[i].content;
            var div = document.createElement("div");
            div.innerHTML = html;

            document.body.appendChild(div);
        }
        

        for(var i in document.querySelectorAll("img"))
        {
            document.querySelectorAll("img")[i].removeAttribute("height");
        }
    });

    
}


function ApiSend(){

   

}