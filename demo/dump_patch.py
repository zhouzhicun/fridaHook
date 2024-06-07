
import ida_auto
import ida_bytes
import idautils
import idaapi

'''
dump内存:
dump 也可以使用 ADB 的 dd 命令、IDA 的动态调试、GG 修改器、GDB/LLDB 等等。
但如果不存在 Anti Frida，那么 Frida dump 就是最方便的选择。

回填使用 IDA 脚本更不是唯一选择，只需要使得 dump 下来的内容覆盖原先 data 段的物理地址范围就行。
需要注意区分物理偏移和虚拟地址，IDA 解析和展示 SO 时，采用虚拟地址（address），而处理静态文件时，需要基于实际偏移 offset 。
以 data segment 的起始地址为例，其虚拟地址和实际物理偏移并不一定相同。
1.IDA 中 patch 遵照其虚拟地址即可，因为 IDA 会替我们处理，映射到合适的物理地址上，
2.而将 SO 作为二进制文件 patch 时，需要用实际物理地址。可以使用 readelf 查看详细的节信息。

'''

#回填到so库，实现patch
hex_string = "000"
start_addr = 0x60000
barr = bytes.fromhex(hex_string)
idaapi.patch_bytes(start_addr, barr)

#删除data段的分析，并重新分析； 或者 IDA 中所作的 patch 保存回原文件，然后重新打开。
#操作如下，Edit - Patch program - Apply patches to input file，选择保存回原文件。然后重新打开 
for i in idautils.Segments():
    seg = idaapi.getseg(i)
    segName = idaapi.get_segm_name(seg)
    if "data" in segName:
        startAddress = seg.start_ea
        endAddress = seg.end_ea
        ida_bytes.del_items(startAddress, 0, endAddress)
        ida_auto.plan_and_wait(startAddress, endAddress)

