# utils 小工具包
自定义的一些工具函数，已经发布到npm，可以直接安装使用
## 工程中直接安装
```bash
npm install @jiangweijia/utils.js
```
## 工程中引入和使用
可以直接import使用，工具包在window上注册 $UTILS 对象
```javascript
import '@jiangweijia/utils.js'
const {lazyLoadImg} = window.$UTILS；
lazyLoadImg(".imglist img",0.5);
```
或者
```javascript
import $UTILS from '@jiangweijia/utils.js'
const {lazyLoadImg} = $UTILS;
lazyLoadImg(".imglist img",0.5);
```
也可以使用require
```javascript
const utils = require('@jiangweijia/utils.js');
const {lazyLoadImg} = utils
lazyLoadImg(".imglist img",0.5);
```
## 直接引入
可以下载/lib 目录下的 main.js 原文件，
或者整个下载 
```bash
npm install
npm build
```
使用dist文件夹的里面的utils.min.js,工具包在window上注册 $UTILS 对象
```html
<div class="imglist">
    <img src="defult.jpg" data-url="src.jgp" alt="">
</div>
<!-- 引入工具包 -->
<script src="utils.min.js"></script>
<script>
    const {lazyLoadImg} = window.$UTILS;
    lazyLoadImg(".imglist img",0.5);
</script>
```

## 工具函数
函数的用法可以在/out/index.html 中查看


