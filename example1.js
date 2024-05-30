
function hookAllMethod() {

	var packageName = 'com.zx.a.I8b7.';
	var classz = Java.enumerateLoadedClassesSync();
	for (var i = 0; i < classz.length; i++) {

	    if (classz[i].indexOf(packageName) != -1) {

	        var class_name = classz[i];
	        console.log("class_name", class_name);
	 
	        var cz = Java.use(class_name);
	        var methods = cz.class.getDeclaredMethods();
	        for (var i1 = 0; i1 < methods.length-1; i1++) {
	            
	            var classz_method_name = methods[i1].getName();
	            console.log("classz_method_name => ", class_name, classz_method_name)
	            
	            try {
	                var overloadAyy = cz[classz_method_name].overloads;
	                console.log(overloadAyy)
	                if (overloadAyy && overloadAyy.length >0 ){
	                    for (var i2 = 0; i2 < overloadAyy.length; i2++) {
	                        overloadAyy[i2].implementation = function () {
	                            
	                            var params = "";
	                            for (var j = 0; j < arguments.length; j++) {
	                                params = params + arguments[j] + " "
	                            }
	                            console.log("params", class_name, classz_method_name, params)
	                            return this[classz_method_name].apply(this, arguments);
	 
	                        };
	                    }

	                } else {

	                    cz[classz_method_name].implementation = function () {
	                        var params = "";
	                        for (var j = 0; j < arguments.length; j++) {
	                            params = params + arguments[j] + " "
	                        }
	                        console.log("params", class_name, classz_method_name, params)
	                        return cz[classz_method_name].apply(this, arguments);
	                        
	                    };
	                }
	                
	 
	            } catch (error) {
	                console.log("异常类的加载，请特殊处理", class_name, classz_method_name);
	                
	            }
	 
	        }
	 
	    }
	}
}



function hookJava() {

	//hook java方法
	Java.perform(function () {

	    var Activity = Java.use("android.app.Activity");
	    Activity.onCreate.overload('android.os.Bundle').implementation = function (bundle) {
	        console.log("Activity.onCreate() has been called!");
	        this.onCreate(bundle);
	    };


	    hookAllMethod();

	});


	//hook java类

}


// function hookSo() {

// 	//hook导出函数
// 	var soName = 'libzxprotect.so'
// 	var addr = Module.getExportByName(soName, "Java_com_xxx_MainActivity_stringFromJNI");
// 	Interceptor.attach(addr, {

// 		onEnter: function(args) {

// 		},

// 		onLeave: function(args) {

// 		}
// 	})


// 	//hook函数地址
// 	var libBaseAddr = Module.findBaseAddress(soName)
// 	var stringFromJNIFuncAddr = libBaseAddr.add(0x1234);  //其中0x1234是该方法的偏移地址，可以用IDA查看。

// 	Interceptor.attach(stringFromJNIFuncAddr, {

// 		onEnter: function(args) {

// 		},

// 		onLeave: function(args) {

// 		}

// 	})

// }


setImmediate(hookJava)



// 样本：墨迹天气，com.moji.mjweather
// so库：
// -f 包名: spawn启动; 
// -N 包名: attch启动。 
// frida -U -f com.moji.mjweather -l demo.js





