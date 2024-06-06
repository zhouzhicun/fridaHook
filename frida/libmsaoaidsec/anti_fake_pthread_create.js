
/**
参考文档：https://bbs.kanxue.com/thread-281584.htm

可过frida检测，但是hook java层的函数，仍会被检测到，导致frida进程 Process terminated挂掉，
原因：
立即hook java会早于hook native，导致java层的hook函数被检测到，从而导致frida进程挂掉。
解决方案：
延迟几秒后，在Hook java层的函数。 例如 setTimeout(hook_activity, 3000)


通杀使用libmsaoaidsec.so防护的所有App, 包括：
哔哩哔哩  tv.danmaku.bili
小红书    com.xingin.xhs
爱奇艺    com.qiyi.video
安居客    com.anjuke.android.app
携程旅行  ctrip.android.view


 */


function create_fake_pthread_create() {
    const fake_pthread_create = Memory.alloc(4096)
    Memory.protect(fake_pthread_create, 4096, "rwx")
    Memory.patchCode(fake_pthread_create, 4096, code => {
        const cw = new Arm64Writer(code, { pc: ptr(fake_pthread_create) })
        cw.putRet()
    })
    return fake_pthread_create
}

function hook_dlsym() {
    var count = 0
    console.log("=== HOOKING dlsym ===")
    var interceptor = Interceptor.attach(Module.findExportByName(null, "dlsym"),
        {
            onEnter: function (args) {
                const name = ptr(args[1]).readCString()
                console.log("[dlsym]", name)
                if (name == "pthread_create") {
                    count++
                }
            },
            onLeave: function(retval) {
                if (count == 1) {
                    retval.replace(fake_pthread_create)
                }
                else if (count == 2) {
                    retval.replace(fake_pthread_create)
                    // 完成2次替换, 停止hook dlsym
                    interceptor.detach()
                }
            }
        }
    )
    return Interceptor
}

function hook_dlopen() {
    var interceptor = Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    console.log("[LOAD]", path)
                    if (path.indexOf("libmsaoaidsec.so") > -1) {
                        hook_dlsym()
                    }
                }
            }
        }
    )
    return interceptor
}

// 创建虚假pthread_create
var fake_pthread_create = create_fake_pthread_create()
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