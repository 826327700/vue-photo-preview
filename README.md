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
```
```
# 引入
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)
//或者 
//var option={....} option配置请查看 http://photoswipe.com/documentation/options.html
//Vue.use(preview,option)
```
```
# umd
<link rel="stylesheet" type="text/css" href="路径/dist/skin.css"/>

<script src="路径/dist/vue-photo-preview.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
	var options={
		fullscreenEl:false //关闭全屏按钮
	}
	
	Vue.use(vuePhotoPreview,options)
	
	new Vue({
		el:'#app'
	})
</script>
```
```
# html
//在img标签添加preview属性 preview值相同即表示为同一组
<img src="xxx.jpg" preview="0" preview-text="描述文字">

//分组
<img src="xxx.jpg" preview="1" preview-text="描述文字">
<img src="xxx.jpg" preview="1" preview-text="描述文字">

<img src="xxx.jpg" preview="2" preview-text="描述文字">
<img src="xxx.jpg" preview="2" preview-text="描述文字">
```
```
# 2018-05-17 更新
//如果图片是异步生成的，在图片数据更新后调用：
this.$previewRefresh()
```

## Options   
[插件配置文档](http://photoswipe.com/documentation/options.html) 

## DEMO   
[地址](https://826327700.github.io/vue-photo-preview/demo/)  

