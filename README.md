# DesignPatterns
js学习设计模式记录
## 使用方式
将src/patterns中的.js文件粘贴到src/index.js  命令行运行：npm run dev即可运行代码。一旦运行之后，每次修改、保存index.js会自动重新编译。
## 博客地址
[js设计模式-单例模式（1）](https://www.jianshu.com/p/7bab4ba6c9af)
## js设计模式-单例模式（1）
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
