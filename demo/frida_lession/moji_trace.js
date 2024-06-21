

/**
 * frida -U -f com.moji.mjweather -l moji_trace.js
 */


console.log("===== Frida Stalker hook for arm64 nativeEncodeParams =====");


function trace_nativeEncodeParams() {


    //java_class: com.moji.mjweather.library.Digest name: nativeEncodeParams  libencrypt.so!0x3d1a0 


    var func_startAddr = 0x3d1a0;
    var func_endAddr = 0x3D3A8;
    console.log("func_startAddr= " + func_startAddr + ", " + " func_endAddr = " + func_endAddr);

    const moduleName = "libencrypt.so";
    const moduleBaseAddress = Module.findBaseAddress(moduleName);
    console.log("moduleName=" + moduleName + ", moduleBaseAddress=" + moduleBaseAddress);


    const funcRealStartAddr = moduleBaseAddress.add(func_startAddr);
    const funcRealEndAddr = moduleBaseAddress.add(func_endAddr);
    console.log("funcRealStartAddr=" + funcRealStartAddr + ", funcRealEndAddr=" + funcRealEndAddr);

    var curTid = null;
    Interceptor.attach(funcRealStartAddr, {
        onEnter: function (args) {
            //var arg2 = args[2]

            //打印字符串参数
            var String_java = Java.use('java.lang.String');
            var args_4 = Java.cast(args[2], String_java);
            console.log("args[2] value: " + args_4);

    

            this.pid = Process.getCurrentThreadId();
            Stalker.follow(this.pid, {
                events: {
                    call: false, // CALL instructions: yes please            
                    ret: false, // RET instructions
                    exec: false, // all instructions: not recommended as it's
                    block: false, // block executed: coarse execution trace
                    compile: false // block compiled: useful for coverage
                },

                // onReceive: Called with `events` containing a binary blob comprised of one or more GumEvent structs. See `gumevent.h` for details about the format. Use `Stalker.parse()` to examine the data.
                onReceive(events) {

                },

                //transform: (iterator: StalkerArm64Iterator) => {
                transform: function (iterator) {

                    //iterator 对应一个基本块。基本块是一组连续的指令，没有分支。

                    var instruction = iterator.next();
                    const inst_addr = instruction.address;
                    //console.log(instruction.address.sub(moduleBaseAddress) + "\t:\t" + instruction);

                    //判断当前指令是不是原函数内的指令
                    var isModule = inst_addr.compare(funcRealStartAddr) >= 0 && inst_addr.compare(funcRealEndAddr) < 0;

                    //遍历执行该基本块的所有指令
                    do {
                        if (isModule) {
                            console.log(instruction.address.sub(moduleBaseAddress) + "\t:\t" + instruction);
                            //console.log(instruction.mnemonic + " " + instruction.opStr)
                        }
                        iterator.keep();
                    } while ((instruction = iterator.next()) !== null);

                }
            });

        },
        onLeave: function (retval) {
            Stalker.unfollow(this.pid);
            console.log("retval:"+retval);
            console.log("leave tatgetAddr====================================================================");
        }
    });
}


setTimeout(trace_nativeEncodeParams, 1000);

