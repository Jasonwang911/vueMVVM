function Vue( options = {} ) {
    this.$options = options;
    // this._data;
    var data = this._data = this.$options.data;
    // 监听 data 的变化
    observe(data);
    // 实现代理  this.a 代理到 this._data.a
    for(let name in data) {
        Object.defineProperty( this, name, {
            enumerable: true,
            get() {
                // this.a 获取的时候返回 this._data.a
                return this._data[name];   
            },
            set(newVal) {
                // 设置 this.a 的时候相当于设置  this._data.a
                this._data[name] = newVal;
            }
        })
    }
    // 实现魔板编译  
    new Compile(this.$options.el, this)
}

// el:当前Vue实例挂载的元素， vm：当前Vue实例上data，已代理到 this._data
function Compile(el, vm) {
    // $el  表示替换的范围
    vm.$el = document.querySelector(el);
    let fragment = document.createDocumentFragment();
    // 将 $el 中的内容移到内存中去
    while( child = vm.$el.firstChild ) {
        fragment.appendChild(child);
    }
    replace(fragment);
    // 替换{{}}中的内容 
    function replace(fragment) {
        Array.from(fragment.childNodes).forEach( function (node) {
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/;
            // 当前节点是文本节点并且通过{{}}的正则匹配
            if(node.nodeType === 3 && reg.test(text)) {
                console.log(RegExp.$1);  // a.a b
                let arr = RegExp.$1.split('.');   // [a,a] [b]
                let val = vm;
                arr.forEach( function(k) {
                    // 循环层级
                    val = val[k];
                })
                // 赋值
                node.textContent = text.replace(reg, val);
            }
            vm.$el.appendChild(fragment)
            // 如果当前节点还有子节点，进行递归操作
            if(node.childNodes) {
                replace(node);
            }
        })
    }
}
 
function Observe(data) {
    for(let key in data) {
        let val = data[key];
        observe(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            get() {
                return val;
            },
            set(newVal) {
                if(newVal === val) {
                    return;
                }
                // 设置值的时候触发
                val = newVal;
                // 实现赋值后的对象监测功能
                observe(newVal);
            }
        })
    }
}

// 观察数据，给data中的数据object.defineProperty
function observe(data) {
    if(typeof data !== 'object') {
        return;
    }
    return new Observe(data);
}