/**
 * 参考文档：https://bbs.kanxue.com/thread-281634.htm
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



function hook_Dialog() {

    Java.perform(function () {
        var Dialog = Java.use("android.app.Dialog");

        Dialog.show.implementation = function () {
            console.log("Dialog.show() called ==>" + this.getClass().getName());
            this.show();
        };

        Dialog.dismiss.implementation = function () {
            console.log("Dialog.dismiss() called ==>" + this.getClass().getName());
            this.dismiss();
        };

    });
}


function hook_fragment() {
    
    Java.perform(function () {
    
        var Fragment = Java.use("android.app.Fragment");

        //onCreateView hook有问题，暂时注释~
        // Fragment.onCreateView.overload('android.view.LayoutInflater', 'android.view.ViewGroup', 'android.os.Bundle').implementation = function (inflater, container, savedInstanceState) {
        //     console.log("Fragment.onCreateView() called ==>" + this.getClass().getName());
        //     this.onCreateView(inflater, container, savedInstanceState);
        // };

        Fragment.onStart.implementation = function () {
            console.log("Fragment.onStart() called ==>" + this.getClass().getName());
            this.onStart();
        };

        Fragment.onResume.implementation = function () {
            console.log("Fragment.onResume() called ==>" + this.getClass().getName());
            this.onResume();
        };

        Fragment.onPause.implementation = function () {
            console.log("Fragment.onPause() called ==>" + this.getClass().getName());
            this.onPause();
        };

        Fragment.onStop.implementation = function () {
            console.log("Fragment.onStop() called ==>" + this.getClass().getName());
            this.onStop();
        };

        Fragment.onDestroy.implementation = function () {
            console.log("Fragment.onDestroy() called ==>" + this.getClass().getName());
            this.onDestroy();
        };

        Fragment.onRestart.implementation = function () {
            console.log("Fragment.onRestart() called ==>" + this.getClass().getName());
            this.onRestart();
        };
    });
}



function hook_AlertDialog() {
    
    Java.perform(function () {
        var AlertDialog = Java.use("android.app.AlertDialog");

        AlertDialog.show.implementation = function () {
            console.log("AlertDialog.show() called ==>" + this.getClass().getName());
            this.show();
        };

        AlertDialog.dismiss.implementation = function () {
            console.log("AlertDialog.dismiss() called ==>" + this.getClass().getName());
            this.dismiss();
        };

    });
}


function hook_PopupWindow() {
    
    Java.perform(function () {
        var PopupWindow = Java.use("android.widget.PopupWindow");

        PopupWindow.showAsDropDown.overload('android.view.View').implementation = function (a) {
            console.log("PopupWindow.showAsDropDown() called ==>" + this.getClass().getName());
            this.showAsDropDown();
        };

        PopupWindow.showAsDropDown.overload('android.view.View', 'int', 'int').implementation = function (a, b, c) {
            console.log("PopupWindow.showAsDropDown() called ==>" + this.getClass().getName());
            this.showAsDropDown();
        };

        PopupWindow.showAsDropDown.overload('android.view.View', 'int', 'int', 'int').implementation = function (a, b, c, d) {
            console.log("PopupWindow.showAsDropDown() called ==>" + this.getClass().getName());
            this.showAsDropDown();
        };

        PopupWindow.dismiss.implementation = function () {
            console.log("PopupWindow.dismiss() called ==>" + this.getClass().getName());
            this.dismiss();
        };

    });
}

function hook_toast() {
        
        Java.perform(function () {
            var Toast = Java.use("android.widget.Toast");
    
            Toast.show.implementation = function () {
                console.log("Toast.show() called ==>" + this.getClass().getName());
                this.show();
            };
    
        });
    
}


function hook_onClick() {
    Java.perform(function () {


        //有问题
        // var OnClickListener = Java.use("android.view.View$OnClickListener");
        // // 保存原始的 onClick 方法
        // var originalOnClick = OnClickListener.onClick;
        // OnClickListener.onClick.implementation = function (view) {
        //     console.log("OnClickListener.onClick() called ==>" + this.getClass().getName());

        //     // 调用原始的 onClick 方法
        //     originalOnClick.call(this, view);
        // };


        //有问题
        // var View = Java.use('android.view.View');
        // var OnClickListener = Java.use('android.view.View$OnClickListener');
        // View.setOnClickListener.implementation = function(listener) {
    
        //     if (listener !== null) {
        //         var originalListener = Java.retain(listener);
        //         var newListener = Java.registerClass({
        //             name: 'com.example.NewOnClickListener',
        //             implements: [OnClickListener],
        //             methods: {
        //                 onClick: function(v) {
        //                     console.log(v.getClass().getName() + '- > ' + 'onClick');
        //                     originalListener.onClick(v);
        //                 }
        //             }
        //         }).$new();
        //         this.setOnClickListener(newListener);
        //     } else {
        //         this.setOnClickListener(null);
        //     }
        // };


    });

}



function hook_WebView() {
    
    Java.perform(function () {

        var WebView = Java.use("android.webkit.WebView");

        WebView.loadUrl.overload('java.lang.String').implementation = function (url) {
            console.log("WebView.loadUrl() called ==>" + this.getClass().getName());
            this.loadUrl();
        };

        WebView.loadUrl.overload('java.lang.String', 'java.util.Map').implementation = function (url, params) {
            console.log("WebView.loadUrl() called ==>" + this.getClass().getName());
            this.loadUrl();
        };
    });
}






function main() {

    hook_activity()
    // hook_fragment()
    // hook_Dialog()
    // hook_AlertDialog()
    // hook_PopupWindow()
    // hook_toast()
    // hook_onClick()
    // hook_WebView()

}

main()



/**
 
frida -U -f com.xingin.xhs -l anti_open_msaoaidsec.js 

frida -U -f com.qiyi.video -l anti_open_msaoaidsec.js 

frida -U -f tv.danmaku.bili -l anti_open_msaoaidsec.js 


 */