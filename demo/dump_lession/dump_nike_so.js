


function hookGenericNt3(){
    Java.perform(function() {
        var base_addr = Module.findBaseAddress(targetSO);
        var real_addr = base_addr.add(targetFunc);
        var obj = Java.use("java.lang.Object");
        var ByteString = Java.use("com.android.okhttp.okio.ByteString");
        var raise = new NativeFunction(Module.findExportByName("libc.so", "raise"), "int", ["int"])
        var SIGSTOP = 19
        Interceptor.attach(real_addr, {
            onEnter: function (args) {
                console.log("call GenericNt3")
                console.log("arg2:", args[2])
                console.log("arg3:", ByteString.of(Java.array('byte', Java.cast(args[3], obj))).utf8())
                // regs
                console.log(JSON.stringify(this.context))
                // symbols
                dumpSymbol("libc")
                dumpSymbol("libart")
                dumpSymbol("libandroid")
                
                // target SO
                dumpSo(targetSO)
                // wait
                Thread.sleep(10)
                // stop process
                raise(SIGSTOP)
            }
        });
    })
}



function dumpTemplate(){

    Java.perform(function() {
        var base_addr = Module.findBaseAddress(targetSO);
        var real_addr = base_addr.add(targetFunc);

        var raise = new NativeFunction(Module.findExportByName("libc.so", "raise"), "int", ["int"])
        var SIGSTOP = 19
        Interceptor.attach(real_addr, {
            onEnter: function (args) {

                console.log("打印参数~~~")

                // symbols
                dumpSymbol("libc")
                dumpSymbol("libart")
                dumpSymbol("libandroid")

                // target SO
                dumpSo(targetSO)

                // wait
                Thread.sleep(10)
                // stop process
                raise(SIGSTOP)
            }
        });
    })
}




//dump libc.so的导出函数
function dumpSymbol(soName){
    var exports = Module.enumerateExportsSync(soName + ".so");
    var file_path = savePath + soName + "_symbols.log";
    var file_handle = new File(file_path, "a+");
    for(var i = 0; i < exports.length; i++) {
        file_handle.write(exports[i].name + ": " + (exports[i].address)+"\n");
    }
    file_handle.flush();
    file_handle.close();
    console.log("[dump]:", file_path);
}

//dump 指定so库
function dumpSo(name){
    var libSO = Process.getModuleByName(name);
    var file_path = savePath + libSO.base + "_" + libSO.base.add(libSO.size) + ".bin";
    var file_handle = new File(file_path, "wb");
    if (file_handle && file_handle != null) {
        Memory.protect(ptr(libSO.base), libSO.size, 'rwx');
        var libso_buffer = ptr(libSO.base).readByteArray(libSO.size);
        file_handle.write(libso_buffer);
        file_handle.flush();
        file_handle.close();
        console.log("[dump]:", file_path);
    }
}

var bundleName = "com.nike.omega"
var savePath = `/data/data/${bundleName}/`


var targetSO = "libtiger_tally.so"
var targetFunc = 0x5c5ad
console.log("Process ID:", Process.id)

//hookGenericNt3()
//dumpTemplate()

//延迟3s执行，因为so加载没那么及时~
setTimeout(dumpTemplate, 3000)