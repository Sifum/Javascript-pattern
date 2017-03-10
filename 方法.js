//不用new实例化的话，会使对象的属性和方法指向了global对象（浏览器端就是window）
function Waffle()  //constructor
{
    this.tastes = "yummy";  
}
var good_morning = new Waffle();
console.log(typeof good_morning); // "object"
console.log(good_morning.tastes); // "yummy"
//以下为反面例子,没有用new声明，构造函数中的this指向了window，antipattern:
var good_morning = Waffle();
console.log(typeof good_morning); // "undefined"
console.log(window.tastes); // "yummy"
console.log(good_morning.tastes); //error:Cannot read property 'testes' of undefined...

//构造函数的返回
/**避免所有成员赋值给this的返回，使用同返回this一样**/
function Waffle()
{
    var that = {};
    that.tastes = "yummy";
    return that;
}
/**直接返回对象**/
function Waffle()
{
    return {
        tastes : "yummy"
    };
}

var first = new Waffle(),
    second = Waffle();
console.log(first.tastes); // "yummy"
console.log(second.tastes); // "yummy"


// 避免没有使用new声明导致属性指向window的解决方法
function Waffle()
{
    if(!(this instanceof Waffle)){  //不是严格模式的话也可写成： if(!(this instanceof arguments.callee))
        return new Waffle();
    }

    this.tastes = "yummy";
}


var good_morning = Waffle();
console.log(good_morning.tastes);  // "yummy"


//Array也是object
var a =[];
console.log(typeof a); // "object"
console.log(a.constructor === Array); //true

//Array检测,使用instanceof Array,会在一些IE中不正确,Array.isArray()方法更好
Array.isArray([]);
/**更好的做法**/
if(typeof Array.isArray === "undefined"){
    Array.isArray  = function (arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
    } 
}else{
    Array.isArray(arg);
}

function test(arg) {
    if(typeof Array.isArray === "undefined"){
        Array.isArray  = function (arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
        } 
    }else{
        Array.isArray(arg);
    }
}

//合理处理报错
try {
    //something bad happened, throw an error
    throw {
        name : "MyErrorType",  //custom error type
        message : "oops",
        extra : "This was rather embarrassing",
        remedy : genericErrorHandler  //who should handle it
    };
} catch (e) {
    alert(e.message); //inform the user
    //gracefully handle the error
    e.remedy();  //calls genericErrorHandler()
}

function genericErrorHandler () {
    //take more graceful action
}

//方法创建错误示例
var foo = function bar(){};//方法名和赋值的变量不同名，会导致在一些IE中执行不正确

//方法提升：声明将提升，表达式不提升
function hoisting () {
    console.log(typeof foo); // "function"
    console.log(typeof bar);  // "undefined"

    foo();  //成功调用
    bar(); //失败，bar is not a function

    //函数声明
    function foo () {
        alert("function declaration");
    }
    //函数表达式
    var bar = function () {
        alert("function expression");
    }
}
hoisting();

//方法的回调模式
function writeCode (callback) {
    //do something ...
    callback();
    //...
}

function introduceBugs () {
    // ... make bugs
}

writeCode(introduceBugs);

//call和apply的使用
var findNodes = function (callback, callback_obj) {
    if(typeof callback === "string") {
        callback = callback_obj[callback];
    }
    //...
    if(typeof callback === "function") {
        callback.call(callback_obj[,其他参数]);
    }
    //...
}

//函数放回方法
var setup = function () {
    alert(1);
    return function () {
        alert(2);
    }
}

var me = setup(); //alerts 1
me(); //alerts 2


//自我重新定义方法
var scareMe = function () {
    //只发生在第一次调用
    alert("Boo!");
    scareMe = function () {  //重写了全局已调用的scareMe方法（其实就是函数指针指向变了）
        alert("Double boo!");
    }
}
/*
解释：首先在全局对象上只有一个Boo!弹出框的scareMe方法；
再一次调用后，执行了Boo!后，重写了全局对象上的scareMe方法（相当于自己覆盖了自己）,导致之后的调用都是Double boo!
 */
scareMe();  // "Boo!"
scareMe();  //"Double boo!"
scareMe();  //"Double boo!"


//关于立即执行方法
/*
基本结构
 */
(function(){
    alert("watch out!");
}());

(function(){
    alert("watch out!");
})();

/*
用途：可用于页面初始话时的数据和方法，注这个作用域不是全局的
 */
(function () {
    var today = new Date();
}())
console.log(today); //error : today is not defined ...

/*
可用传参的方法改变上面的问题
 */
(function (global) {
    global.today = new Date();
}(this))

/*
立即执行方法返回值
 */
var result = (function () {
    return 2+2;
}())

var result = function () {
    return 2+2;
}();

/*
立即执行方法返回方法
 */
var result = (function () {
    var res = 2 +2;
    return function () {   //返回方法
        return res;
    }
}());

var num = result();
console.log(num);  //4


//对象的立即调用方法
({
    param1 : "param1",
    //...param..
    init : function () {
        //do something immediatly..
    }
}).init();

//page79 - 83 函数柯理化之后研究