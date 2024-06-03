/**
 * 参考文档：https://blog.csdn.net/zxc979647835/article/details/130682638
 * 针对：libnesec.so
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
            //printNativeStack()

            if (offset == 0x6eb1c && !func_6eb1c_replaced) {
                
                //替换函数
                func_6eb1c_replaced = true
                bypass()
         

                // Interceptor.replace(func_addr, new NativeCallback(function(){
                //     console.log("0x6eb1c replaces");
                // },'void',[]));
          
            }
        }
    })

    // var pt_strstr = Module.findExportByName("libc.so", 'strstr');
    // var pt_strcmp = Module.findExportByName("libc.so", 'strcmp');
 
    // Interceptor.attach(pt_strstr, {
    //     onEnter: function (args) {

    //         var str1 = args[0].readCString();
    //         var str2 = args[1].readCString();

    //         if(str1.indexOf("frida") != -1 || str2.indexOf("frida") != -1) {
    //             console.log("strcmp-->", str1, str2);
    //             printNativeStack();
    //             this.hook = true;
    //         }

    //         // if (str2.indexOf("tmp") != -1 ||
    //         //     str2.indexOf("frida") != -1 ||
    //         //     str2.indexOf("gum-js-loop") != -1 ||
    //         //     str2.indexOf("gmain") != -1 ||
    //         //     str2.indexOf("gdbus") != -1 ||
    //         //     str2.indexOf("pool-frida") != -1||
    //         //     str2.indexOf("linjector") != -1) {
    //         //     console.log("strcmp-->", str1, str2);
    //         //     //printNativeStack();
    //         //     this.hook = true;
    //         // }

    //     }, onLeave: function (retval) {
    //         if (this.hook) {
    //             retval.replace(0);
    //         }
    //     }
    // });
 
    // Interceptor.attach(pt_strcmp, {
    //     onEnter: function (args) {
    //         var str1 = args[0].readCString();
    //         var str2 = args[1].readCString();

    //         if(str1.indexOf("frida") != -1 || str2.indexOf("frida") != -1) {
    //             console.log("strcmp-->", str1, str2);
    //             printNativeStack();
    //             this.hook = true;
    //         }


    //         // if (str2.indexOf("tmp") != -1 ||
    //         //     str2.indexOf("frida") != -1 ||
    //         //     str2.indexOf("gum-js-loop") != -1 ||
    //         //     str2.indexOf("gmain") != -1 ||
    //         //     str2.indexOf("gdbus") != -1 ||
    //         //     str2.indexOf("pool-frida") != -1||
    //         //     str2.indexOf("linjector") != -1) {
    //         //     console.log("strcmp-->", str1, str2);
    //         //     //printNativeStack();
    //         //     this.hook = true;
    //         // }
    //     }, onLeave: function (retval) {
    //         if (this.hook) {
    //             retval.replace(0);
    //         }
    //     }
    // })
}


hook_dlopen()




function patch64(addr) {
    Memory.patchCode(ptr(addr), 4, code => {
        const cw = new Arm64Writer(code, { pc: ptr(addr) });
        cw.putRet();
        cw.flush();
    });
}

function bypass() {
    let module = Process.findModuleByName(soName)
    patch64(module.base.add(0x6eb1c))
    // patch64(module.base.add(0x8cbbc))
    // patch64(module.base.add(0x760e8))
}


// function hook_activity() {
//     Java.perform(function () {
//         var Activity = Java.use("android.app.Activity");

//         Activity.onCreate.overload('android.os.Bundle').implementation = function (bundle) {
//             console.log("Activity.onCreate() called ==>" + this.getClass().getName());
//             this.onCreate(bundle);
//         };

//         Activity.onStart.implementation = function () {
//             console.log("Activity.onStart() called ==>" + this.getClass().getName());
//             this.onStart();
//         };

//         Activity.onResume.implementation = function () {
//             console.log("Activity.onResume() called ==>" + this.getClass().getName());
//             this.onResume();
//         };

//         Activity.onPause.implementation = function () {
//             console.log("Activity.onPause() called ==>" + this.getClass().getName());
//             this.onPause();
//         };

//         Activity.onStop.implementation = function () {
//             console.log("Activity.onStop() called ==>" + this.getClass().getName());
//             this.onStop();
//         };

//         Activity.onDestroy.implementation = function () {
//             console.log("Activity.onDestroy() called ==>" + this.getClass().getName());
//             this.onDestroy();
//         };

//         Activity.onRestart.implementation = function () {
//             console.log("Activity.onRestart() called ==>" + this.getClass().getName());
//             this.onRestart();
//         };
//     });
// }


// setTimeout(hook_activity, 10000)



