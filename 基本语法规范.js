//js没有用var声明的变量将作为全局变量
function sum(x,y)
{
    result = x +y;
    return result;  //此处的result即成为了全局变量
}

//使用链式赋值导致成为全局变量的问题
function foo()
{
    var a=b=0; //此处变量a为局部变量，但b成为了全局变量。须使用var a,b; a=b=0;的方式
    //...
}

/*
由此需要注意：
    使用var声明的全局变量是不可以用delete删除的；
    没有使用var声明的全局变量是可以用delete删除的。
 */
var global_var  = 6;
global_novar = 7;
(function(){
    global_fromfunc = 3;
}());

delete global_var;  //false,删除失败
delete global_novar; //true,可以删除
delete global_fromfunc; //true,可以删除

//在浏览器端通过window可以访问global对象，但在其他环境（没有window）中可使用下面方法创建global对象(严格模式除外)
var global = (function(){
    var c = 15;
    return this;
}())

//尽可能采用一个var声明所有变量
function foo()
{
    var a = 0,
        b = 1,
        o = {};
    //...
}


//在方法中使用var声明的任何变量将声明变量提升到方法的最前面，由此会产生如下问题
myName = "global";
function foo()
{
    alert(myName);  // "undefined"，如果没有后续的var声明同名变量，这个可以得到预期的global;
    var myName = "local";  //这个声明导致 var myName;被提升放置了方法的最前端，（注，只提升变量声明，不带提升变量的赋值行为）
    alert(myName); //"local"
}
foo();

//循环中使用的变量问题
/***问题循环**/
for(var i = 0; i < arr.length; i++)  //问题是每次循环都需重新得到数量，效率不高
{
    //...
}
/***更好的循环**/
for(var i = 0, len = arr.length; i < len; i++){
    //...
}


//用0作为比较或结束条件更为高效
/******/
var arr =[], i = arr.length;
while(i--)  //等同于for(var i = 0, len = arr.length; i < len; i++){//....};(注：while条件中为0也可停止退出)
{
    //...arr[i];
}

var arr =[], i = arr.length;
for(;i--;)  //等同于for(var i = 0, len = arr.length; i < len; i++){//....};(注：for退出即为i--是否为0)
{
    //...arr[i];
}


//在forin循环中的注意使用hasOwnProperty()过滤对象上的原型属性
var man = {
    hands : 2,
    legs  : 2,
    head  : 1
};
if(typeof Object.prototype.clone == "undefined"){  //唯有继承Object的对象都具有一个clone方法
    Object.prototype.clone = function(){};
}

/**未使用hasOwnProperty()**/
for(var i in man){
    console.log(i + ":" + man[i]); //这种循环将得到hands:2 legs:2 head:1 clone:function (){} （包含了原型上继承的方法）
}
/**使用hasOwnProperty()方法1**/
for(var i in man){
    if(man.hasOwnProperty(i)){
        console.log(i + ":" + man[i]);  //即可得到排除了原型上的对象和方法
    }
}
/***使用hasOwnProperty()方法2***/
for(var i in man){
    if(Object.prototype.hasOwnProperty.call(man, i)) //call(作用域，参数)
    {
        console.log(i + ":" + man[i]); //即可得到排除了原型上的对象和方法
    }
}

/*方法2的简化*/
var i, hasOwn = Object.prototype.hasOwnProperty;
for(var i in man){
    if(hasOwn.call(man, i)){
        console.log(i + ":" + man[i]);
    }
}

//在已有项目中给原型上定义方法，注意使用如下方式避免冲突
if(typeof Object.prototype.MyMethod !== "function"){
    Object.prototype.MyMethod = function(){
        //....
    }
}


//switch的规范
var result;
switch(param) {  //case和switch对齐
case 0:
    result = 0;
    break;       //要有break;
case 1:
    result = 1;
    break;
default:        //要有default
    result = -1;  
}

//比较时容易出的错误，0和false和""('')
var zero = 0;
if (zero === false) {
    //不会执行，因为全等的话，o和false是不同的
}
if (zero == false) {
    //通过可以执行
}  //所以尽量使用全等或不全等，除了typeof返回的是字符串进行比较等。



//eval的谨慎使用示例
console.log(typeof un); //"undefined"
console.log(typeof deux); //"undefined"
console.log(typeof trois); //"undefined"

var jsstring = "var un = 1; console.log(un);";
eval(jsstring); //1

jsstring = "var deux = 2; console.log(deux);";
new Function(jsstring)(); //2

jsstring = "var trois = 2; console.log(deux);";
(function(){
    eval(jsstring);
}()) //3

/**
 * 如果必须使用eval,请尽量使用new Function()();或私有作用域；
 * 这样不会是eval中的语句变量污染其他变量
 */
console.log(typeof un); //"number"
console.log(typeof deux); //"undefined"
console.log(typeof trois); //"undefined"

//字符串转数字
var num1 = +"08",
    num2 = Number("08"); //如果字符串中没有字符，只有数字，这两种比parseInt()更好的。    
