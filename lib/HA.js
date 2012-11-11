/**
 * Javascipt框架：HA
 * Author：韩安
 * Versions：1.0
 * Site：http://www.cssha.com/
 * Email：hanan321@qq.com
 * QQ：13124048
 */
(function (){
    window.HAchangeName = window.HAchangeName || 0;
    var doc = document;
    var a = {
        install: function(){
            //*如果已存在一个HA库,为避免冲突，可以在引入本库前给window.HAchangeName属性赋值，此属性值将代替代替库对象名HA。
            //*例如window.HAchangeName = 'MY',那么MY可以代替HA.使用本库所有方法属性将变成MY.xxx这种形式。
            //*如果不为window.HAchangeName赋值，就用HA作为库对象名。
            if(HAchangeName){
                window[HAchangeName] = a;
            }else{
                window.HA = a;
            }
        },
        ui:{},
        dom:{},
        method:{},
        verify: {}
    }
    //UI
    a.ui = {
        animat: function(ele,sty,time){   //动画。ele：执行动画的元素，sty：样式属性（数值型属性），比如{"width":"100px","height":"500px"}，time：时间（毫秒）
            for(i in sty){
                (function(i){
                    if(ele.style[i]&&ele.style[i]!='auto'){
                        ele.style[i] = ele.style[i] ;
                    }else if (ele.currentStyle){
                        ele.style[i] = ele.currentStyle[i];
                    }else if(window.getComputedStyle){
                        ele.style[i] = window.getComputedStyle(ele,null).getPropertyValue(i);
                    }else{
                        ele.style[i] = '0' ;
                    }
                    var speed = i =='opacity' ? (parseFloat(sty[i]) - parseFloat(ele.style[i]))/time*10 : time/(parseFloat(sty[i]) - parseFloat(ele.style[i])); //每100毫秒变化的透明度  or 每移动1px需要的毫秒数
                    (function(){
                        if(i=='opacity'){
                            if(parseFloat(sty[i]).toFixed(2) != parseFloat(ele.style[i]).toFixed(2)){
                                ele.style[i] =parseFloat(ele.style[i]) + speed ;
                            }else{
                                return;
                            }
                            setTimeout(arguments.callee,10);
                        }else{
                            var a = speed>=0?1:-1;
                            if(parseInt(sty[i]) != parseInt(ele.style[i])){
                                ele.style[i] =parseInt(ele.style[i]) + a + 'px' ;
                            }else{
                                return;
                            }
                            setTimeout(arguments.callee,Math.abs(speed));
                        }
                    })();
                })(i)
            }
        },
        popup: function(ele,c){	//弹窗。ele：要弹出的DOM对象，c：点击关闭ele的DOM对象。
            var s = ele.style ;
            s.display = 'block';
            var winW = window.innerWidth || doc.documentElement.clientWidth,
                winH = window.innerHeight || doc.documentElement.clientHeight,
                eleW = ele.offsetWidth ,
                eleH = ele.offsetHeight,
                l = (winW/2) - (eleW/2),
                t = (winH/2) - (eleH/2);
            s.position = 'absolute';
            s.left = l + 'px';
            s.top = t + 'px';
            s.zIndex = 9999;
            c.onclick = function(){
                s.display = 'none';
            }
            ele.onmousedown = function(e){
                doc.onselectstart = function(){event.returnValue=false;}
                var e = e || window.event,
                    ml = e.clientX,
                    mt = e.clientY,
                    nl = ml-ele.offsetLeft,
                    nt = mt-ele.offsetTop;
                this.onmousemove = function(e){
                    var e, ml, mt;
                    e = e || window.event;
                    ml = e.clientX;
                    mt = e.clientY;
                    s.left = (ml - nl) + 'px';
                    s.top = (mt - nt) + 'px';
                }
            }
            ele.onmouseup = function(){
                doc.onselectstart = function(){event.returnValue=true;}
                this.onmousemove = null;
            }
        }
    }
    //dom操作类
    a.dom = {
        byId: function(i){      //根据id获取元素
            return doc.getElementById(i);
        },
        byTag: function(t){     //根据标签获取元素
            return doc.getElementsByTagName(t);
        },
        byName: function(n){    //根据name获取元素
            return doc.getElementsByName(n);
        },
        byClass: function(c){   //根据class获取元素
            if(doc.getElementsByClassName){
                return doc.getElementsByClassName(c);
            }else{
                var all = document.all,arr=[];
                for(var i=0;i<all.length;i++){
                    if(all[i].className==c){
                        arr.push(all[i]);
                    }
                }
                return arr;
            }
        },
        byAttr: function(a,v){  //attribute，根据属性获取元素：a属性名，v属性值
            var all = doc.getElementsByTagName('*'),arr=[],a=a=='class'?'className':a;
            for(var i=0;i<all.length;i++){
                if(all[i][a]==v){
                    arr.push(all[i]);
                }
            }
            return arr;
        },
        before: function(a,b){	//在a元素前面插入b元素
            a.parentNode.insertBefore(b,a);
        },
        after: function (a,b){	//在a元素后面插入b元素
            var p = a.parentNode;
            if(a==p.lastChild){
                p.appendChild(b);
            }else{
                p.insertBefore(b,a.nextSibling);
            }
        },
        ready: function(fn){	//DOM加载完毕事件
            if(!a.verify.browser('ie')){//不是IE使用DOMCntentLoaded事件
                doc.addEventListener('DOMContentLoaded',fn,false);
            }
            if(a.verify.browser('ie')&&window==top){//IE检测doScroll方法是否可用
                (function(){
                    try{
                        doc.documentElement.doScroll('left');
                    }catch(error){
                        setTimeout(arguments.callee,0);
                        return;
                    }
                    fn();
                })();
            }
        }
    }
    //各种常用功能方法
    a.method = {
        trimLeft: function(w){		//去左空格
            return w.replace(/^\s+/,'');
        },
        trimRight: function(w){		//去右空格
            return w.replace(/\s+$/,'');
        },
        trimAll: function(w){		//去全部空格
            return w.replace(/\s+/g,'');
        },
        noRepeat: function(arr){    //数组去重
            var n = [],a = true;
            for(var i=0;i<arr.length;i++){
                a = true;
                for(var j=0;j<n.length;j++){
                    if(arr[i]===n[j]){
                        a = false;
                        break;
                    }
                }
                if(a){
                    n.push(arr[i]);
                }
            }
            return n;
        },
        clone: function(o){     //克隆对象
            if(o){
                if(typeof(o)!='object' || o==null){
                    return o;
                }else{
                    var n = (o)instanceof(Array) ? [] : {} ;
                    for(i in o){
                        n[i] = arguments.callee(o[i]);
                    }
                    return n;
                }
            }
        }
    }
    //验证类
    a.verify = {
        doRegExp: function(e,w){    //正则验证函数
            var e = new RegExp();
            return e.test(w);
        },
        isNumber: function(w){	//数字
            return /^\d+$/.test(w);
        },
        isTel: function(w){  	//电话号码（可不带区号）
            return /^(0\d{2,3})?-?\d{7,8}$/.test(w);
        },
        isFullTel: function(w){ //完整电话号码（带区号）
            return /^0\d{2,3}-?\d{7,8}$/.test(w);
        },
        isPhone: function(w){   //手机号码
            return /^(\+86)?1[3,5,8]\d{9}$/.test(w);
        },
        isZipCode: function(w){ //邮编
            return /^\d{6}$/.test(w);
        },
        isIdCode: function(w){  //18位身份证
            return /^[1-9](\d{5})19(\d{2})((0[1-9])|(1[1,2]))((0[1-9])|([1,2]\d)|(3[0,1]))(\d{3})([\d,x,X])$/.test(w);
        },
        isEmail: function(w){   //邮箱
            return /^.+@.+\..+$/.test(w);
        },
        //*判断浏览器
        //*无参数：返回"ie6","ie7","ie8","ie9","chrome","safari","firefox","opera"其中的一个
        //*有参数：返回布尔值，参数为："ie","chrome","safari","firefox","opera"其中的一个
        browser: function(b){
            var a = navigator.userAgent,
                c = a.indexOf('Chrome')>-1,
                f = a.indexOf('Firefox')>-1,
                i = a.indexOf('MSIE')>-1,
                o = a.indexOf('Opera')>-1,
                s = a.indexOf('Safari')>-1;
            if(b){
                switch(b){
                    case 'chrome': return c; break;
                    case 'firefox': return f; break;
                    case 'ie': return i; break;
                    case 'opera': return o; break;
                    case 'safari': return !c&&s; break;
                    default: return false; break;
                }
            }else{
                if(c){return 'chrome'}
                if(f){return 'firefox'}
                if(i){return 'ie' + /\d/.exec(a.split(';')[1])}
                if(o){return 'opera'}
                if(s){return 'safari'}
            }
        }
    }
    //简化方法
    a.ready = a.dom.ready;
    //部署
    a.install();
})()