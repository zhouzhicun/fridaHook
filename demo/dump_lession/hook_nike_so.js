



function hook_java() {
    Java.perform(function () {

        let B = Java.use("com.aliyun.TigerTally.t.B");
        B["genericNt1"].implementation = function (i, str, z) {
            console.log(`B.genericNt1 is called: i=${i}, str=${str}, z=${z}`);
            let result = this["genericNt1"](i, str, z);
            console.log(`B.genericNt1 result=${result}`);
            return result;
        };

        B["genericNt2"].implementation = function (i, str) {
            console.log(`B.genericNt2 is called: i=${i}, str=${str}`);
            let result = this["genericNt2"](i, str);
            console.log(`B.genericNt2 result=${result}`);
            return result;
        };


        B["genericNt3"].implementation = function (i, bArr) {
            console.log(`B.genericNt3 is called: i=${i}, bArr=${bArr}`);
            let result = this["genericNt3"](i, bArr);
            console.log(`B.genericNt3 result=${result}`);
            return result;
        };

        B["genericNt4"].implementation = function (i, bArr) {
            console.log(`B.genericNt4 is called: i=${i}, bArr=${bArr}`);
            let result = this["genericNt4"](i, bArr);
            console.log(`B.genericNt4 result=${result}`);
            return result;
        };



        B["genericNt5"].implementation = function (str, str2) {
            console.log(`B.genericNt5 is called: str=${str}, str2=${str2}`);
            let result = this["genericNt5"](str, str2);
            console.log(`B.genericNt5 result=${result}`);
            return result;
        };


        B["genericNt6"].implementation = function (str, str2, str3) {
            console.log(`B.genericNt6 is called: str=${str}, str2=${str2}, str3=${str3}`);
            this["genericNt6"](str, str2, str3);
        };


        B["genericNt7"].implementation = function (i) {
            console.log(`B.genericNt7 is called: i=${i}`);
            let result = this["genericNt7"](i);
            console.log(`B.genericNt7 result=${result}`);
            return result;
        };


        B["genericNt8"].implementation = function () {
            console.log(`B.genericNt8 is called`);
            let result = this["genericNt8"]();
            console.log(`B.genericNt8 result=${result}`);
            return result;
        };


        B["genericNt9"].implementation = function () {
            console.log(`B.genericNt9 is called`);
            let result = this["genericNt9"]();
            console.log(`B.genericNt9 result=${result}`);
            return result;
        };
    });
}

hook_java();




///////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
genericNt1 sig: (ILjava/lang/String;Z)I fnPtr: 0xad4c1009  fnOffset: 0xad4c1009 libtiger_tally.so!0x5c009  callee: 0xad4b343b libtiger_tally.so!0x4e43b

genericNt2 sig: (ILjava/lang/String;)I fnPtr: 0xad4c150d  fnOffset: 0xad4c150d libtiger_tally.so!0x5c50d  callee: 0xad4b343b libtiger_tally.so!0x4e43b

genericNt3 sig: (I[B)Ljava/lang/String; fnPtr: 0xad4c15ad  fnOffset: 0xad4c15ad libtiger_tally.so!0x5c5ad  callee: 0xad4b343b libtiger_tally.so!0x4e43b

genericNt4 sig: (I[B)Ljava/lang/String; fnPtr: 0xad4c1649  fnOffset: 0xad4c1649 libtiger_tally.so!0x5c649  callee: 0xad4b343b libtiger_tally.so!0x4e43b

genericNt5 sig: (Ljava/lang/String;Ljava/lang/String;)I fnPtr: 0xad4c16e9  fnOffset: 0xad4c16e9 libtiger_tally.so!0x5c6e9  callee: 0xad4b343b libtiger_tally.so!0x4e43b

genericNt6 sig: (Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V fnPtr: 0xad4c178d  fnOffset: 0xad4c178d libtiger_tally.so!0x5c78d  callee: 0xad4b343b libtiger_tally.so!0x4e43b

genericNt7 sig: (I)Ljava/lang/String; fnPtr: 0xad4c1825  fnOffset: 0xad4c1825 libtiger_tally.so!0x5c825  callee: 0xad4b343b libtiger_tally.so!0x4e43b

genericNt8 sig: ()Ljava/lang/String; fnPtr: 0xad4c190d  fnOffset: 0xad4c190d libtiger_tally.so!0x5c90d  callee: 0xad4b343b libtiger_tally.so!0x4e43b

genericNt9 sig: ()I fnPtr: 0xad4b2931  fnOffset: 0xad4b2931 libtiger_tally.so!0x4d931  callee: 0xad4b343b libtiger_tally.so!0x4e43b

 * 
 * 
 */




function hook_so() {

    let base_addr = Module.findBaseAddress("libtiger_tally.so");

    Interceptor.attach(base_addr.add(0x5C009), {
        onEnter: function(args) {
            console.log(`onEnter sub_5C008 arg0:${args[0]} arg1:${args[1]} arg2:${args[2]} arg3:${args[3]} arg4:${args[4]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave sub_5C008 ${retval}`);
        }
    });

    
    Interceptor.attach(base_addr.add(0x5C50D), {
        onEnter: function(args) {
            console.log(`onEnter sub_5C50C arg0:${args[0]} arg1:${args[1]} arg2:${args[2]} arg3:${args[3]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave sub_5C50C ${retval}`);
        }
    });

    Interceptor.attach(base_addr.add(0x5C5AD), {
        onEnter: function(args) {
            console.log(`onEnter sub_5C5AC arg0:${args[0]} arg1:${args[1]} arg2:${args[2]} arg3:${args[3]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave sub_5C5AC ${retval}`);
        }
    });

    Interceptor.attach(base_addr.add(0x5C649), {
        onEnter: function(args) {
            console.log(`onEnter sub_5C648 arg0:${args[0]} arg1:${args[1]} arg2:${args[2]} arg3:${args[3]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave sub_5C648 ${retval}`);
        }
    });

    Interceptor.attach(base_addr.add(0x5C6E9), {
        onEnter: function(args) {
            console.log(`onEnter sub_5C6E8 arg0:${args[0]} arg1:${args[1]} arg2:${args[2]} arg3:${args[3]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave sub_5C6E8 ${retval}`);
        }
    });



    Interceptor.attach(base_addr.add(0x5C78D), {
        onEnter: function(args) {
            console.log(`onEnter sub_5C78C`);
        }, onLeave: function(retval) {
            console.log(`onLeave sub_5C78C ${retval}`);
        }
    });

    Interceptor.attach(base_addr.add(0x5C825), {
        onEnter: function(args) {
            console.log(`onEnter sub_5C824 arg0:${args[0]} arg1:${args[1]} arg2:${args[2]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave sub_5C824 ${retval}`);
        }
    });


    Interceptor.attach(base_addr.add(0x5C90D), {
        onEnter: function(args) {
            console.log(`onEnter sub_5C90C arg0:${args[0]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave sub_5C90C ${retval}`);
        }
    });


    Interceptor.attach(base_addr.add(0x4d931), {
        onEnter: function(args) {
            console.log(`onEnter sub_4d931 arg0:${args[0]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave sub_4d931 ${retval}`);
        }
    });
}


setTimeout(hook_so, 500);
