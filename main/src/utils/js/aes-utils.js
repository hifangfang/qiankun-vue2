import CryptoJS from "crypto-js";

//aes加密工具类，和后端的aesutils是对应的，gisq39561c9fe068是加解密的key值，可以根据实际情况修改
export default {
  // 加密
  encrypt(word) {
    //这里要加.Base64。网上大多数例子都没有，否则和后端加密不同，解析不出来，坑的1b
    const key1 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse("gisq39561c9fe068")),
      key = CryptoJS.enc.Base64.parse(key1),
      iv = key,
      srcs = CryptoJS.enc.Utf8.parse(word),
      //加密模式cbc，补码Pkcs7，其实就是PKCS5Padding，都是和后端的加密模式对应的
      encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }),
      //这里返回大小写随意，都能解析出来，统一点就用小写
      hexStr = encrypted.ciphertext.toString().toLowerCase();

    return hexStr;
  },
  encryptByKey(word, keyStr) {
    //这里要加.Base64。网上大多数例子都没有，否则和后端加密不同，解析不出来，坑的1b
    const key1 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(keyStr)),
      key = CryptoJS.enc.Base64.parse(key1),
      iv = key,
      srcs = CryptoJS.enc.Utf8.parse(word),
      //加密模式cbc，补码Pkcs7，其实就是PKCS5Padding，都是和后端的加密模式对应的
      encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }),
      //这里返回大小写随意，都能解析出来，统一点就用小写
      hexStr = encrypted.ciphertext.toString().toLowerCase();

    return hexStr;
  },
  // 解密
  decrypt(word) {
    const key1 = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse("gisq39561c9fe068")),
      key = crypto.enc.Base64.parse(key1),
      iv = key,
      encrypted = crypto.AES.decrypt(word, key, { iv: iv, mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7 });

    return encrypted.toString(crypto.enc.Utf8);
  },
};
