
/**
 * 参考代码：https://github.com/tcc0lin/SecCase/blob/main/libJDMobileSec.js
 * 可过京东App的frida防护：libJDMobileSec.so
 */

function hook_dlopen(soName = '') {
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    if (path.indexOf(soName) >= 0) {
                        this.is_can_hook = true;
                    }
                }
            },
            onLeave: function (retval) {
                if (this.is_can_hook) {
                    hook_JNI_OnLoad()
                }
            }
        }
    );
}
 
function hook_JNI_OnLoad(){
    let module = Process.findModuleByName("libJDMobileSec.so")
    Interceptor.attach(module.base.add(0x56BC + 1), {
        onEnter(args){
            console.log("call JNI_OnLoad")
            
            //hook_pthread_create 和 replace_str 均用于定位frida检测函数地址
            //hook_pthread_create()
            replace_str()
            
            //bypass()
            
        }
    })
}

//通过hook pthread_create定位线程函数地址: 定位失败
function hook_pthread_create(){
    var base = Process.findModuleByName("libJDMobileSec.so").base
    console.log("libJDMobileSec.so --- " + base)
    Interceptor.attach(Module.findExportByName("libc.so", "pthread_create"),{
        onEnter(args){
            let func_addr = args[2]
            console.log("The thread function address is " + func_addr + " offset:" + (func_addr-base).toString(16))
        }
    })
}

//通过hook strstr函数获取frida检测的堆栈，并进一步分析，从而获得检测函数地址
function replace_str() {
    var pt_strstr = Module.findExportByName("libc.so", 'strstr');
    Interceptor.attach(pt_strstr, {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            console.log("strstr-->", str1, str2);
            console.log('strstr called from:\\n' + Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\\n') + '\\n');
            // console.log('strstr called from:\\n' + Thread.backtrace(this.context, Backtracer.FUZZY).map(DebugSymbol.fromAddress).join('\\n') + '\\n');
        }
    }); 
}


function nop(addr) {

/**
为什么要putNop两次？
在这段代码中，putNop() 被调用了两次，是因为在 Thumb 指令集中，大部分的指令都是 16 位（2 字节）的。
而 Memory.patchCode(ptr(addr), 4, code => {...}) 这行代码中的 4 表示我们要修改 4 字节（32位）的内存空间。
因此，为了填充整个 4 字节的空间，我们需要插入两个 NOP 指令。因为每个 NOP 指令在 Thumb 指令集中占用 2 字节，所以两个 NOP 指令总共占用 4 字节。
如果只调用一次 putNop()，那么只有前 2 字节会被修改为 NOP 指令，后 2 字节的内容将保持不变，可能会导致不可预知的行为。
 */
    Memory.patchCode(ptr(addr), 4, code => {
        const cw = new ThumbWriter(code, { pc: ptr(addr) });
        cw.putNop();
        cw.putNop();
        cw.flush();
    });
}

function bypass(){
    let module = Process.findModuleByName("libJDMobileSec.so")
    nop(module.base.add(0x688A))
    nop(module.base.add(0x623A))   
    nop(module.base.add(0x634A))
}


setImmediate(hook_dlopen,"libJDMobileSec.so")








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

