//命名空间模式
/*
if (typeof MYAPP === "undefined") {
    var MYAPP = {};
} 也可以这样写，但下面的更简洁
 */
var MYAPP = MYAPP || {}; //global object
MYAPP.Parent = function () {}; //constructor
MYAPP.Child = function () {};

MYAPP.some_var = 1; //variable

MYAPP.modules = {}; //an object container

MYAPP.modules.module1 = {}; //nexted object
MYAPP.modules.module1.data = {a:1,b:2}; 
MYAPP.modules.module2 = {};

/***实现命名空间**/
MYAPP.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = MYAPP,
        i;

    if(parts[0] === "MYAPP") {
        parts = parts.slice(1);
    }

    for( i = 0; i < parts.length; i += 1) {
        if(typeof parent[parts[i]]  === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];  //循环得到如MYAPP.modules.module2.data的parent
    }
    return parent;
}

var data = MYAPP.namespace('MYAPP.modules.module2.data');
console.log(data.a); //1



//创建私有属性
function Gadget () {
    var name = 'ipod'; //private member
    this.getName = function () {
        return name;
    }
}

var toy = new Gadegt();
console.log(toy.name);  // undefined
console.log(toy.getName()); //ipod

//失败的私有属性示例
function Gadget () {
    var specs = {
        width: 320,
        height: 480,
        color: "white"
    }
    this.getSpecs = function () {
        return specs;
        /*
        正确做法：
            var yourSpecs = {
                width: specs.width,
                height: specs.height,
                color: specs.color
            };
            return yourSpecs;
         */
    }
}

var toy = new Gadget(),
    specs = toy.getSpecs();
specs.color = "black";
//原来想私有的对象属性改变了,解决方法就是用另一个对象保存需要的返回值，返回这个对象
console.log(toy.getSpecs()); //Object {width: 320, height: 480, color: "black"}


//原型和私有
function Gadget () {
    //private member;
    var name = 'ipod';
    this.getName = function () {
        return name;
    }
};

Gadget.prototype = (function(){
    //private member
    var browser = 'Mobile Webkit';
    return {
        getBrowser: function () {
            return browser;
        }
    }
}());

var toy = new Gadget();
console.log(toy.getName());  //ipod
console.log(toy.getBrowser()); //Mobile Webkit


//把私有方法变为公有方法
var myarray;

//创建私有作用域
(function () {
    var astr = "[object Array]",
        toString = Object.prototype.toString;

    function isArray(a) {
        return toString.call(a) === astr;
    }

    function indexOf(haystack, needle) {
        var i = 0,
            max = haystack.length;
        for(;i < max; i += 1) {
            if (haystack[i] === needle) {
                return i;
            }
        }
        return -1;
    }
    //通过给将私有方法放置进对象赋值给全局变量，实现私有方法的公有可用
    myarray = {
        isArray: isArray,
        indexOf: indexOf,
        inArray: indexOf
    }
}());

myarray.isArray([1,2]);  //true
myarray.isArray({0:1}); //false
myarray.indexOf(["a","b","z"], "z");  //2
myarray.inArray(["a","b","z"], "z"); //2


//私有静态成员
var Gadget = (function () {
    var counter = 0;
    return function () {
        console.log(counter += 1);
    };
}())

var g1 = new Gadget(); //1
var g1 = new Gadget(); //2
var g1 = new Gadget(); //3

/**进一步的例子**/
var Gadget = (function () {
    var counter = 0,
        NewGadget;

    NewGadget = function() {
        counter += 1;
    }

    NewGadget.prototype.getLastId = function() {
        return counter;
    }

    return NewGadget;
}());

var g1 = new Gadget();
g1.getLastId();  //1
var g2 = new Gadget();
g2.getLastId();  //2
var g3 = new Gadget();
g3.getLastId();  //3

//链式模式
var obj = {
    value: 1,
    increment: function () {
        this.value += 1;
        return this;  //链式调用关键在于返回的还是这个对象
    },
    add: function (v) {
        this.value += v;
        return this;
    },
    shout: function () {
        alert(this.value);
    }   
};

obj.increment().add(3).shout();