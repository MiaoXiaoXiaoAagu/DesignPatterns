# DesignPatterns
js学习设计模式记录
## 使用方式
将src/patterns中的.js文件粘贴到src/index.js  命令行运行：npm run dev即可运行代码。一旦运行之后，每次修改、保存index.js会自动重新编译。
## 博客地址
[js设计模式-单例模式（1）](https://www.jianshu.com/p/7bab4ba6c9af)
[js设计模式-适配器模式、装饰器模式（2）](https://www.jianshu.com/p/22055a1340e8)

## 单例模式
**目的：** 让项目中仅存在一个SingleObj的实例，多次声明实例获取到的都是同一个实例，不会进行多次new。  
**实现思路：** SingleObj.getInstance()代替new SingleObj()来获取实例，以控制SingleObj仅有一个实例。
SingleObj.getInstance()的返回值每次都是同一个实例，所以SingleObj.getInstance()中储存着一个SingleObj的实例。所以利用闭包储存一个SingleObj实例
```js
//单例模式1
class SingleObj{
}
SingleObj.getInstance=(function(){
    const instance=new SingleObj()
    return function () {
        return instance
    }
})()
const ins1=SingleObj.getInstance()
const ins2=SingleObj.getInstance()
console.log(ins1===ins2)//true
```
上面的代码实现了单例模式，但是使用了自执行函数在SingleObj.getInstance被声明阶段就执行`new SingleObj()`。让getInstance即使没有被调用进行了SingleObj的实例化。造成了一开始不必要的资源浪费，所以需要将new SingleObj的操作滞后
```js
//单例模式2
class SingleObj{
}
SingleObj.getInstance=(function(){
    let instance=null
    return function () {
        if(!instance)
        {
            instance=new SingleObj()
        }
        return instance
    }
})()
const ins1=SingleObj.getInstance()
const ins2=SingleObj.getInstance()
console.log(ins1===ins2)//true
```
## 适配器模式
**使用场景：**
旧接口与使用者不兼容，中间添加一个转换接口。
当他人已完成的代码在格式上不满足新需求时，用适配器模式改变。
```js
class Adoptee{
    specificRequest(){
        return "德国插座"
    }
}
class Adapter {
    constructor(adoptee){
        this.adoptee=adoptee
    }
    request(){
        let info=this.adoptee.specificRequest()
        return `${info}-转换-中国插座`
    }
}
console.log(new Adapter(new Adoptee()).request())//德国插座-转换-中国插座

```
## 装饰器模式
**使用场景：** 旧的功能继续沿用，但是要在旧的功能上添加、修饰一些部分
**例子：** 原Circle类可以画一个圆，现要画圆，并且给这个圆添加边框
```js
class Circle{
    draw(){
        console.log("画一个圆")
    }
}
class Decorator{
    constructor(){
        this.circle=new Circle()
    }
    draw(){
        this.circle.draw()
        this.fillBorder()
    }
    fillBorder(){
        console.log("添加边框")
    }
}
new Decorator().draw()//画一个圆  添加边框
```

### es7装饰器介绍
装饰器语法可参考：[es6-装饰器](http://es6.ruanyifeng.com/#docs/decorator)  [JS 装饰器](https://segmentfault.com/a/1190000014495089)
#### 类装饰器
定义一个Demon的类，定义装饰器decorator1，`@decorator1`写在`calss Demon1`的前面
decorator1会获取到参数target,也就是当前的Demon1类。可以在decorator1这个函数中对Demon1的属性进行处理，如下在Demon1中添加一个静态属性`decorator="i am decorator"`
```js
@decorator1
class Demon1{
}
function decorator1(target) {
    target.decorator="i am decorator"
}
console.log(Demon1.decorator)//i am decorator
```

装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。装饰器的原理如下
```js
@decorator
class A{}
decorator(target){}
//相当于↓↓
class A{}
A=decorator(A)||A
```
#### 带参数的装饰器
```js
@decorator2("new decorator")
class Demon2{
}
function decorator2(newValue){
    return function (target) {
        target.decorator=newValue
    }
}
console.log(Demon2.decorator)//new decorator
```
`@decorator2("new decorator")`执行decorator2传参“new decorator”，并且在decorator2的内部返回不进行传参时定义的装饰器函数。
decorator2嵌套两层function，第一层用来传参，第二层是普通的装饰器函数
```js
@decorator2("new decorator")
class Demon2{
}
function decorator2(newValue){
    return function (target) {
        target.decorator=newValue
    }
}
console.log(Demon2.decorator)//new decorator
```
#### 常用装饰器 ：Mixin示例
Mixin相关知识点参考：[Mixin](https://www.cnblogs.com/snandy/archive/2013/05/24/3086663.html)

Mixin是JavaScript中用的最普遍的模式，几乎所有流行类库都会有Mixin的实现。
Mixin是掺合，混合，糅合的意思，即可以就任意一个对象的全部或部分属性拷贝到另一个对象上。
下面的例子中通过装饰器mixin将别的对象的属性、方法添加到Demon3中
assign知识点：[ES6之Object.assign()详解](https://blog.fundebug.com/2017/09/11/object-assign/)
```js
function mixin(list){
    return function (target) {
        Object.assign(target.prototype,...list)
    }
}
const append1={
    getAppend1Name(){
        console.log("append1")
    }
}

const append2={
    getAppend2Name(){
        console.log("append2")
    }
}
@mixin([ append1, append2])
class Demon3{

}
let demon3=new Demon3()
demon3.getAppend1Name()//append1
demon3.getAppend2Name()//append2
```
## 装饰方法
**readOnly 装饰器** 
装饰器总共接收三个参数`target,value,description`在下面例子中target是Demon4，value是getName，description是getName的属性描述符
设置属性描述符的writable为false，将getName属性设置为只读
```js
function readOnly(target,value,description) {
    description.writable=false
}

class Demon4 {
    constructor(){
        this.name="demon4"
    }
    @readOnly
    getName(){
        return this.name;
    }
}
const demon4=new Demon4()
demon4.getName=function () {//报错：Uncaught TypeError: Cannot assign to read only property 'getName' of object '#<Demon4>'
    console.log("change")
}
```
修改getName时会报错
![image.png](https://upload-images.jianshu.io/upload_images/8600360-26f3df8e1b445d36.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**log日志打印装饰器** 
以下日志打印装饰器在执行setName时打印出旧的name值与新的name值
通过description.value重写setName方法，使在调用原来的getName之前先console.log
```js
function  log(target,value,description) {
    const oldValue=description.value
    description.value=function (name) {
        console.log(`previous name:${this.name}  new name is:${name}`)
        oldValue.call(this,arguments)
    }
}

class Demon5{
    constructor(){
        this.name="demon5"
    }
    @log
    setName(name){
        this.name=name
    }
}
const demon5=new Demon5()
demon5.setName("DEMON5")//previous name:demon5  new name is:DEMON5
```
**建议不要手写装饰器，使用现成的装饰器库**[core-decorators.js](http://es6.ruanyifeng.com/#docs/decorator#core-decorators-js)

