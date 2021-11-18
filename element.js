
window.onload = function(){

    for(var k in System.PlurkApiAct)
    {
        var opt = document.createElement("option");
        opt.value = k;
        opt.text = System.PlurkApiAct[k];
        document.querySelector("#act").appendChild(opt);
    }



    document.querySelector("#submit").addEventListener("click",ApiSend)
}


function ApiSend(){

    var act = document.querySelector("#act").value;
    var keyword = document.querySelector("#keyword").value;

    if( typeof(eval(`${act}`))==="function" )
    {
        eval(`${act}("","${keyword}")`);
    }
    else
    {
        console.log("not function")
    }

}