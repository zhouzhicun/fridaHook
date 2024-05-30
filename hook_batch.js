// 样本：墨迹天气，com.moji.mjweather
// so库：
// -f 包名: spawn启动; 
// -N 包名: attch启动。 
// frida -U -f com.moji.mjweather -l hook_batch.js
// 172.16.19.24

function hookAllMethod() {

	var packageName = 'com.zx.a.I8b7.';
	var classz = Java.enumerateLoadedClassesSync();
	for (var i = 0; i < classz.length; i++) {

	    if (classz[i].indexOf(packageName) != -1) {

	        var class_name = classz[i];
	        console.log("class_name", class_name);

			var targetClass = Java.use(class_name);

			// // 获取目标类的所有方法
			// var methods = targetClass.class.getDeclaredMethods();
			
			// //Hook每一个方法
			// for (var i = 0; i < methods.length; i++) {
			// 	var method = methods[i];
			// 	// 使用Interceptor来hook方法
			// 	targetClass[method.getName()].overload.apply(targetClass[method.getName()], method.getParameterTypes()).implementation = function () {
			// 		// 在这里添加你的hook逻辑
			// 		console.log("Hooked method: " + method.getName());
			// 		// 调用原始方法
			// 		return this[method.getName()].apply(this, arguments);
			// 	};
			// }


	 
	        // var cz = Java.use(class_name);
	        // var methods = cz.class.getDeclaredMethods();
	        // for (var i1 = 0; i1 < methods.length-1; i1++) {
	            
	        //     var classz_method_name = methods[i1].getName();
	        //     console.log("classz_method_name => ", class_name, classz_method_name)
	            
	        //     try {
	        //         var overloadAyy = cz[classz_method_name].overloads;
	        //         console.log(overloadAyy)
	        //         if (overloadAyy && overloadAyy.length >0 ){
	        //             for (var i2 = 0; i2 < overloadAyy.length; i2++) {
	        //                 overloadAyy[i2].implementation = function () {
	                            
	        //                     var params = "";
	        //                     for (var j = 0; j < arguments.length; j++) {
	        //                         params = params + arguments[j] + " "
	        //                     }
	        //                     console.log("params", class_name, classz_method_name, params)
	        //                     return overloadAyy[i2].apply(this, arguments);
	 
	        //                 };
	        //             }

	        //         } else {

	        //             cz[classz_method_name].implementation = function () {
	        //                 var params = "";
	        //                 for (var j = 0; j < arguments.length; j++) {
	        //                     params = params + arguments[j] + " "
	        //                 }
	        //                 console.log("params", class_name, classz_method_name, params)
	        //                 return cz[classz_method_name].apply(this, arguments);
	                        
	        //             };
	        //         }
	                
	 
	        //     } catch (error) {
	        //         console.log("异常类的加载，请特殊处理", class_name, classz_method_name);
	                
	        //     }
	 
	        // }
	 
	    }
	}
}



function hookJava() {

	//hook java方法
	Java.perform(function () {

		hookAllMethod();

	});
}


setImmediate(hookJava)

