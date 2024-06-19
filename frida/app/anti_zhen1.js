


function hook_dlsym() {

    var pass = false
    console.log("=== HOOKING dlsym ===")
    var interceptor = Interceptor.attach(Module.findExportByName(null, "dlsym"),
        {
            onEnter: function (args) {
                this.frida = false
                const name = ptr(args[1]).readCString()
                console.log("[dlsym] =>", name)
                if (name == "pthread_create") {
                    if(pass == false) {
                        pass = true
                        bypass()
                    }
                    
                    this.frida = true
                }
            },
            onLeave: function(retval) {
                console.log("addr: ", retval)
                // if(this.frida) {
                //     hook_thread_create(retval)
                // }

            }
        }
    )
    return interceptor
}


function hook_strchr() {

    var pass = false
    console.log("=== HOOKING strchr ===")
    var interceptor = Interceptor.attach(Module.findExportByName(null, "strchr"),
        {
            onEnter: function (args) {
                if(!pass) {
                    pass = true
                    bypass()

                }
            },
            onLeave: function(retval) {

            }
        }
    )
    return interceptor
}





function hook_libc() {
    Interceptor.attach(Module.findExportByName(null, "strstr"),{
        onEnter: function(args){
            this.frida = false;
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();      
            if(str1.indexOf("frida")!==-1  || str2.indexOf("frida")!==-1 ||
              str1.indexOf("gum-js-loop")!==-1 || str2.indexOf("gum-js-loop")!==-1 ||
              str1.indexOf("gmain")!==-1 || str2.indexOf("gmain")!==-1 ||
              str1.indexOf("linjector")!==-1  || str2.indexOf("linjector")!==-1 ||
              str1.indexOf("/data/local/tmp")!==-1  || str2.indexOf("/data/local/tmp")!==-1 ||
              str1.indexOf("pool-frida")!==-1  || str2.indexOf("pool-frida")!==-1 ||
              str1.indexOf("frida_agent_main")!==-1  || str2.indexOf("frida_agent_main")!==-1 ||
              str1.indexOf("re.frida.server")!==-1  || str2.indexOf("re.frida.server")!==-1 ||
              str1.indexOf("frida-agent")!==-1  || str2.indexOf("frida-agent")!==-1 ||
              str1.indexOf("pool-spawner")!==-1  || str2.indexOf("pool-spawner")!==-1 ||
              str1.indexOf("frida-agent-64.so")!==-1  || str2.indexOf("frida-agent-64.so")!==-1 ||
              str1.indexOf("frida-agent-32.so")!==-1  || str2.indexOf("frida-agent-32.so")!==-1 ||
              str1.indexOf("frida-helper-32.so")!==-1  || str2.indexOf("frida-helper-32.so")!==-1 ||
              str1.indexOf("frida-helper-64.so")!==-1  || str2.indexOf("frida-helper-64.so")!==-1  ||
              str1.indexOf("/sbin/.magisk")!==-1  || str2.indexOf("/sbin/.magisk")!==-1  ||
              str1.indexOf("libriru")!==-1  || str2.indexOf("libriru")!==-1  ||
              str1.indexOf("magisk")!==-1  || str2.indexOf("magisk")!==-1  
                                             
              ){          
                this.frida = true;
                console.log("strstr : ",str1, " <--> ", str2);
                printNativeStack(this.context, true);
            }

        },
        onLeave: function(retval){
            if (this.frida) {
                retval.replace(ptr("0x0"));
            }
        }
    });
}

function printNativeStack(context, accurated) {
    if (accurated) {
        console.log('called from:\\n' + Thread.backtrace(context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\\n') + '\\n');
    } else {
        console.log('called from:\\n' + Thread.backtrace(context, Backtracer.FUZZY).map(DebugSymbol.fromAddress).join('\\n') + '\\n');
    }
}


function hook_thread_create(addr) {
    console.log(`thread_create_func_addr: ${addr}`)
    var interceptor = Interceptor.attach(addr, {
        onEnter: function (args) {
            var funcptr = args[2];
            var base = Process.findModuleByName("libxloader.so").base;
            console.log(`funcptr: ${funcptr}, base: ${base}, offset: ${funcptr.sub(base)}`)
            //printNativeStack(this.context, true);
            nop64(funcptr)
        }
    })
    return interceptor
}




function patch64(addr) {
    Memory.patchCode(ptr(addr), 4, code => {
        const cw = new Arm64Writer(code, { pc: ptr(addr) });
        cw.putRet();
        cw.flush();
    });
}

function bypass() {
    var base = Process.findModuleByName("libxloader.so").base
    console.log("libxloader base = ", base)
     patch64(base.add(0x64d10))
     patch64(base.add(0x59B78))
     patch64(base.add(0x60FE0))
     patch64(base.add(0x5E0A4))

    //patch64(base.add(0x61284))
    

}



function hook_dlopen() {
    var interceptor = Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {

                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    console.log("[LOAD]", path)
                    if (path.indexOf("libxloader.so") > -1) {
                        //hook_dlsym()

                        hook_strchr()
                        this.frida = true
                        hook_libc()
                    }
                }
            },
            onLeave: function (retval) {
                
            }
        }
    )
    return interceptor
}


hook_dlopen()

