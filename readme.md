
查看样本包名：MT 或者 vscode的frida Workbench插件
样本：com.jianshu.haruki

-f 包名: spawn启动; 
-N 包名: attch启动。 
frida -U -f com.jianshu.haruki -l hook_okhttp3.js

so库：
jnitarce使用格式：jnitrace -l so名 包名
jnitrace -l libzxprotect.so com.jianshu.haruki


objection批量hook：
objection -g com.jianshu.haruki explore -c "SocketInit.txt"
