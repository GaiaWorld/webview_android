


class WebSocket{
    constructor(url) {
        this.ws = piv8WebSocket.startWebSocket(url);
    }

    send(sendData){
        if( typeof(sendData) == "string" ){
            piv8WebSocket.sendMsg(this.ws, sendData, 'string');
        }else{
            var u8 = new Uint8Array(sendData)
            piv8WebSocket.sendMsg(this.ws, self.base64js.fromByteArray(u8),'bin');
        }
    }

    close(){
        piv8WebSocket.close(this.ws);
    }
    
    set onopen(cb){
        piv8WebSocket.onopen(this.ws,cb);
    }

    set onclose(cb){
        piv8WebSocket.onclose(this.ws,cb);
    }

    set onerror(cb){
        piv8WebSocket.onfail(this.ws,cb);
    }

    set onmessage(cb){
        var om = function (dic, type){
            if( type == "string" ){
                var result = {};
                result.data = dic;
                result.type = type;
                cb(result);
            }else{
                var result = {};
                result.data = base64js.toByteArray(dic).buffer;
                result.type = type;
                cb(result);
            }
        }
        piv8WebSocket.onmessage(this.ws,om);
    }

}
