/*
 * 用(0-9 A-Z a-z)生成任意长度(62位以内)的各个位都不重复的随机字符串
 */
(function () {
    //生成数
    var a = []
    for (var i = 0; i < 10; i++) {
        a.push(i);
    }
    for (var i = 65; i <= 90; i++) {
        a.push(String.fromCharCode(i));
        a.push(String.fromCharCode(i).toLocaleLowerCase());
    }

    var l = Math.floor(Math.random() * 62);//随即长度
    var str = [], s;
    for (var i = 0; i < l; i++) {
        (function (i) {
            var ind = Math.floor(Math.random() * 62); //随即字符
            for (i in str) {
                if (a[ind] == str[i]) {
                    alert(a[ind]);
                    arguments.callee();
                    return;
                }
            }
            str.push(a[ind]);
        })(i)
    }
    s = str.join('');
    console.log(s + ' len:' + s.length);
})()
