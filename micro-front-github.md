[TOC]



# 微前端

## 微前端概述

### 什么是微前端

微前端是一种软件架构，可以将前端应用拆解成一些更小的能够独立开发部署的微型应用，然后再将这 些微应用进行组合使其成为整体应用的架构模式。 

微前端架构类似于组件架构，但不同的是，组件不能独立构建和发布，但是微前端中的应用是可以的。 

微前端架构与框架无关，每个微应用都可以使用不同的框架。

![image-20220404203740079](微前端.assets/image-20220404203740079.png)



### 微前端的价值

1. 增量迁移

   迁移是一项非常耗时且艰难的任务，比如有一个管理系统使用 AngularJS 开发维护已经有三年时 间，但是随时间的推移和团队成员的变更，无论从开发成本还是用人需求上，AngularJS 已经不能 满足要求，于是团队想要更新技术栈，想在其他框架中实现新的需求，但是现有项目怎么办？直接 迁移是不可能的，在新的框架中完全重写也不太现实。 

   使用微前端架构就可以解决问题，在保留原有项目的同时，可以完全使用新的框架开发新的需求， 然后再使用微前端架构将旧的项目和新的项目进行整合。这样既可以使产品得到更好的用户体验， 也可以使团队成员在技术上得到进步，产品开发成本也降到的最低。

2. 独立发布

   在目前的单页应用架构中，使用组件构建用户界面，应用中的每个组件或功能开发完成或者bug修 复完成后，每次都需要对整个产品重新进行构建和发布，任务耗时操作上也比较繁琐。

   在使用了微前端架构后，可以将不能的功能模块拆分成独立的应用，此时功能模块就可以单独构建 单独发布了，构建时间也会变得非常快，应用发布后不需要更改其他内容应用就会自动更新，这意 味着你可以进行频繁的构建发布操作了。

3. 允许单个团队做出技术决策

   因为微前端构架与框架无关，当一个应用由多个团队进行开发时，每个团队都可以使用自己擅长的 技术栈进行开发，也就是它允许适当的让团队决策使用哪种技术，从而使团队协作变得不再僵硬。

   

![image-20220405200655056](微前端.assets/image-20220405200655056.png)

 **微前端的使用场景：**

1. 拆分巨型应用，使应用变得更加可维护
2. 兼容历史应用，实现增量开发



### 如何实现微前端

1. 多个微应用如何进行组合 ?

   在微前端架构中，除了存在多个微应用以外，还存在一个容器应用，每个微应用都需要被注册到容 器应用中。 

   微前端中的每个应用在浏览器中都是一个独立的 JavaScript 模块，通过模块化的方式被容器应用启 动和运行。

   使用模块化的方式运行应用可以防止不同的微应用在同时运行时发生冲突。

1. 在微应用中如何实现路由 ？

   在微前端架构中，当路由发生变化时，容器应用首先会拦截路由的变化，根据路由匹配微前端应 用，当匹配到微应用以后，再启动微应用路由，匹配具体的页面组件。

1. 微应用与微应用之间如何实现状态共享 ?

   在微应用中可以通过发布订阅模式实现状态共享，比如使用 RxJS

1. 微应用与微应用之间如何实现框架和库的共享？

   通过 import-map 和 webpack 中的 externals 属性。

   

## Systemjs 模块化解决方案

### 概述

在微前端架构中，微应用被打包为模块，但浏览器不支持模块化，需要使用 systemjs 实现浏览器中的模 块化。 

systemjs 是一个用于实现模块化的 JavaScript 库，有属于自己的模块化规范。 

在开发阶段我们可以使用 ES 模块规范，然后使用 webpack 将其转换为 systemjs 支持的模块。



### 体验

通过 webpack 将 react 应用打包为 systemjs 模块，在通过 systemjs 在浏览器中加载模块

```bash
npm install webpack@5.17.0 webpack-cli@4.4.0 webpack-dev-server@3.11.2 html-webpackplugin@4.5.1 @babel/core@7.12.10 @babel/cli@7.12.10 @babel/preset-env@7.12.11 @babel/preset-react@7.12.10 babel-loader@8.2.2
```

```json
// package.json
{
	"name": "systemjs-react",
	"scripts": {
		"start": "webpack serve"
	},
	"dependencies": {
		"@babel/cli": "^7.12.10",
		"@babel/core": "^7.12.10",
		"@babel/preset-env": "^7.12.11",
		"@babel/preset-react": "^7.12.10",
		"babel-loader": "^8.2.2",
		"html-webpack-plugin": "^4.5.1",
		"webpack": "^5.17.0",
		"webpack-cli": "^4.4.0",
		"webpack-dev-server": "^3.11.2"
	}
}
```

```js
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "build"),
    filename: "index.js",
    libraryTarget: "system",
  },
  devtool: "source-map",
  devServer: {
    port: 9000,
    contentBase: path.join(__dirname, "build"),
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/react"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: "./src/index.html",
    }),
  ],
  externals: ["react", "react-dom", "react-router-dom"],
};
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>systemjs-react</title>
    <script type="systemjs-importmap">
      {
        "imports": {
          "react": "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js",
          "react-dom": "https://cdn.jsdelivr.net/npm/react-dom/umd/reactdom.production.min.js",
          "react-router-dom": "https://cdn.jsdelivr.net/npm/react-routerdom@5.2.0/umd/react-router-dom.min.js"
        }
      }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/systemjs@6.8.0/dist/system.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      System.import("./index.js");
    </script>
  </body>
</html>
```



## 微前端框架 single-spa

### single-spa 概述

single-spa 是一个实现微前端架构的框架。 

在 single-spa 框架中有三种类型的微前端应用：

1. single-spa-application / parcel：微前端架构中的微应用，可以使用 vue、react、angular 等框 架。
2. single-spa root config：创建微前端容器应用。
3. utility modules：公共模块应用，非渲染组件，用于跨应用共享 javascript 逻辑的微应用。



### 创建容器应用

1. 安装 single-spa 脚手架工具： `npm install create-single-spa@2.0.3 -g`

2. 创建微前端应用目录： `mkdir workspace && cd "$_"`

3. 创建微前端容器应用： `create-single-spa`

   1. 应用文件夹填写 container

   2. 应用选择 single-spa root config

   3. 组织名称填写 study

      组织名称可以理解为团队名称，微前端架构允许多团队共同开发应用，组织名称可以标识应用 由哪个团队开发。

      应用名称的命名规则为 `@组织名称/应用名称` ，比如 `@study/todos`

4. 启动应用： `npm start`

5. 访问应用： `localhost:9000`

6. 默认代码解析

   1. Root-config.js

      ```js
      // workspace/container/src/study-root-config.js
      import { registerApplication, start } from "single-spa";
      /*
      注册微前端应用
      1. name: 字符串类型, 微前端应用名称 "@组织名称/应用名称"
      2. app: 函数类型, 返回 Promise, 通过 systemjs 引用打包好的微前端应用模块代码
      (umd)
      3. activeWhen: 路由匹配时激活应用
      */
      registerApplication({
        name: "@single-spa/welcome",
        app: () =>
          System.import(
            "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
          ),
        activeWhen: ["/"],
      });
      ```

      ```js
      // start 方法必须在 single spa 的配置文件中调用
      // 在调用 start 之前, 应用会被加载, 但不会初始化, 挂载或卸载.
      start({
        // 是否可以通过 history.pushState() 和 history.replaceState() 更改触发 single-spa 路由
        // true 不允许 false 允许
        urlRerouteOnly: true,
      });
      ```

   2. index.ejs

      ```html
      <!-- 导入微前端容器应用 -->
      <script>
        System.import("@study/root-config");
      </script>
      <!--
        import-map-overrides 可以覆盖导入映射
        当前项目中用于配合 single-spa Inspector 调试工具使用.
        可以手动覆盖项目中的 JavaScript 模块加载地址, 用于调试.
        -->
      <import-map-overrides-full show-when-local-storage="devtools" dev-libs>
      </import-map-overrides-full>
      ```

      ```html
      <!-- 模块加载器 -->
      <script src="https://cdn.jsdelivr.net/npm/systemjs@6.8.0/dist/system.min.js"></script>
      <!-- systemjs 用来解析 AMD 模块的插件 -->
      <script src="https://cdn.jsdelivr.net/npm/systemjs@6.8.0/dist/extras/amd.min.js"></script>
      <!-- 用于覆盖通过 import-map 设置的 JavaScript 模块下载地址 -->
      <script src="https://cdn.jsdelivr.net/npm/import-mapoverrides@2.2.0/dist/import-map-overrides.js"></script>
      <!-- 用于支持 Angular 应用 -->
      <script src="https://cdn.jsdelivr.net/npm/zone.js@0.10.3/dist/zone.min.js"></script>
      ```

      ```html
      <!-- single-spa 预加载 -->
      <link
        rel="preload"
        href="https://cdn.jsdelivr.net/npm/single-spa@5.8.3/lib/system/singlespa.min.js"
        as="script"
      />
      ```

      ```html
      <!-- JavaScript 模块下载地址 此处可放置微前端项目中的公共模块 -->
      <script type="systemjs-importmap">
        {
          "imports": {
            "single-spa": "https://cdn.jsdelivr.net/npm/singlespa@5.8.3/lib/system/single-spa.min.js"
          }
        }
      </script>
      ```



### 创建不基于框架的微应用

1. 应用初始化： `mkdir lagou && cd "$_"`

2. 配置 webpack

   ```js
   const { merge } = require("webpack-merge")
   const singleSpaDefaults = require("webpack-config-single-spa")
   module.exports = () => {
     const defaultConfig = singleSpaDefaults({
       // 组织名称
       orgName: "study",
       // 项目名称
       projectName: "lagou",
     });
     return merge(defaultConfig, {
       devServer: {
         port: 9001,
       },
     });
   };
   ```

3. 在 package.json 文件中添加应用启动命令

   ```json
   "scripts": {
   	"start": "webpack serve"
   }
   ```

4. 在应用入口文件中导出微前端应用所需的生命周期函数，生命周期函数必须返回 Promise

   ```js
   let lagouContainer = null;
   export const bootstrap = async function () {
     console.log("应用正在启动");
   };
   export const mount = async function () {
     console.log("应用正在挂载");
     lagouContainer = document.createElement("div");
     lagouContainer.innerHTML = "Hello Lagou";
     lagouContainer.id = "lagouContainer";
     document.body.appendChild(lagouContainer);
   };
   export const unmount = async function () {
     console.log("应用正在卸载");
     document.body.removeChild(lagouContainer);
   };
   ```

5. 在为前端容器应用中注册微前端应用

   ```js
   registerApplication({
   	name: "@study/lagou",
   	app: () => System.import("@study/lagou"),
   	activeWhen: ["/lagou"]
   })
   ```

6. 在模板文件中指定模块访问地址

   ```html
   <script type="systemjs-importmap">
     {
       "imports": {
         "@study/lagou": "//localhost:9001/study-lagou.js"
       }
     }
   </script>
   ```

7. 修改默认应用代码

   ```js
   // 注意: 参数的传递方式发生了变化, 原来是传递了一个对象, 对象中有三项配置, 现在是传递了三个参数;
   registerApplication(
     "@single-spa/welcome",
     () =>
       System.import(
         "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
       ),
     (location) => location.pathname === "/"
   );
   ```



### 创建基于 React 的微应用

1. 创建应用： `create-single-spa`

   1. 应用目录输入 todos
   2. 框架选择 react

2. 修改应用端口 && 启动应用

   ```json
   {
   	"scripts": {
   		"start": "webpack serve --port 9002",
   	}
   }
   ```

3. 注册应用，将 React 项目的入口文件注册到基座应用中

   ```js
   registerApplication({
   	name: "@study/todos",
   	app: () => System.import("@study/todos"),
   	activeWhen: ["/todos"]
   })
   ```

4. 指定微前端应用模块的引用地址

   ```html
   <!--
   在注册应用时 systemjs 引用了 @study/todos 模块, 所以需要配置该模块的引用地址
   -->
   <script type="systemjs-importmap">
     {
       "imports": {
         "@study/root-config": "//localhost:9000/study-root-config.js",
         "@study/todos": "//localhost:9002/study-todos.js"
       }
     }
   </script>
   ```

5. 指定公共库的访问地址

   默认情况下，应用中的 react 和 react-dom 没有被 webpack 打包， single-spa 认为它是公共库， 不应该单独打包。

   ```html
   <script type="systemjs-importmap">
     {
       "imports": {
         "single-spa": "https://cdn.jsdelivr.net/npm/singlespa@5.8.3/lib/system/single-spa.min.js",
         "react": "https://cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min.js",
         "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@17.0.1/umd/reactdom.production.min.js",
         "react-router-dom": "https://cdn.jsdelivr.net/npm/react-routerdom@5.2.0/umd/react-router-dom.min.js"
       }
     }
   </script>
   ```

6. 微前端 React 应用入口文件代码解析

   ```jsx
   // react、react-dom 的引用是 index.ejs 文件中 import-map 中指定的版本
   import React from "react";
   import ReactDOM from "react-dom";
   // single-spa-react 用于创建使用 React 框架实现的微前端应用
   import singleSpaReact from "single-spa-react";
   // 用于渲染在页面中的根组件
   import rootComponent from "./root.component";
   // 指定根组件的渲染位置
   const domElementGetter = () => document.getElementById("todosContainer");
   // 错误边界函数
   const errorBoundary = () => <div>发生错误时此处内容将会被渲染</div>;
   // 创建基于 React 框架的微前端应用, 返回生命周期函数对象
   const lifecycles = singleSpaReact({
     React,
     ReactDOM,
     rootComponent,
     domElementGetter,
     errorBoundary,
   });
   // 暴露必要的生命周期函数
   export const { bootstrap, mount, unmount } = lifecycles;
   ```

7. 路由配置

   ```jsx
   import React from "react";
   import { BrowserRouter, Switch, Route, Redirect, Link } from "react-routerdom";
   import Home from "./pages/Home";
   import About from "./pages/About";
   export default function Root(props) {
     return (
       <BrowserRouter basename="/todos">
         <div>{props.name}</div>
         <div>
           <Link to="/home">Home</Link>
           <Link to="/about">About</Link>
         </div>
         <Switch>
           <Route path="/home">
             <Home />
           </Route>
           <Route path="/about">
             <About />
           </Route>
           <Route path="/">
             <Redirect to="/home" />
           </Route>
         </Switch>
       </BrowserRouter>
     );
   }
   ```

8. 修改 webpack 配置

   ```js
   const { merge } = require("webpack-merge");
   const singleSpaDefaults = require("webpack-config-single-spa-react");
   module.exports = (webpackConfigEnv, argv) => {
     const defaultConfig = singleSpaDefaults({
       orgName: "study",
       projectName: "todos",
       webpackConfigEnv,
       argv,
     });
     return merge(defaultConfig, {
       externals: ["react-router-dom"],
     });
   };
   ```



### 创建基于 Vue 的微应用

1. 创建应用： `create-single-spa`

   1. 项目文件夹填写 realworld
   2. 框架选择 Vue
   3. 生成 Vue 2 项目

2. 提取 vue && vue-router

   ```js
   // vue.config.js
   module.exports = {
     chainWebpack: (config) => {
       config.externals(["vue", "vue-router"]);
     },
   };
   ```

   ```html
   <script type="systemjs-importmap">
     {
       "imports": {
         "vue": "https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js",
         "vue-router": "https://cdn.jsdelivr.net/npm/vue-router@3.0.7/dist/vuerouter.min.js"
       }
     }
   </script>
   ```

3. 修改启动命令 && 启动应用

   ```json
   "scripts": {
   	"start": "vue-cli-service serve --port 9003",
   }
   ```

4. Vue 应用配置路由

   ```js
   import Vue from "vue";
   import VueRouter from "vue-router";
   import singleSpaVue from "single-spa-vue";
   import App from "./App.vue";
   Vue.use(VueRouter);
   Vue.config.productionTip = false;
   // 路由组件
   const Foo = { template: "<div>foo</div>" };
   const Bar = { template: "<div>bar</div>" };
   // 路由规则
   const routes = [
     { path: "/foo", component: Foo },
     { path: "/bar", component: Bar },
   ];
   // 路由实例
   const router = new VueRouter({ routes, mode: "history", base: "/realworld" });
   const vueLifecycles = singleSpaVue({
     Vue,
     // 应用配置
     appOptions: {
       // 路由
       router,
       // 渲染组件
       render(h) {
         return h(App, {
           // 向组件中传递的数据
           props: {
             name: this.name,
             mountParcel: this.mountParcel,
             singleSpa: this.singleSpa,
           },
         });
       },
     },
   });
   // 导出生命周期函数
   export const bootstrap = vueLifecycles.bootstrap;
   export const mount = vueLifecycles.mount;
   export const unmount = vueLifecycles.unmount;
   ```

   ```vue
   <template>
     <div id="app">
       <h1>{{ name }}</h1>
       <p>
         <router-link to="/foo">Go to Foo</router-link>
         <router-link to="/bar">Go to Bar</router-link>
       </p>
       <router-view></router-view>
     </div>
   </template>
   <script>
   export default {
     name: "App",
     props: ["name"]
   }
   </script>
   ```



### 创建 Parcel 应用

Parcel 用来创建公共 UI，涉及到跨框架共享 UI 时需要使用 Parcel。

Parcel 的定义可以使用任何 single-spa 支持的框架，它也是单独的应用，需要单独启动，但是它不关联 路由。

Parcel 应用的模块访问地址也需要被添加到 import-map 中，其他微应用通过 System.import 方法进行 引用。

需求：创建 navbar parcel，在不同的应用中使用它。

1. 使用 React 创建 Parcel 应用 `create-single-spa`

   ```js
   import React from "react";
   import ReactDOM from "react-dom";
   import singleSpaReact from "single-spa-react";
   import Root from "./root.component";
   const lifecycles = singleSpaReact({
     React,
     ReactDOM,
     rootComponent: Root,
     errorBoundary(err, info, props) {
       // Customize the root error boundary for your microfrontend here.
       return null;
     },
   });
   export const { bootstrap, mount, unmount } = lifecycles;
   ```

   ```jsx
   export default function Root(props) {
     return (
       <BrowserRouter>
         <div>
           <Link to="/">@single-spa/welcome</Link>{" "}
           <Link to="/lagou">@study/lagou</Link>{" "}
           <Link to="/todos">@study/todos</Link>{" "}
           <Link to="/realworld">@study/realworld</Link>
         </div>
       </BrowserRouter>
     );
   }
   ```

2. 在 webpack 配置文件中去除 react-router-dom

   ```js
   externals: ["react-router-dom"]
   ```

3. 指定端口，启动应用

   ```json
   "scripts": {
   	"start": "webpack serve --port 9004",
   }
   ```

4. 在模板文件中指定应用模块地址

   ```html
   {
   	"imports": {
   		"@study/navbar": "//localhost:9004/study-navbar.js"
   	}
   }
   ```

5. 在 React 应用中使用它

   ```jsx
   import Parcel from "single-spa-react/parcel"
   <Parcel config={System.import("@study/navbar")} />
   ```

6. 在 Vue 应用中使用它

   ```vue
   <Parcel :config="parcelConfig" :mountParcel="mountParcel" />
   <script>
   import Parcel from "single-spa-vue/dist/esm/parcel"
   import { mountRootParcel } from "single-spa"
   export default {
     components: {
       Parcel
     },
     data() {
       return {
         parcelConfig: window.System.import("@study/navbar"),
         mountParcel: mountRootParcel
       }
     }
   }
   </script>
   ```



###  创建 utility modules

  用于放置跨应用共享的 JavaScript 逻辑，它也是独立的应用，需要单独构建单独启动。

1. 创建应用： create-single-spa

   1. 文件夹填写 `tools`
   2. 应用选择 `in-browser utility module (styleguide, api cache, etc)`

2. 修改端口，启动应用

   ```js
   "scripts": {
   	"start": "webpack serve --port 9005",
   }
   ```

3. 应用中导出方法

   ```js
   export function sayHello(who) {
   	console.log(`%c${who} Say Hello`, "color: skyblue")
   }
   ```

4. 在模板文件中声明应用模块访问地址

   ```html
   <script type="systemjs-importmap">
   {
   	"imports": {
   		"@study/tools": "//localhost:9005/study-tools.js"
   	}
   }
   </script>
   ```

5. 在 React 应用中使用该方法

   ```jsx
   import React, { useEffect, useState } from "react";
   function useToolsModule() {
     const [toolsModule, setToolsModule] = useState();
     useEffect(() => {
       System.import("@study/tools").then(setToolsModule);
     }, []);
     return toolsModule;
   }
   const Home = () => {
     const toolsModule = useToolsModule();
     if (toolsModule) toolsModule.sayHello("todos");
     return <div>Todos home works</div>;
   };
   export default Home;
   ```

6. 在 Vue 应用中使用该方法

   ```vue
   <h1 @click="handleClick">{{ name }}</h1>
   ```

   ```js
   async handleClick() {
   	let toolsModule = await window.System.import("@study/tools")
   	toolsModule.sayHello("realworld")
   }
   ```

   

### 实现跨应用通信

跨应用通信可以使用 RxJS，因为它无关于框架，也就是可以在任何其他框架中使用。

1. 在 index.ejs 文件中添加 rxjs 的 import-map

   ```html
   {
   	"imports": {
   		"rxjs": "https://cdn.jsdelivr.net/npm/rxjs@6.6.3/bundles/rxjs.umd.min.js"
   	}
   }
   ```

2. 在 utility modules 中导出一个 ReplaySubject，它可以广播历史消息，就算应用是动态加载进来 的，也可以接收到数据。

   ```js
   import { ReplaySubject } from "rxjs"
   export const sharedSubject = new ReplaySubject()
   ```

3. 在 React 应用中订阅它

   ```jsx
   useEffect(() => {
     let subjection = null;
     if (toolsModule) {
       subjection = toolsModule.sharedSubject.subscribe(console.log);
     }
     return () => subjection.unsubscribe();
   }, [toolsModule]);
   ```

4. 在 Vue 应用中订阅它

   ```js
   async mounted() {
   	let toolsModule = await window.System.import("@study/tools")
   	toolsModule.sharedSubject.subscribe(console.log)
   }
   ```

   

### Layout Engine

允许使用组件的方式声明顶层路由，并且提供了更加便捷的路由API用来注册应用。

1. 下载布局引擎 `npm install single-spa-layout@1.3.1`

2. 构建路由

   ```html
   <template id="single-spa-layout">
   	<single-spa-router>
   		<application name="@study/navbar"></application>
   		<route default>
   			<application name="@single-spa/welcome"></application>
   		</route>
   		<route path="lagou">
   			<application name="@study/lagou"></application>
   		</route>
   		<route path="todos">
   			<application name="@study/todos"></application>
   		</route>
   		<route path="realworld">
   			<application name="@study/realworld"></application>
   		</route>
   	</single-spa-router>
   </template>
   ```

   ```html
   <script type="systemjs-importmap">
   {
   	"imports": {
   		"@single-spa/welcome": "https://unpkg.com/single-spawelcome/dist/single-spa-welcome.js"
   	}
   }
   </script>
   ```

3. 获取路由信息 && 注册应用

   ```js
   import { registerApplication, start } from "single-spa";
   import { constructApplications, constructRoutes } from "single-spa-layout";
   // 获取路由配置对象
   const routes = constructRoutes(document.querySelector("#single-spa-layout"));
   // 获取路由信息数组
   const applications = constructApplications({
     routes,
     loadApp({ name }) {
       return System.import(name);
     },
   });
   // 遍历路由信息注册应用
   applications.forEach(registerApplication);
   start({
     urlRerouteOnly: true,
   });
   ```

   

## Module Federation

### 模块联邦概述

Module Federation 即为模块联邦，是 Webpack 5 中新增的一项功能，可以实现跨应用共享模块。

![image-20220406211143212](微前端.assets/image-20220406211143212.png)



### 快速上手

**需求**

通过模块联邦在容器应用中加载微应用。

![image-20220406211238659](微前端.assets/image-20220406211238659.png)



**应用结构**

```bash
products
	├── package-lock.json
	├── package.json
	├── public
	│ └── index.html
	├── src
	│ └── index.js
	└── webpack.config.js
```



**应用初始化**

1. 在入口 JavaScript 文件中加入产品列表

   ```js
   import faker from "faker"
   let products = ""
   for (let i = 1; i <= 5; i++) {
   	products += `<div>${faker.commerce.productName()}</div>`
   }
   document.querySelector("#dev-products").innerHTML = products
   ```

2. 在入口 html 文件中加入盒子

   ```html
   <div id="dev-products"></div>
   ```

3. webpack 配置

   ```js
   const HtmlWebpackPlugin = require("html-webpack-plugin");
   module.exports = {
     mode: "development",
     devServer: {
       port: 8081,
     },
     plugins: [
       new HtmlWebpackPlugin({
         template: "./public/index.html",
       }),
     ],
   };
   ```

4. 添加应用启动命令

   ```json
   "scripts": {
   	"start": "webpack serve"
   }
   ```

5. 通过 copy 的方式创建 container 和 cart



**Module Federation**

通过配置模块联邦实现在容器应用中加载产品列表微应用。

1. 在产品列表微应用中将自身作为模块进行导出

   ```js
   // webpack.config.js
   // 导入模块联邦插件
   const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
   // 将 products 自身当做模块暴露出去
   new ModuleFederationPlugin({
     // 模块文件名称, 其他应用引入当前模块时需要加载的文件的名字
     filename: "remoteEntry.js",
     // 模块名称, 具有唯一性, 相当于 single-spa 中的组织名称
     name: "products",
     // 当前模块具体导出的内容
     exposes: {
       "./index": "./src/index",
     },
   });
   // 在容器应用中要如何引入产品列表应用模块?
   // 1. 在容器应用中加载产品列表应用的模块文件
   // 2. 在容器应用中通过 import 关键字从模块文件中导入产品列表应用模块
   ```

2. 在容器应用的中导入产品列表微应用

   ```js
   // webpack.config.js
   // 导入模块联邦插件
   const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
   new ModuleFederationPlugin({
     name: "container",
     // 配置导入模块映射
     remotes: {
       // 字符串 "products" 和被导入模块的 name 属性值对应
       // 属性 products 是映射别名, 是在当前应用中导入该模块时使用的名字
       products: "products@http://localhost:8081/remoteEntry.js",
     },
   });
   ```

   ```js
   // src/index.js
   // 因为是从另一个应用中加载模块, 要发送请求所以使用异步加载方式
   import("products/index").then(products => console.log(products))
   ```

   通过上面这种方式加载在写法上多了一层回调函数, 不爽, 所以一般都会在 src 文件夹中建立 bootstrap.js，在形式上将写法变为同步

   ```js
   // src/index.js
   import('./bootstrap.js')
   ```

   ```js
   // src/bootstrap.js
   import "products/index"
   ```



**文件打包加载分析**

1. Products 应用打包分析

   ![image-20220406211749260](微前端.assets/image-20220406211749260.png)

2. Container 应用打包分析

   ![image-20220406211817583](微前端.assets/image-20220406211817583.png)

3. 文件加载顺序分析
   
   ![image-20220406211915120](微前端.assets/image-20220406211915120.png)



**加载 Cart 微应用**

```js
// cart/webpack.config.js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
new ModuleFederationPlugin({
  name: "cart",
  filename: "remoteEntry.js",
  exposes: {
    "./index": "./src/index",
  },
});
```

```js
// container/webpack.config.js
remotes: {
	cart: "cart@http://localhost:8082/remoteEntry.js"
}
```

```js
// container/bootstrap.js
import "cart/index"
```

```html
<!-- container/index.html -->
<div id="dev-cart"></div>
```

注意：cart/index.html 和 products/index.html 仅仅是在开发阶段中各自团队使用的文件，而 container/index.html 是在开发阶段和生产阶段都要使用的文