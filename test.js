var crypto = require('crypto');
var name = '284959708957677216052021174201';



//2021-05-16 17:42:01

//"ddMMyyyyhhmmss");
var hash = crypto.createHash('md5').update(name).digest('hex');
console.log(hash); // 9b74c9897bac770ffc029102a200c5de