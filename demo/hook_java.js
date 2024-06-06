

function hook_java() {

	//hook java方法
	Java.perform(function () {

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

//setImmediate(hook_java)




function hook_activity() {
	
	Java.perform(function () {
		var Activity = Java.use("android.app.Activity");

		Activity.onCreate.overload('android.os.Bundle').implementation = function (bundle) {
			console.log("Activity.onCreate() called ==>" + this.getClass().getName());
			this.onCreate(bundle);
		};

		Activity.onStart.implementation = function () {
			console.log("Activity.onStart() called ==>" + this.getClass().getName());
			this.onStart();
		};

		Activity.onResume.implementation = function () {
			console.log("Activity.onResume() called ==>" + this.getClass().getName());
			this.onResume();
		};

		Activity.onPause.implementation = function () {
			console.log("Activity.onPause() called ==>" + this.getClass().getName());
			this.onPause();
		};

		Activity.onStop.implementation = function () {
			console.log("Activity.onStop() called ==>" + this.getClass().getName());
			this.onStop();
		};

		Activity.onDestroy.implementation = function () {
			console.log("Activity.onDestroy() called ==>" + this.getClass().getName());
			this.onDestroy();
		};

		Activity.onRestart.implementation = function () {
			console.log("Activity.onRestart() called ==>" + this.getClass().getName());
			this.onRestart();
		};
	});
}

setImmediate(hook_activity)






