// let android_dlopen_ext = Module.findExportByName(null, "android_dlopen_ext");
// if(android_dlopen_ext != null) {
//     Interceptor.attach(android_dlopen_ext, {
//         onEnter: function(args) {
//             let so_name = args[0].readCString();
//             if(so_name.indexOf("libencrypt.so") !== -1) {
//                 this.hook = true;
//             }
//         }, onLeave: function(retval) {
//             if(this.hook) {
//                 this.hook = false;
//                 dlopen_todo();
//             }
//         }
//     });
// }

// function dlopen_todo() {
//     //todo
//     hook_encrypt()
// }


// function hook_init() {
//     let linker_name = "linker64";
//     let already_hook = false;
//     let call_constructor_addr = null;
//     if (Process.arch.endsWith("arm")) {
//         linker_name = "linker";
//     }

//     let symbols = Module.enumerateSymbolsSync(linker_name);
//     for (let i = 0; i < symbols.length; i++) {
//         let symbol = symbols[i];
//         if (symbol.name.indexOf("call_constructor") !== -1) {
//             call_constructor_addr = symbol.address;
//         }
//     }

//     if (call_constructor_addr != null) {
//         console.log(`get construct address ${call_constructor_addr}`);
//         Interceptor.attach(call_constructor_addr, {
//             onEnter: function (args) {
//                 if(already_hook === false) {
//                     const targetModule = Process.findModuleByName("libencrypt.so");
//                     if (targetModule !== null) {
//                         already_hook = true;
//                         init_todo();
//                     }
//                 }
//             }
//         });
//     }
// }

// function init_todo() {
//     //todo
// }







function hook_encrypt() {

    Java.perform(function () {

        // let AlibabaMarkJNIUtils = Java.use("com.moji.tool.AlibabaMarkJNIUtils");
        // AlibabaMarkJNIUtils["getBoot"].implementation = function () {
        //     console.log(`AlibabaMarkJNIUtils.getBoot is called`);
        //     let result = this["getBoot"]();
        //     console.log(`AlibabaMarkJNIUtils.getBoot result=${result}`);
        //     return result;
        // };

        // AlibabaMarkJNIUtils["getUpdate"].implementation = function () {
        //     console.log(`AlibabaMarkJNIUtils.getUpdate is called`);
        //     let result = this["getUpdate"]();
        //     console.log(`AlibabaMarkJNIUtils.getUpdate result=${result}`);
        //     return result;
        // };


        
        let Digest = Java.use("com.moji.mjweather.library.Digest");
        Digest["nativeDecrypt"].implementation = function (bArr) {
            console.log(`Digest.nativeDecrypt is called: bArr=${bArr}`);
            let result = this["nativeDecrypt"](bArr);
            console.log(`Digest.nativeDecrypt result=${result}`);
            return result;
        };


        Digest["nativeEncodeParams"].implementation = function (str) {
            console.log(`Digest.nativeEncodeParams is called: str=${str}`);
            let result = this["nativeEncodeParams"](str);
            console.log(`Digest.nativeEncodeParams result=${result}`);
            return result;
        };



        Digest["nativeEncrypt"].implementation = function (bArr) {
            console.log(`Digest.nativeEncrypt is called: bArr=${bArr}`);
            let result = this["nativeEncrypt"](bArr);
            console.log(`Digest.nativeEncrypt result=${result}`);
            return result;
        };



        Digest["nativeGenPKey"].implementation = function (bArr) {
            console.log(`Digest.nativeGenPKey is called: bArr=${bArr}`);
            let result = this["nativeGenPKey"](bArr);
            console.log(`Digest.nativeGenPKey result=${result}`);
            return result;
        };


        Digest["nativeGenSKey"].implementation = function () {
            console.log(`Digest.nativeGenSKey is called`);
            let result = this["nativeGenSKey"]();
            console.log(`Digest.nativeGenSKey result=${result}`);
            return result;
        };



    });





}

hook_encrypt()

//  setTimeout(hook_encrypt, 1000);

// setImmediate(hook_encrypt);
