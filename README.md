# vue-photo-preview

> \"基于photoswipe的vue图片预览插件\"

## 说明
1.简化了photoswipe的默认设置    
2.取消了图片需设定尺寸的要求    
3.默认关闭了分享按钮   
4.简化了html结构   

## 使用
``` bash
# 安装
npm install vue-photo-preview --save

# 引入
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

# umd
<link rel="stylesheet" type="text/css" href="路径/dist/skin.css"/>

<script src="路径/dist/vue-photo-preview.js" type="text/javascript" charset="utf-8"></script>

# html
//在img标签添加preview属性
<img src="xxx.jpg" preview preview-text="描述文字">

//分组
<img src="xxx.jpg" preview="1" preview-text="描述文字">
<img src="xxx.jpg" preview="1" preview-text="描述文字">

<img src="xxx.jpg" preview="2" preview-text="描述文字">
<img src="xxx.jpg" preview="2" preview-text="描述文字">
```

