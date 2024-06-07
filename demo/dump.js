

/**
参考文档：
https://www.yuque.com/lilac-2hqvv/hgwa9g/phdmpe?#%20%E3%80%8A%E5%A4%84%E7%90%86%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%8A%A0%E5%AF%86%EF%BC%88%E4%B8%80%EF%BC%89%E3%80%8B

调用 dump_memory 函数，将 hexdump 获得的数据整体拷贝到 cyberchef 中查看。
再将数据 tohex ，设置去除间隔符拷贝下来。

 */


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