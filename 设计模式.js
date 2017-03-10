// 单例模式,指的是无论创建多么像的对象，在Javascript中都是不同的，其实就是内存堆中是不同的。
var obj = {
    myprop: 'my value'
}

var obj2 = {
    myprop: 'my value'
}

/***即使看起来一模一样的对象也是不同的**/
obj === obj2; //false
obj == obj2; //false

/**new两个对象，其实就是在栈中有uni和uni2元素，指针都指向了同一个堆中的对象**/
var uni = new Universe();
var uni2 = new Universe();
uni === uni2; //true

/*保存单个实例*/
function Universe() {
    //do we have an existing instance?
    if(typeof Universe.instance === "object") {
        return Universe.instance;
    }

    this.start_time = 0;
    this.bang = "Big";
    // cache
    Universe.instance = this;

}

var uni = new Universe();
var uni2 = new Universe();
uni == uni2; //true

/*利用闭包保护单例*/
function Universe() {
    //the cached instance 
    var instance = this;

    this.start_time = 0;
    this.bang = "Big";

    //rewrite the constructor
    Universe = function () {
        return instance;
    }

}

var uni = new Universe();
var uni2 = new Universe();
uni = uni2;  //true

/*上面的例子的问题：uni.constructor不是指向新的构造器，仍然会指向原来的构造器*/
//adding to the prototype
Universe.prototype.nothing = true;

var uni = new Universe();

//again adding to the prototype
//after the initial object is created
Universe.prototype.everything = true;

var uni2 = new Universe();

//only the original prototype was 
//linked to the objects
uni.nothing;//true
uni2.nothing; //true
uni.everything; //undefined
uni2.everything; //undefined

uni.constructor.name; //"Universe"
uni.constructor === Universe; //false

/**解决办法**/
function Universe() {
    var instance;

    Universe = function Universe () {
        return instance;
    }

    Universe.prototype = this;

    instance = new Universe();

    instance.constructor = Universe;

    instance.start_time = 0;
    instance.bang = "Big";

    return  instance

}
Universe.prototype.nothing = true;

var uni = new Universe();

Universe.prototype.everything = true;

var uni2 = new Universe();

uni.nothing;//true
uni.bang; //"Big"
uni.constructor === Universe; //false

/**更好实践,放进立即执行函数中**/
var Universe;

(function(){
    var instance;
    Universe = function Universe() {
        if(instance) {
            return instance;
        }

        instance = this;

        this.start_time = 0;
        this.bang = "Big";
    };
}());

/**工厂模式**/
//建立同样的对象进行重复的操作
//Offers a way of the customers of the factory to create objects without knowing the specific type(class) at compile time

/**迭代模式**/
var agg = (function(){
    var index = 0,
        data = [1, 2, 3, 4, 5];
        length = data.length;
    return {
        next: function () {
            var element;
            if(!this.hasNext()) {
                return null;
            }
            element = data[index];
            index = index + 2;
            return element;
        },
        hasNext: function () {
            return index  < length;
        },
        rewind: function () {
            index = 0;
        },
        current: function () {
            return data[index];
        }
    }
}());
//testing 
while(agg.hasNext()) {
    console.log(agg.next());
}
//go back
agg.rewind();
console.log(agg.current()); //1

Summary

Singleton 
    Creating only one object of a "class". We looked at several approaches if you want to substitute the idea of a class with a constructor function and preserve the Java-like syntax.Otherwise,technically all objects in JavaScript are Singletons. And also sometimes developers would say "Singleton", meaning objects created with the module pattern.
Factory
    A method that creates objects of type specified as a string at runtime .
Iterator
    Provide an API to loop over and navigate around a complex custom data structure.
Decorator
    Tweaking objects at runtime by adding functionality from predefined decorator objects.
Strategy
    Kepping the same interface while selecting the best Strategy to handle the specific task(context).
Facade
    Providing a more convenient API by wrapping common (or poorly designed) methods into a new one.
Proxy
    wrapping an object to control  the access to it,with the goal of avoiding expensive operations by either grouping them together or performing them only when really necessary.
    