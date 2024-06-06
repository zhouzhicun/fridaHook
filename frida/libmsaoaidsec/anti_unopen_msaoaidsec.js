

/**

参考文档：https://bbs.kanxue.com/thread-281634.htm
原理：
hook dlopen函数，当加载libmsaoaidsec.so时，将其路径置为空，即不加载该so库。

通杀使用libmsaoaidsec.so防护的所有App, 包括：
哔哩哔哩  tv.danmaku.bili
小红书    com.xingin.xhs
爱奇艺    com.qiyi.video
安居客    com.anjuke.android.app
携程旅行  ctrip.android.view

 */


function hook_dlopen(soName = '') {

    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"), {
        onEnter: function (args) {
            var pathptr = args[0];
            if (pathptr !== undefined && pathptr != null) {

                var path = ptr(pathptr).readCString();
                console.log('path: ',path)
                if(path.indexOf('libmsaoaidsec.so') >= 0){
                    ptr(pathptr).writeUtf8String("");
                }
                
            }
        }
    });
}

hook_dlopen()


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


function main() {
    hook_activity()
}

main()

