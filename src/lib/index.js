import previewComponent from './preview.vue'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
let $preview
var vuePhotoPreview ={
	install (Vue,opts) {
        const Preview = Vue.extend(previewComponent)
        var opts=opts||{}
        if (!$preview) {
            $preview = new Preview({el: document.createElement('div')})
			document.body.appendChild($preview.$el)
		}
		let eventName,eventCallback
		Vue.prototype.$preview={
			self:null,
			on:(name,callback)=>{
				eventName=name
				eventCallback=callback
			}
		}
		Vue.mixin({
			data(){
				return {
					galleryElements:null,
					galleryPicLoading:false
				}
			},
			methods:{
				$previewRefresh(){
					setTimeout(() => {
						this.galleryElements = document.querySelectorAll('img[preview]');
						for(var i = 0, l = this.galleryElements.length; i < l; i++) {
							this.galleryElements[i].setAttribute('data-pswp-uid', i + 1);
							this.galleryElements[i].onclick = this.onThumbnailsClick;
						}
					}, 200);
					
				},
				onThumbnailsClick(e) {
					if(this.galleryPicLoading)return false;
					this.galleryPicLoading=true
					e = e || window.event;
					e.preventDefault ? e.preventDefault() : e.returnValue = false;

					var eTarget = e.target || e.srcElement;

					
					var thumbElements;
					var group = eTarget.getAttribute('preview')
					if(group) {
						thumbElements = document.querySelectorAll('img[preview="' + group + '"]')
					} else {
						thumbElements = document.querySelectorAll('img[preview]')
					}
					var clickedGallery = thumbElements;
					
					var index;

					for(var i = 0; i < clickedGallery.length; i++) {
						if(clickedGallery[i] === eTarget) {
							index = i;
							break;
						}
					}
					if(index >= 0) {
						this.openPhotoSwipe(index, clickedGallery);
						this.$emit('preview-open',e,eTarget.src)
					}
					return false;
				},
				async openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
					var pswpElement = document.querySelectorAll('.pswp')[0],
						gallery,
						options,
						items;

					var items = await this.parseThumbnailElements(galleryElement);
					options = {

						// galleryUID: galleryElement.getAttribute('data-pswp-uid'),

						getThumbBoundsFn: function(index) {
							var thumbnail = items[index].el,
								pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
								rect = thumbnail.getBoundingClientRect();
							return {
								x: rect.left,
								y: rect.top + pageYScroll,
								w: rect.width
							};
							
						},

						addCaptionHTMLFn: function(item, captionEl, isFake) {
							if(!item.title) {
								captionEl.children[0].innerText = '';
								return false;
							}
							captionEl.children[0].innerHTML = item.title ;
							return true;
						},
						showHideOpacity:true,
						history:false,
						shareEl:false,
						maxSpreadZoom:3,
						getDoubleTapZoom:function(isMouseClick, item){
							if(isMouseClick) {
								
								return 1.5;
						
							} else {
								return item.initialZoomLevel < 0.7 ? 1 : 1.5;
							}
						}

					};

					if(fromURL) {
						if(options.galleryPIDs) {
							// parse real index when custom PIDs are used 
							// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
							for(var j = 0; j < items.length; j++) {
								if(items[j].pid == index) {
									options.index = j;
									break;
								}
							}
						} else {
							options.index = parseInt(index, 10) - 1;
						}
					} else {
						options.index = parseInt(index, 10);
					}

					// exit if index not found
					if(isNaN(options.index)) {
						return;
					}
					options=this.extend(options,opts)

					if(disableAnimation) {
						options.showAnimationDuration = 0;
					}

					// Pass data to PhotoSwipe and initialize it
					gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
					Vue.prototype.$preview.self=gallery
					// see: http://photoswipe.com/documentation/responsive-images.html
					var realViewportWidth,
						useLargeImages = false,
						firstResize = true,
						imageSrcWillChange;

					gallery.listen('beforeResize', function() {

						var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
						dpiRatio = Math.min(dpiRatio, 2.5);
						realViewportWidth = gallery.viewportSize.x * dpiRatio;

						if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
							if(!useLargeImages) {
								useLargeImages = true;
								imageSrcWillChange = true;
							}

						} else {
							if(useLargeImages) {
								useLargeImages = false;
								imageSrcWillChange = true;
							}
						}

						if(imageSrcWillChange && !firstResize) {
							gallery.invalidateCurrItems();
						}

						if(firstResize) {
							firstResize = false;
						}

						imageSrcWillChange = false;

					});

					gallery.listen('gettingData', function(index, item) {
						if(item.el.getAttribute('large')) {
							item.src = item.o.src;
							item.w = item.o.w;
							item.h = item.o.h;
						} else {
							item.src = item.m.src;
							item.w = item.m.w;
							item.h = item.m.h;
						}
					});
					gallery.listen('imageLoadComplete', (index, item)=> {
						this.galleryPicLoading=false
					});
					gallery.listen(eventName,eventCallback)
					gallery.init();
					$preview.$el.classList=$preview.$el.classList+' pswp--zoom-allowed'
				},
				parseThumbnailElements(thumbElements) {
					return new Promise(resolve=>{
						var items = [],
							el,
							load = 0,
							item;
							item = {}
						for(var i = 0; i < thumbElements.length; i++) {
							el = thumbElements[i];

							// include only element nodes 
							if(el.nodeType !== 1) {
								continue;
							}


							if(typeof el.naturalWidth == "undefined") {　　 // IE 6/7/8
								　　
								var i = new Image();　　
								i.src = el.src;　　
								var rw = i.width;　　
								var rh = i.height;
							} else {　　 // HTML5 browsers
								　　
								var rw = el.naturalWidth;　　
								var rh = el.naturalHeight;
							}
							getImage(i)
							var count=0
							function getImage(index){
								var l=new Image()
								l.src=el.getAttribute('large')?el.getAttribute('large'):el.getAttribute('src')
								l.text=el.getAttribute('preview-text')
								l.author=el.getAttribute('data-author')
								l.onload=function(){
									item = {
										title: l.text,
										el: thumbElements[index],
										src: l.src,
										w: rw,
										h: rh,
										author: l.author,
										o: {
											src: l.src,
											w: this.width,
											h: this.height,
										},
										m: {
											src: l.src,
											w: this.width,
											h: this.height,
										}
									};
									items[index]=item
									count++
									if(count==thumbElements.length){
										resolve(items)
									}
								}
							}
							

						}
					})
					
					return items

				},
				extend(o1, o2) {
					for (var prop in o2) {
						o1[prop] = o2[prop];
					}
					return o1
				},
				initPreview(gallerySelector){
					this.galleryElements = document.querySelectorAll(gallerySelector);
					for(var i = 0, l = this.galleryElements.length; i < l; i++) {
						this.galleryElements[i].setAttribute('data-pswp-uid', i + 1);
						this.galleryElements[i].onclick = this.onThumbnailsClick;
					}
					
				}
			},
		    mounted: function () {
				this.initPreview('img[preview]')
		      	
		    }
		})

    }
}

export default vuePhotoPreview

if (typeof window !== 'undefined' && !window.vuePhotoPreview) {
    window.vuePhotoPreview=vuePhotoPreview;
}