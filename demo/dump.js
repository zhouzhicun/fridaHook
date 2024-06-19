

/**
参考文档：
https://www.yuque.com/lilac-2hqvv/hgwa9g/phdmpe?#%20%E3%80%8A%E5%A4%84%E7%90%86%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%8A%A0%E5%AF%86%EF%BC%88%E4%B8%80%EF%BC%89%E3%80%8B

调用 dump_memory 函数，将 hexdump 获得的数据整体拷贝到 cyberchef 中查看。
再将数据 tohex ，设置去除间隔符拷贝下来。

 */



/////////////////////////////////// dump指定so 或者指定so的导出符号  ///////////////////////////////////////

var bundleName = "com.nike.omega"
var savePath = `/data/data/${bundleName}/`


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

//dump 指定so库, 并保存到/data/data/bundleName/目录下
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


////////////////////////////////////// dump某块内存  ///////////////////////////////////////////////////


//dump 指定so库中的某块内存, 并打印到日志中
function dump_memory(soName, offset, length) {
    var base_addr = Module.findBaseAddress(soName);
    var dump_addr = base_addr.add(offset);
    console.log(hexdump(dump_addr, {length: length}));
}

dump_memory("libpdd_secure.so", 0x60000, 0x42E0)

// 回填到so库，实现patch
// import idaapi
// hex_string = "000"
//  barr = bytes.fromhex(hex_string)
// idaapi.patch_bytes(0x60000, barr)

// 删除so库中的数据, 用于重新分析
ida_bytes.del_items(startAddress, 0, endAddress)

//Reanalyse program 也可以用 API 实现，而且可以指定范围。
ida_bytes.del_items(startAddress, 0, endAddress)