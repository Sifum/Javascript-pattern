//浏览器能力检测
/*antipattern 除非是用于得到一个概括结果*/
if(navigator.userAgent.indexOf("MSIE") !== -1) {
    document.attachEvent('onclick',  console.log);
}

/*Better*/
if(document.attachEvent) { //注:attachEvent是IE的事件处理行为
    document.attachEvent('onclick', console.log);
}

/*or even more specific*/
if(typeof document.attachEvent !== 'undefined') {
    document.attachEvent('onclick', console.log);
}


//Dom Acess
/*antipttern*/
for(var i = 0; i < 100; i += 1) {
    document.getElementById("result").innerHTML += i + ", ";
}
/*Better*/
var i, content = "";
for(i = 0; i < 100; i += 1) {
    content += i + ",";
}
document.getElementById("result").innerHTML += content;

/*antipttern*/
var padding = document.getElementById("result").style.padding,
    margin = document.getElementById("result").style.margin;

/*Better*/
var style = document.getElementById("result").style,
    padding = style.padding,
    margin = style.margin;

/*Better*/
document.querySelector("ul .selected");
document.querySelectorAll("#widget .class"); //更快，但>IE8

/*antipttern*/
var p, t;
p = document.createElement('p');
t = document.createTextNode('first paragraph');
p.appendChild(t);
document.body.appendChild(p);

p = document.createElement('p');
t = document.createTextNode('second paragraph');
p.appendChild(t);
document.body.appendChild(p);

/*Better*/
var p, t, frag;
frag = document.createDocumentFragment();  //使用document fragment是一种更好的方式
p = document.createElement('p');
t = document.createTextNode('first paragraph');
p.appendChild(t);
frag.appendChild(p);

p = document.createElement('p');
t = document.createTextNode('second paragraph');
p.appendChild(t);
frag.appendChild(p);

document.body.appendChild(frag);

/**当你试图更新原有dom时,复制出一份进行操作，然后替换原来的方式更好**/
var oldnode = document.getElementById('result'),
    clone = oldnode.cloneNode(true);

    //work with the clone ...

    //when you're ok
oldnode.parentNode.replaceChild(clone, oldnode);


//Events
/**示例**/
var b = document.getElementById('clickme');
if (document.addEventListener) { //W3C
    b.addEventListener('click', myHandler, false);
} else if (document.attachEvent) { //IE
    b.attachEvent('onclick', myHandler);
} else { 
    b.onclick = myHandler;
}

function myHandler (e) {
    var src, parts;
    e = e || window.event;
    src = e.target || e.srcElement;

    parts = src.innerHTML.split(": ");
    parts[1] = parseInt(parts[1], 10) + 1;
    src.innerHTML = parts[0] + ": " + parts[1];

    //no bubble
    if (typeof e.stopPropagation === 'function') {
        e.stopPropagation();
    }
    if (typeof e.cancelBubble !== "undefined") {
        e.cancelBubble = true;
    }

    //prevent default action
    if (typeof e.preventDefault === "function") {
        e.preventDefault();
    }
    if(typeof e.returnValue !== "undefined") {
        e.returnValue = false;
    }
 
}

//Web Workers
var ww = new Worker('my_web_worker.js');
ww.onmessage = function(event) {
    document.body.innerHTML += "<p>message from the background thread: " + event.data + "</p>";
}

var end = 1e8, temp = 1;
postMessage('hello there');

while(end) {
    end -= 1;
    tmp += end;
    if (end === 5e7) {
        postMessage('halfway three, "temp" is now ' + tmp);
    }
}

postMessage('all done');


//XMLTttpRequest
var i, xhr, activeXids = [
    'MSXML2.XMLHTTP.3.0',
    'MSXML2.XMLHTTP',
    'Microsoft.XMLHTTP'
];

if (typeof XMLHttpRequest === "function") {
    xhr = new XMLHttpRequest();
} else {
    for(i = 0; i < activeXids.length; i += 1) {
        try {
            xhr = new ActiveXObject(activeXids[i]);
            break;
        } catch(e) {

        }
    }
}
xhr.onreadystatechange = function () {
    if(xhr.readyState !== 4) {
        return false;
    }
    if(xhr.status !== 200) {
        alert("Error, status code: " + xhr.status);
        return false;
    }
    document.body.innerHTML = "<pre>" + xhr.responseText + "</pre>";
};

xhr.open("GET", "page.html",  true);
xhr.send("");


//几种优化处理方式
1.合并js文件
2.压缩js
3.可已在.htaccess中增加
    AddOutputFilterByType DEFAULT text/html text/css text/plain text/xml application/javascript application/json
4.<!--end of chunk #1-->
  <!--end of chunk #2-->能将页面分块
5.动态<script>加载
    var script = document.createElement("script");
    script.src = "all.js";
    document.documentElement.firstChild.appendChild(script);
6.