
// 样本：墨迹天气，com.moji.mjweather
// so库：
// -f 包名: spawn启动; 
// -N 包名: attch启动。 
// frida -U -f com.moji.mjweather -l example1.js


function hookJava() {

	//hook java方法
	Java.perform(function () {

		
	    var Activity = Java.use("android.app.Activity");

		//hook java重载方法
	    Activity.onCreate.overload('android.os.Bundle').implementation = function (bundle) {
	        console.log("Activity.onCreate() has been called!");
	        this.onCreate(bundle);
	    };

		//hook java方法
		Activity.onStart.implementation = function() {
			console.log("Activity.onStart() has been called!");
			this.onStart();
		}


        let r = Java.use("com.zx.a.I8b7.r");
        r["a"].overload('java.lang.String', 'java.lang.String', 'java.lang.String').implementation = function (str, str2, str3) {
            console.log(`r.a is called: str=${str}, str2=${str2}, str3=${str3}`);
            this["a"](str, str2, str3);
        };

        let c3 = Java.use("com.zx.a.I8b7.c3");
        c3["b"].overload().implementation = function () {
            console.log(`c3.b is called`);
            let result = this["b"]();
            console.log(`c3.b result=${result}`);
            return result;
        };

	});


}

setImmediate(hookJava)

