/**
 * 参考文档：
 * i茅台app逆向分析frida反调试：https://blog.csdn.net/zxc979647835/article/details/130682638
 * 针对：libnesec.so
 使用libnesec.so防护的App有：i茅台，网易云音乐(以及其他网易系App)
 */

 /**
  * 下面代码已失效！！！
  */

var soName = 'libnesec.so'

var soaddr = null;
function hook_dlopen() {
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    if(path.indexOf('libmsaoaidsec.so') >= 0){
                        //ptr(pathptr).writeUtf8String("");
                    } else if (path.indexOf(soName) != -1) {
                        this.hook = true;
                        //ptr(pathptr).writeUtf8String("");
                    }
                    console.log(path);
                }
            },

            onLeave:function(ret){
                if (this.hook == true) {
                    soaddr = Module.findBaseAddress(soName);
                    console.log("soaddr: ", soaddr);
                    hook_pthread_create();
                }
            }
        }
    );
}


function printNativeStack(context, name) {
    var trace = Thread.backtrace(context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n");
   console.log(trace)
}


var func_6eb1c_replaced = false

function hook_pthread_create() {

    Interceptor.attach(Module.findExportByName("libc.so", "pthread_create"), {
        onEnter(args) {

            let func_addr = args[2]
            var offset = func_addr - soaddr; 
            console.log("The thread function address is " + func_addr + " offset:" + offset.toString(16))
    
            if (offset == 0x6eb1c && !func_6eb1c_replaced) {
                Interceptor.replace(func_addr, new NativeCallback(function(){
                    console.log("0x6eb1c replaces");
                },'void',[]));
          
            }
        }
    })
}


hook_dlopen()




function hook_activity() {
    Java.perform(function () {
        var Activity = Java.use("android.app.Activity");

        Activity.onCreate.overload('android.os.Bundle').implementation = function (bundle) {
            console.log("Activity.onCreate() called ==>" + this.getClass().getName());
            this.onCreate(bundle);
        };

        Activity.onStart.implementation = function () {
            console.log("Activity.onStart() called ==>" + this.getClass().getName());
            this.onStart();
        };

        Activity.onResume.implementation = function () {
            console.log("Activity.onResume() called ==>" + this.getClass().getName());
            this.onResume();
        };

        Activity.onPause.implementation = function () {
            console.log("Activity.onPause() called ==>" + this.getClass().getName());
            this.onPause();
        };

        Activity.onStop.implementation = function () {
            console.log("Activity.onStop() called ==>" + this.getClass().getName());
            this.onStop();
        };

        Activity.onDestroy.implementation = function () {
            console.log("Activity.onDestroy() called ==>" + this.getClass().getName());
            this.onDestroy();
        };

        Activity.onRestart.implementation = function () {
            console.log("Activity.onRestart() called ==>" + this.getClass().getName());
            this.onRestart();
        };
    });
}


setTimeout(hook_activity, 3000)



