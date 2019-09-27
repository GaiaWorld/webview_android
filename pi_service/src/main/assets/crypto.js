
var crypto = {}

crypto.getRandomValues = function(typedArray){
    for(var i = 0; i < typedArray.length; i++ ){
        typedArray[i] = JSVM.getRandomValues();
    }
    return typedArray;
}


window.sendBindMessage = function(webViewName, message){
    window.sendJSCMessage(200, webViewName, message)
}

window.JSVM.postMessage = function(webViewName, message){
    window.sendJSCMessage(600, webViewName, message)
}

