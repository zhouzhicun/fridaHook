


var flag = 0

function hook_dlopen() {
    var interceptor = Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    console.log("[LOAD]", path)
                    if (path.indexOf("libxloader.so") > -1){
                        flag = 1
                        hook_dlsym_64()
                    } else {
                        flag = 0
                    }
                }
            },
            onLeave: function (retval) {
                if(flag) {
                    hook_JNI_OnLoad()
                }
              
                Thread.sleep(1);
            }
        }
    )
    return interceptor
}


function hook_JNI_OnLoad() {
    console.log('------');
    let base_addr = Module.findBaseAddress("libxloader.so");
    Interceptor.attach(base_addr.add(0x42614), {
        onEnter: function(args) {
            console.log('----------------------------------');
        }, onLeave: function(retval) {
            console.log(`onLeave JNI_OnLoad ${retval}`);
            retval.replace(0x00010006);
        }
    });
}



// function hook_dlsym_x86() {
//     var count = 0
//     console.log("=== HOOKING dlsym ===")
//     var interceptor = Interceptor.attach(Module.findExportByName(null, "dlsym"),
//         {
//             onEnter: function (args) {
//                 const name = ptr(args[1]).readCString()
//                 console.log("[dlsym]", name)
//                 if (name == "pthread_create") {
//                     count++
//                 }
//             },
//             onLeave: function(retval) {
//                 if (count == 1) {
//                     retval.replace(fake_pthread_create)
//                 }
//                 else if (count == 2) {
//                     retval.replace(fake_pthread_create)
//                     // 完成2次替换, 停止hook dlsym
//                     interceptor.detach()
//                 }
//             }
//         }
//     )
//     return Interceptor
// }



function hook_dlsym_64() {
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
                retval.replace(fake_pthread_create)
                if (count >= 4) {
                    interceptor.detach()
                }

                
            }
        }
    )
    return Interceptor
}


function create_fake_pthread_create() {
    const fake_pthread_create = Memory.alloc(4096)
    Memory.protect(fake_pthread_create, 4096, "rwx")
    Memory.patchCode(fake_pthread_create, 4096, code => {
        const cw = new Arm64Writer(code, { pc: ptr(fake_pthread_create) })
        cw.putRet()
    })
    return fake_pthread_create
}

// 创建虚假pthread_create
var fake_pthread_create = create_fake_pthread_create()


hook_dlopen()

