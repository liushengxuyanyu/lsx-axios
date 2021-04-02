## lsx-axios
  基于Axios的二次封装

## 仓库地址

[仓库地址](https://github.com/liushengxuyanyu/lsx-axios.git)

## npm地址
[npm地址](https://www.npmjs.com/package/lsx-axios)

## 支持功能

1. 提供了基础的**axios原生api**功能。
2. 支持**防止重复请求**， 自动监测重复请求，并处理重复请求。
3. 支持**主动取消请求**。
4. 兼容不同系统因**baseUrl**和**url**引起的完整路径格式问题。
5. 支持`Vue`插件方式**和**普通引入两种方式，用以支持不同使用场景。
6. 支持根据自身业务，**自定义axios初始化配置开发**，包括`timeout`、`baseURL`, `response`是否完整返回等配置。
7. 支持重写请求、响应拦截器。
8. 支持并发请求。

## 涉及第三方包和文件

1. **axios**：http 请求工具库。
2. **qs**：解析序列化参数。

## 文件结构
```
    ├── _axios.js        -- 对外暴露的_axios对象，内置get、post、cancelMap、初始化配置等方法
    ├── _base.js         -- 请求库核心，请求拦截、响应等
    ├── _utils.js        -- 涉及工具方法
    └── CancelMap.js     -- 继承于Map的取消重复工具类
    └── index.js     -- 入口文件
```

## 安装
```bash 
npm install lsx-axios --save
```


## 使用示例

main.js 示例：在主入口引入`lsx-/axios`

```javascript
/** main.js */

import _axios from 'lsx-axios'

// 初始化配置
_axios.initDefaultConfig({
  baseURL: 'http://xxx',
  timeout: 10000
  ...
})

// 可根据自身业务情况重写请求、响应拦截器（重写后，取消重复请求功能失效）
_axios.overrideRequestInterceptor(
  (config) => {
    // ...处理请求拦截逻辑
    return response
  }, 
  (error) => {
    // ...处理拦截报错逻辑
    Promise.reject(error)
  }
)

_axios.overrideResponseInterceptor(
  (response) => {
    // ...处理响应拦截逻辑
    return response
  }, 
  (error) => {
    // ...处理拦截报错逻辑
    Promise.reject(error)
  }
)

// 可插件方式注入
Vue.use(_axios)


```

测试App.vue

```javascript
/** App.vue */
<template>
  <div id="app">
    <div>
      <h3>普通测试</h3>
      <button @click="postClick">post普通测试</button>
      <button @click="getClick">get普通测试</button>
    </div>
    <div>
      <h3>开启response测试</h3>
      <button @click="getClick1">返回 response测试</button>
    </div>
    <div>
      <h3>超时测试</h3>
      <button @click="getClick2">超时测试</button>
    </div>
    <div>
      <h3>不同baseURL测试</h3>
      <button @click="getClick3">ASM接口测试</button>
    </div>
    <div>
      <h3>并发测试</h3>
      <button @click="getClick4">并发测试</button>
    </div>
    
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  methods: {
    async getClick() {
      let res = await this._axios.get('/business/tagMarket/getTagCateList', {dimensionId: 17})
      console.log(res)
    },
    async postClick() {
      let params = {"cateCodes":[],"keyWord":"","authStatus":"","operateType":1,"orderType":"","sortType":"","updateCycle":"","pageNum":1,"pageSize":20,"roleType":"","userErp":"","dimensionId":17}
      let res = await this._axios.post('/business/tagMarket/searchTagMarket', params)
      console.log(res)
    },
    async getClick1() {
      let res = await this._axios.get('/business/tagMarket/getTagCateList', {dimensionId: 17}, {isResponseData: false})
      console.log(res)
    },
    async getClick2() {
      this._axios.get('/business/tagMarket/getTagCateList', {dimensionId: 17}, {timeout: 10})
        .then((res) => {
          console.log(res)    
        }).catch((err) => {
          console.log('--get', err)
        });
    },
    async getClick3() {
      // window.location.hash='edit' + Math.random()
      // window.location.href='http://ds.jdd.com:8080?a=' + Math.random()
      let baseURL = 'http://dev-ocean-asm-core.jdd.com/'
      // let res = await this._axios.post('/sys/query/user', {}, {baseURL})
      this._axios.post('/sys/query/user1', {}, {baseURL}).then((res) => {
        console.log(res, '------aaa')  
      }).catch((err) => {
        console.log(err, 'page')
      });
    },
    async getClick4() {
      let params = {"cateCodes":[],"keyWord":"","authStatus":"","operateType":1,"orderType":"","sortType":"","updateCycle":"","pageNum":1,"pageSize":20,"roleType":"","userErp":"","dimensionId":17}
      this._axios.all([this._axios.get('/business/tagMarket/getTagCateList', {dimensionId: 17}), this._axios.post('/business/tagMarket/searchTagMarket', params)])
        .then((res) => {
          console.log(...res, '1111')  
        }).catch((err) => {
          console.log(err, '2222')
        });
    }
  }
}
</script>

```

路由全局钩子，需要处理页面切换取消请求操作。
> ps. 目前该版本，重写拦截器后此功能失效。

```javascript
/** router.js  */
router.beforeEach((to, from, next) => {
  // 
  _axios.cancelMap.clearRequest()
  next()
})
```

## API

### _axios.initDefaultConfig
> 全局初始化配置 ps: 超时error.status为408
```javascript
  _axios.initDefaultConfig({
    baseURL,
    timeout
    ...
  })
```

### _axios.overrideRequestInterceptor
> 重写请求拦截器
```javascript
  _axios.overrideRequestInterceptor(
    (config) => {
      // ...处理请求拦截逻辑
      return response
    }, 
    (error) => {
      // ...处理拦截报错逻辑
      Promise.reject(error)
    }
  )
```

### _axios.overrideResponseInterceptor
> 重写响应拦截器
```javascript
  _axios.overrideResponseInterceptor(
    (config) => {
      // ...处理请求拦截逻辑
      return response
    }, 
    (error) => {
      // ...处理拦截报错逻辑
      Promise.reject(error)
    }
  )
```
### _axios.get
> get请求
```javascript
  // url: 请求地址。必传
  // data: 参数。非必传
  // config: { 配置项。非必传
  //   baseUrl,
  //   timeout,
  //   isResponseData
  //   ...
  // }
  _axios.get(url, data, config)
```

### _axios.post
> post请求
```javascript
  // url: 请求地址。必传
  // data: 参数。非必传
  // config: { 配置项。非必传
  //   baseUrl,
  //   timeout,
  //   isResponseData
  //   ...
  // }
  _axios.post(url, data, config)
```

### _axios.postFormData
> post formData格式请求，函数内部已处理好`Content-Type` 和 参数序列化
```javascript
  // url: 请求地址。必传
  // data: 参数。非必传
  // config: { 配置项。非必传
  //   baseUrl,
  //   timeout,
  //   isResponseData
  //   ...
  // }
  _axios.postFormData(url, data, config)
```

### _axios.all
> 并发请求
```javascript
   // requestList: 并发请求列表。必传
  _axios.all(requestList)
```

### _axios.cancelMap
> 取消请求map 主动取消之前所有请求: 在切换页面时（或路由钩子中）调用即可
```javascript
  _axios.cancelMap.clearRequest()
```


