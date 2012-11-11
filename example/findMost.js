/**
 * 找出字符串中出现次数最多的字母和出现次数
 * Author: Han.An
 * Date: 12-11-11
 * Time: 下午7:27
 * QQ: 13124048
 * Email: annn.han@gmail.com
 * Blog: http://www.cssha.com
 */
var a = 'srfghfjsdfkdjffdgdgdgqasfzccbbwe';
function findMost(v){
    var obj = {}, r = {v:'', n:-1 };
    for(var i=0; i<v.length; i++){
        if(v.charAt(i) in obj){
            obj[v.charAt(i)] += 1;
        }else{
            obj[v.charAt(i)] = 1;
        }

    }
    for(j in obj){
        if(obj[j] > r.n){
            r.v = j;
            r.n = obj[j];
        }
    }
    return r;
}
findMost(a);
