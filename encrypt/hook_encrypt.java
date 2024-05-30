/**
 
javax.crypto.spec.SecretKeySpec
是 Java 中用于表示对称密钥的类。它通常与加密算法一起使用，比如 AES（高级加密标准）算法。

javax.crypto.spec.DESKeySpec
是 Java 中用于表示 DES（数据加密标准）密钥的类。它允许你基于一个字节数组来创建一个 DES 密钥。

javax.crypto.Mac
是 Java 中用于执行消息认证码（Message Authentication Code，MAC）的类。MAC 是一种用于验证消息完整性和认证消息发送者的算法。 MAC 算法包括： HmacSHA256、HmacSHA1 等。

java.security.MessageDigest
是 Java 中用于执行消息摘要（Message Digest）的类。消息摘要是一种用于生成数据唯一标识符的算法，通常用于确保数据的完整性。消息摘要算法包括 MD5、SHA-1、SHA-256 等。

javax.crypto.spec.IvParameterSpec
是 Java 中用于表示初始化向量（Initialization Vector，IV）的类。IV 是在对称加密算法中用于增加安全性的随机初始值。
在加密过程中，IV 与密钥一起用于初始化加密算法，并与明文一起进行加密。
在解密过程中，IV 与密钥一起用于初始化解密算法，并与密文一起进行解密。

javax.crypto.Cipher
类提供了加密和解密数据的功能。例如AES等。

java.security.spec.X509EncodedKeySpec
是 Java 中用于表示 X.509 编码的公钥的规范类。X.509 是一种常见的证书格式，用于表示公钥、数字证书等。X509EncodedKeySpec 主要用于在密钥工厂中使用已编码的公钥来生成公钥对象。

java.security.spec.RSAPublicKeySpec
是 Java 中用于表示 RSA 公钥的规范类。它允许您在密钥工厂中使用 RSA 公钥的模数和指数来生成公钥对象。

java.security.KeyPairGenerator
是 Java 中用于生成密钥对的工具类。密钥对通常包括一个公钥和一个相应的私钥，用于加密和解密数据、签名和验证等安全操作。


 */