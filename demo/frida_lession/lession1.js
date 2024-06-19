function hook_a() {

    Java.perform(function () {
        let LoginActivity = Java.use("com.github.lastingyang.androiddemo.Activity.LoginActivity");
        LoginActivity["a"].overload('[B').implementation = function (bArr) {
            console.log(`LoginActivity.a is called: bArr=${bArr}`);
            let result = this["a"](bArr);
            console.log(`LoginActivity.a result=${result}`);
            result = "123456"
            return result;
        };


        let FridaActivity1 = Java.use("com.github.lastingyang.androiddemo.Activity.FridaActivity1");
        FridaActivity1["a"].implementation = function (bArr) {
            console.log(`FridaActivity1.a is called: bArr=${bArr}`);
            let result = this["a"](bArr);
            console.log(`FridaActivity1.a result=${result}`);
            result = 'R4jSLLLLLLLLLLOrLE7/5B+Z6fsl65yj6BgC6YWz66gO6g2t65Pk6a+P65NK44NNROl0wNOLLLL='
            return result;
        };


        let FridaActivity2 = Java.use("com.github.lastingyang.androiddemo.Activity.FridaActivity2");
        FridaActivity2["onCheck"].implementation = function () {

            Java.choose('com.github.lastingyang.androiddemo.Activity.FridaActivity2', //这里写类名 
                {   //onMatch 匹配到对象执行的回调函数
                    onMatch: function (instance) {
                        instance.setStatic_bool_var()
                        instance.setBool_var()
                    },
                    //堆中搜索完成后执行的回调函数
                    onComplete: function () {
                    }
                });

            console.log(`FridaActivity2.onCheck is called`);
            this["onCheck"]();
        };


        // let FridaActivity3 = Java.use("com.github.lastingyang.androiddemo.Activity.FridaActivity3");
        // FridaActivity3.static_bool_var.value = true;
        // FridaActivity3["onCheck"].implementation = function () {

        //     Java.choose('com.github.lastingyang.androiddemo.Activity.FridaActivity3', //这里写类名 
        //         {   //onMatch 匹配到对象执行的回调函数
        //             onMatch: function (instance) {
        //                 //instance.static_bool_var.value = true
        //                 instance.bool_var.value = true
        //                 instance.same_name_bool_var.value = true

        //                 console.log("static_bool_var:", FridaActivity3.static_bool_var.value);
        //                 console.log("bool_var:", instance.bool_var.value);
        //                 console.log("same_name_bool_var:", instance.same_name_bool_var.value);
        //             },
        //             //堆中搜索完成后执行的回调函数
        //             onComplete: function () {
        //             }
        //         });

        //     console.log(`FridaActivity3.onCheck is called`);
        //     this["onCheck"]();
        // };

    });

}



function call_FridaActivity3() {
    Java.perform(function () {
      var FridaActivity3 = Java.use("com.github.lastingyang.androiddemo.Activity.FridaActivity3");
      console.log("static_bool_var:", FridaActivity3.static_bool_var.value);
      FridaActivity3.static_bool_var.value = true;  //设置静态成员变量的值
      console.log("static_bool_var:", FridaActivity3.static_bool_var.value);
  
      Java.choose("com.github.lastingyang.androiddemo.Activity.FridaActivity3", {
        onMatch : function(instance) {
          console.log("FridaActivity3.bool_var:", instance.bool_var.value);
          instance.bool_var.value = true;
          console.log("bool_var:", instance.bool_var.value);
  
          console.log("_same_name_bool_var:", instance._same_name_bool_var.value);
          instance._same_name_bool_var.value = true;
          console.log("_same_name_bool_var:", instance._same_name_bool_var.value);
        }, onComplete : function() {
        }
      })
    });
}


function call_FridaActivity4() {
    Java.perform(function () {


        let InnerClasses = Java.use("com.github.lastingyang.androiddemo.Activity.FridaActivity4$InnerClasses");
        InnerClasses["check1"].implementation = function () {
            console.log(`InnerClasses.check1 is called`);
            return true;
        };


        InnerClasses["check2"].implementation = function () {
            console.log(`InnerClasses.check2 is called`);
            return true;
        };


        InnerClasses["check3"].implementation = function () {
            console.log(`InnerClasses.check1 is called`);
            return true;
        };


        InnerClasses["check4"].implementation = function () {
            console.log(`InnerClasses.check1 is called`);
            return true;
        };


        InnerClasses["check5"].implementation = function () {
            console.log(`InnerClasses.check1 is called`);
            return true;
        };


        InnerClasses["check6"].implementation = function () {
            console.log(`InnerClasses.check1 is called`);
            return true;
        };

    });
}




function hook_dyn_dex() {
    Java.perform(function () {
        Java.enumerateClassLoaders({
            onMatch: function (loader) {
                try {
                    if (loader.findClass("com.example.androiddemo.Dynamic.DynamicCheck")) {
                        Java.classFactory.loader = loader;
                        console.log(loader);
                    }
                } catch (error) {

                }
            }, onComplete: function () {
            }
        });
        var DynamicCheck = Java.use("com.example.androiddemo.Dynamic.DynamicCheck");
        DynamicCheck.check.implementation = function () {
            var result = this.check();
            console.log("DynamicCheck.check:", result);
            return true;
        }
    });
}


function hook_activity6() {

    Java.perform(function () {

        let Frida6Class0 = Java.use("com.github.lastingyang.androiddemo.Activity.Frida6.Frida6Class0");
        Frida6Class0.check.implementation = function () {
            console.log("Frida6Class0.check:");
            return true;
        }

        let Frida6Class1 = Java.use("com.github.lastingyang.androiddemo.Activity.Frida6.Frida6Class1");
        Frida6Class1.check.implementation = function () {
            console.log("Frida6Class0.check:");
            return true;
        }


        let Frida6Class2 = Java.use("com.github.lastingyang.androiddemo.Activity.Frida6.Frida6Class2");
        Frida6Class2.check.implementation = function () {
            console.log("Frida6Class0.check:");
            return true;
        }
    })
}


function hook_activity7() {
    Java.perform(function () {
        let FridaActivity7 = Java.use("com.github.lastingyang.androiddemo.Activity.FridaActivity7");
        FridaActivity7["onCheck"].implementation = function () {
            console.log(`FridaActivity7.onCheck is called`);
            
            let toast = Java.use("android.widget.Toast");
           
            toast.$new(this).makeText(this, Java.use("java.lang.String").$new("100000"), 1).show();



        };
    })
}

setTimeout(hook_a, 1000)

call_FridaActivity3()

call_FridaActivity4()

 hook_dyn_dex()

 hook_activity6()

 hook_activity7()

//setImmediate(hook_a)
