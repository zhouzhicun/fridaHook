// 样本：墨迹天气，com.moji.mjweather
// so库：
// -f 包名: spawn启动; 
// -N 包名: attch启动。 
// frida -U -f com.moji.mjweather -l hook_so.js


function hookSo() {

	var soName = 'libzxprotect.so'
    let base_addr = Module.findBaseAddress(soName);

    Interceptor.attach(base_addr.add(0xC240), {
        onEnter: function(args) {
            console.log(`onEnter Java_com_zx_a_I8b7_c3_a__ arg0:${args[0]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave Java_com_zx_a_I8b7_c3_a__ ${retval}`);
        }
    });

    Interceptor.attach(base_addr.add(0xD8AC), {
        onEnter: function(args) {
            console.log(`onEnter Java_com_zx_a_I8b7_c3_a__Landroid_content_Context_2 arg0:${args[0]}`);
        }, onLeave: function(retval) {
            console.log(`onLeave Java_com_zx_a_I8b7_c3_a__Landroid_content_Context_2 ${retval}`);
        }
    });


    //hook导出函数
	var addr = Module.getExportByName(soName, "Java_com_zx_a_I8b7_c3_a__");
	Interceptor.attach(addr, {
		onEnter: function(args) {
            console.log(`onEnter Java_com_zx_a_I8b7_c3_a__ arg0:${args[0]}`);
		}, onLeave: function(args) {
            console.log(`onLeave Java_com_zx_a_I8b7_c3_a__ ${retval}`);
		}
	});
    

}

//setImmediate(hookSo);


setImmediate(function() {
    
    //延迟5秒调用Hook方法
    setTimeout(hookSo, 5000);
});

