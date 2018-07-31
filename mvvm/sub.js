// 发布订阅模式   先订阅 再有发布   一个数组的队列  [fn1, fn2, fn3]

// 约定绑定的每一个方法，都有一个update属性
function Dep() {
    this.subs = [];
}
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
}

Dep.prototype.notify = function () {
    this.subs.forEach( sub => sub.update());
}

// Watch是一个类，通过这个类创建的实例都有update的方法ßß
function Watcher (fn) {
    this.fn = fn
}
Watcher.prototype.update = function() {
    this.fn();
}

let watcher = new Watcher( function () {
    console.log('开始了发布');
})

let dep = new Dep();
dep.addSub(watcher);
dep.addSub(watcher);
console.log(dep.subs);
dep.notify();     //  订阅发布模式其实就是一个数组关系，订阅就是讲函数push到数组队列，发布就是以此的执行这些函数 