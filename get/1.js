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