/**
 * 参考文档：https://bbs.kanxue.com/thread-277034.htm
 * 针对：libmsaoaidsec.so
 */

function hook_dlopen(soName = '') {
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    if (path.indexOf(soName) >= 0) {
                        locate_init()
                    }
                }
            }
        }
    );
}

function locate_init() {
    let secmodule = null
    Interceptor.attach(Module.findExportByName(null, "__system_property_get"),
        {
            // _system_property_get("ro.build.version.sdk", v1);
            onEnter: function (args) {
                secmodule = Process.findModuleByName("libmsaoaidsec.so")
                var name = args[0];
                if (name !== undefined && name != null) {
                    name = ptr(name).readCString();
                    if (name.indexOf("ro.build.version.sdk") >= 0) {
                        // 这是.init_proc刚开始执行的地方，是一个比较早的时机点
                        // do something
                        //hook_pthread_create()
                        bypass()
                    }
                }
            }
        }
    );
}

function hook_pthread_create() {
    var base_addr = Process.findModuleByName("libmsaoaidsec.so").base;
    console.log("libmsaoaidsec.so --- " + base_addr)
    Interceptor.attach(Module.findExportByName("libc.so", "pthread_create"), {
        onEnter(args) {
            let func_addr = args[2]
            console.log("The thread function address is " + func_addr + ` [${func_addr.sub(base_addr)}]`)
        }
    })
}

function nop(addr) {

    Memory.patchCode(ptr(addr), 4, code => {
        const cw = new ThumbWriter(code, { pc: ptr(addr) });
        cw.putNop();
        cw.putNop();
        cw.flush();
    });

}


function nop64(addr) {

    Memory.patchCode(ptr(addr), 4, code => {
        const cw = new Arm64Writer(code, { pc: ptr(addr) });
        cw.putNop();   //只需执行一次putNop()即可，评论区有人说执行4次，这是错误的。
        cw.flush();
    });
}


function bypass() {

    let module = Process.findModuleByName("libmsaoaidsec.so")
   
    // nop(module.base.add(0x10AE4))
    // nop(module.base.add(0x113F8))

    
    // 64位：
    // libmsaoaidsec.so --- 0x7401b53000
    // The thread function address is 0x751d86e2bc [0x11bd1b2bc]
    // The thread function address is 0x751d86e2bc [0x11bd1b2bc]
    // The thread function address is 0x7401b6f544 [0x1c544]
    // The thread function address is 0x7401b6e8d4 [0x1b8d4]
    // The thread function address is 0x7401b79e5c [0x26e5c]


    // 注意：
    // 下面NOP的这三个地址是调用pthread_create函数创建线程时的那条指令的地址，而不是那个函数的基地址，例如：
    // LOAD:000000000001D2F0     ADRP            X2, #loc_1C544@PAGE
    // LOAD:000000000001D2F4     ADD             X2, X2, #loc_1C544@PAGEOFF
    // LOAD:000000000001D2F8     MOV             X0, SP
    // LOAD:000000000001D2FC     MOV             X1, XZR
    // LOAD:000000000001D300     MOV             X3, X21
    // LOAD:000000000001D304     BLR             X19               <------  该地址才是我们要nop的地址

    nop64(module.base.add(0x1D304))
    nop64(module.base.add(0x1BE58))
    nop64(module.base.add(0x27718))

}


setImmediate(hook_dlopen, "libmsaoaidsec.so")



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

