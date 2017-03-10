//经典的默认继承
function Parent (name) {
    this.name = name || "Admin";
}
Parent.prototype.say = function () {
    return this.name;
}
function Child (name) {}

inherit(Child, Parent);

function inherit (C, P) {
    C.prototype = new P();
}

/*所有的Child示例都共享了name属性，所以此种继承的弊端就是来自共享属性*/
var kid = new Child("Minson");
var name = kid.say();
console.log(name);  //"admin"


//Rent-A-Constructor解决继承问题
function Article () {
    this.tags = ['js', 'css'];
}
var article = new Article();

function BlogPost () {}
BlogPost.prototype = article;
var blog = new BlogPost();

function StaticPage () {
    Article.call(this);
}

var page = new StaticPage();

console.log(article.hasOwnProperty('tags')); //true
console.log(blog.hasOwnProperty('tags')); //false,因tags属性是blog的原型对象上的属性
console.log(page.hasOwnProperty('tags')); //true,使用call扩展作用域，其属性不是在原型上。

blog.tags.push('html');
console.log(blog.tags.join(',')); //js,css,html
console.log(article.tags.join(',')); //js,css,html 说明,blog的原型是对Article的引用，所以通过Blog修改了原型上的属性，其他实例也发生变化
page.tags.push('html');
console.log(page.tags.join(',')); //js,css,html


//原型链继承（借用构造模式）
function Parent (name) {
    this.name = name || 'Adam';
}

Parent.prototype.say = function () {
    return this.name;
}

function Child (name) {
    //使用apply
    Parent.apply(this, arguments);
}
/*
说明使用apply和call方法是不会共用属性
 */
var kid = new Child("Patrick");
kid.name; //"Patrick"
typeof kid.say; // undefined
var kid = new Child("Minson");
kid.name; //"Minson"


//多继承（借用构造模式）
function Cat () {
    this.legs = 4;
    this.say = function () {
        return "meaowww";
    }
}

function Bird () {
    this.wings = 2;
    this.fly = true;
}

function CatWings () {
    Cat.apply(this);
    Bird.apply(this);
}

var jane = new CatWings();
console.log(jane);
/*返回
CatWings
fly: true
legs: 4
say: ()
wings: 2
__proto__: CatWings
 */



//租用和设置原型
function Parent (name) {
    this.name = name || 'Adam';
}

Parent.prototype.say = function () {
    return this.name;
}

function Child (name) {
    Parent.apply(this, arguments);
}

Child.prototype = new Parent;  //Child的原型是Parent的实例

/*
因Child的原型是Parent的实例,同时使用apply扩展了child，所以kid示例得到了name的两份属性，一个name在原型上(prototype)，一个name在实例上（apply）
 */
var kid = new Child("Patrick");
kid.name; //"Patrick"  
kid.say(); // "Patrick"
delete kid.name;  //所以删除了的是实例上的name属性。
kid.say(); //'Adam'


//共享原型
function inherit (C, P) {
    C.prototype = P.prototype;
}


//临时构造函数
function inherit (C, P) {
    var F = function () {};
    F.prototype = P.prototype;
    C.prototype = new F();
}

//保存超级类
function inherit (C, P) {
    var F = function () {};
    F.prototype = P.prototype;
    C.prototype = new F();
    C.uber = P.prototype; //假设设置了个属性来保存原型
}

//重新设置构造器指针
function Parent () {}
function Child() {}
inherit(Child, Parent);

function inherit (C, P) {
    var F = function () {};
    F.prototype = P.prototype;
    C.prototype = new F();
    C.uber = P.prototype;
    //C.prototype.constructor = C;
}

/*
此处说明通过原型链，已把C的构造器指针指向了Parent；
如果把注释去掉，那么Child的构造器指针将值会Child；
 */
var kid = new Child();
console.log(kid.constructor.name);  //"Parent"
kid.constructor === Parent; //true


//Holy Grail模式
var inherit = (function () {
    var F = function () {};
    return function (C, p) {
        F.prototype = P.prototype;
        C.prototype = new F();
        C.uber = P.prototype;
        C.prototype.constructor = C;
    }
}());



//原型化继承
var parent = {
    name: "Papa"
};

function object(o) {
    function F() {};  //用一个空的临时构造函数
    F.prototype = o;  //它的原型指向父对象
    return new F(); //返回这个空构造函数的实例
}

var child = object(parent);

alert(child.name);

/*discussion*/
function Person () {
    this.name = "Adam";
}
Person.prototype.getName = function () {
    return this.name;
}
function object(o) {
    function F() {};  //用一个空的临时构造函数
    F.prototype = o;  //它的原型指向父对象
    return new F(); //返回这个空构造函数的实例
}
var kid = object(Person.prototype);

console.log(typeof kid.getName); //function ，getName方法是在原型上的
console.log(typeof kid.name);   //undefined ,因为只是继承了Person的原型

//在ECMAScript5中
var child =  Object.create(parent); //Object.create()方法的使用，使你不用在需要自己定义inherit()方法实现继承

var child = Object.create(parent, {
    age: {value: 2}
}); //Object.create的第二个参数是个对象，这个对象的属性会被添加到返回的子类的属性中。

/***示例**/
function Parent () {
    this.name = "Minson";
}
Parent.prototype.say = function () {
    return this.name;
}
function Child() {}
var child = new Child();
var child =  Object.create(new Parent, {
    age: {value: 5}       //传递的对象的属性在child的示例上
});
console.log(child.age); //5


//复制属性式继承
/*浅继承*/
function extend (parent, child) {
    var i;
    child = child || {};
    for ( i in parent) {
        child[i] = parent[i];
    }
    return child;
}
/*深继承*/
function extendDeep (parent, child) {
    var i,
        toStr = Object.prototype.toString,
        astr = "[Object Array]";

    child = child || {};

    for (i in parent) {
        if (parent.hasOwnProperty(i)) {
            if (typeof parent[i] === "object") {
                child[i] = (toStr.call(parent[i]) === astr) ? [] : {};  //判断是对象或数组
                extendDeep(parent[i], child[i]);  //递归调用
            }
        } else {
            child[i] = parent[i];
        }
    }
    return child;
}

/*最小化继承属性*/
function mix() {
    var arg, prop, child = {};
    for(arg = 0; arg < arguments.length; arg +=1 ) {
        for (prop in arguments[arg]) {
            if (arguments[arg].hasOwnProperty(prop)) {
                child[prop] = arguments[arg][prop];
            }
        }
    }
    return child;
}

var cake = mix(
    {eggs: 2, large: true},
    {butter: 1, salted: true},
    {flour: "3 cups"}
);
console.log(cake.eggs); //2


//使用bind是this对象需要的对象
/*bind等同于如下方法*/
function bindLike(o, m) {
    return function () {
        return m.apply(o, [].slice.call(arguments));
    }
}