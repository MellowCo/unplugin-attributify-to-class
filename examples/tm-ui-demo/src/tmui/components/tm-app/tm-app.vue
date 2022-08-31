<template>
	<view class="flex flex-col relative"
		:style="[appConfig.theme ? { background: appConfig.theme } : '', { width: appConfig.width + 'px', minHeight: appConfig.height + 'px' }]">

		<view :class="[blur ? 'blur' : '']" ref="bodyEl" class="flex flex-col flex-1 " :style="[
			{
				zIndex: 1,
				width: appConfig.width + 'px',
				minHeight: appConfig.height + 'px'
			},
			blur ? { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(248, 248, 248, 0.7)' } : ''
		]">
			<slot name="default">
				<text>在这里放置内容</text>
			</slot>
		</view>
		<view :blurEffect="_blurEffect"  @click.stop="toogleOpen(false)" ref="menuEl" :class="[_showMenu?'menuOn':'']"
			class="fixed l-0 t-0 menu"
			:style="{ width: appConfig.width + 'px', height: appConfig.height + 'px',background:'rgba(0,0,0,0.6)',backdropFilter: 'blur(3px)'}">
			<view :style="{ width: appConfig.width*0.7 + 'px', height: appConfig.height + 'px',boxShadow:'3px 0 16px rgba(0,0,0,0.3)'}" >
				<scroll-view @click.stop="" :scroll-y="true"
					:style="{ width:appConfig.width*0.7 + 'px', height: appConfig.height + 'px'}">
					<slot name="menu"
						:sys="{width:appConfig.width*0.7,height:appConfig.height,statusBarHeight:sysinfo.statusBarHeight}"></slot>
				</scroll-view>
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
	/**
	 * 应用容器
	 * @description 这是所有创建应用的最外层基础容器。
	 */
	import {
		provide,
		getCurrentInstance,
		computed,
		watchEffect,
		ref,
		watch,
		onBeforeMount,
		ComponentInternalInstance,
		nextTick,
		onMounted
	} from 'vue';
	import {
		useTmpiniaStore
	} from '../../tool/lib/tmpinia';
	import {
		colorThemeType,
		cssstyle,
		tmVuetify
	} from '../../tool/lib/interface';
	import {
		custom_props,
		computedTheme,
		computedClass,
		computedStyle,
		computedDark
	} from '../../tool/lib/minxs';
	import {
		onShow,
		onLoad,
		onInit
	} from "@dcloudio/uni-app";
	import {
		useTmRouterAfter,
		useTmRouterBefore
	} from "../../../router/index"
	import tmSheet from "../tm-sheet/tm-sheet.vue"
	// #ifdef APP-PLUS-NVUE
	const animation = uni.requireNativePlugin('animation')
	// #endif
	const emits = defineEmits(["update:showMenu"])
	//请在scr/目录下创建一个router/index.ts路由,见文档：https://tmui.design/doc/JSTool/router.html
	const store = useTmpiniaStore();
	const proxy = getCurrentInstance()?.proxy ?? null;
	//路由守卫---------------------------------
	let pages = getCurrentPages().pop()
	nextTick(() => {
		useTmRouterBefore({
			path: pages?.route ?? "",
			context: proxy
		})
	})
	onLoad((opts: any) => {
		useTmRouterAfter({
			path: pages?.route ?? "",
			opts: opts,
			context: proxy
		})
	})
	// end-----------------------------------------
	// 混淆props共有参数
	const props = defineProps({
		...custom_props,
		//整体的主题色调同全局色一样。
		theme: {
			type: String,
			default: 'grey-5'
		},
		//应用的背景图。https://picsum.photos/750/1448
		bgImg: {
			type: String,
			default: ''
		},
		//应用的背景颜色。
		color: {
			type: String,
			default: 'grey-4'
		},
		darkColor: {
			type: String,
			default: '#050505'
		},
		blur: {
			type: [Boolean, String],
			default: false
		},
		navbar: {
			type: Object,
			default: () => {
				return {
					background: '#ffffff',
					fontColor: '#000000'
				};
			}
		},
		showMenu: {
			type: Boolean,
			default: false
		}
	});
	// 设置响应式全局组件库配置表。
	const tmcfg = computed(() => store.tmStore);
	const isSetThemeOk = ref(false)
	//自定义样式：
	// const customCSSStyle = computed(()=>computedStyle(props));
	//自定类
	// const customClass = computed(()=>computedClass(props));
	//是否暗黑模式。
	const isDark = computed(() => computedDark(props, tmcfg.value));
	//计算主题
	const tmcomputed = computed < cssstyle > (() => computedTheme(props, isDark.value, tmcfg.value));
	//返回应用背景和文件色值。
	const _showMenu = ref(props.showMenu)

	const sysinfo: UniApp.GetSystemInfoResult = uni.getSystemInfoSync()
	// 视察的宽。
	const view_width = ref(sysinfo.windowWidth);
	//视窗的高度。
	let view_height = ref(sysinfo.windowHeight);

	let nowPage = getCurrentPages().pop()
	// 本页面是否定义了头部的原生导航
	let isCustomHeader = false;
	for (let i = 0; i < uni.$tm.pages.length; i++) {
		if (nowPage?.route == uni.$tm.pages[i].path && uni.$tm.pages[i].custom == 'custom') {
			isCustomHeader = true;
			break;
		}
	}
	//本页面是否是tabar切换页面。
	let isTabbarPage = false;
	let barLit = uni.$tm.tabBar?.list ?? []
	for (let i = 0; i < barLit.length; i++) {
		if (nowPage?.route == barLit[i].pagePath) {
			isTabbarPage = true;
			break;
		}
	}
	// #ifdef H5
	if (isCustomHeader) {
		view_height.value = sysinfo.windowHeight + sysinfo.windowTop
	}
	// #endif

	// #ifdef APP-NVUE 
	if (!isCustomHeader) {
		if (sysinfo.osName == "android") {
			view_height.value = (sysinfo.safeArea?.height ?? sysinfo.windowHeight) - 44 - (sysinfo.safeAreaInsets
				?.bottom ?? 0)
		} else {
			view_height.value = (sysinfo.safeArea?.height ?? sysinfo.windowHeight) - 44
		}
	} else {
		view_height.value = (sysinfo.safeArea?.height ?? sysinfo.windowHeight) + (sysinfo?.statusBarHeight ?? 0) + (sysinfo
			.safeAreaInsets?.bottom ?? 0)
	}
	// #endif
	// #ifdef APP-VUE 
	if (!isCustomHeader) {
		view_height.value = (sysinfo.safeArea?.height ?? sysinfo.windowHeight) - 44
	} else {
		view_height.value = (sysinfo.safeArea?.height ?? sysinfo.windowHeight) + (sysinfo?.statusBarHeight ?? 0) + (sysinfo
			.safeAreaInsets?.bottom ?? 0)
	}
	// #endif


	const _blurEffect = computed(() => {
		if (props.blur === true && isDark.value) return 'dark';
		if (props.blur === true && !isDark.value) return 'extralight';
		return 'none'
	})

	// //https://picsum.photos/750/1440
	let appConfig = ref({
		width: view_width,
		height: view_height,
		theme: tmcomputed.value.backgroundColor,
		bgImg: props.bgImg,
		dark: isDark.value
	});

	function setAppStyle() {
		if (isDark.value) {
			appConfig.value.theme = props.darkColor;
		} else {
			appConfig.value.theme = tmcomputed.value.backgroundColor;
		}
		// #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-KUAISHOU || MP-LARK
		uni.setBackgroundColor({
			backgroundColor: appConfig.value.theme,
			backgroundColorBottom: appConfig.value.theme,
			backgroundColorTop: appConfig.value.theme
		})
		// #endif

		// #ifdef APP-NVUE ||  APP-VUE
		if (plus?.webview?.currentWebview()?.setStyle) {
			plus.webview.currentWebview().setStyle({
				background: appConfig.value.theme,
				backgroundColorTop: appConfig.value.theme,
				backgroundColorBottom: appConfig.value.theme,
				userSelect: true,
				webviewBGTransparent: true
			})
		}
		// app安卓下设置底部虚拟区域的颜色。
		if (sysinfo.osName == 'android') {
			var Color: any = plus.android.importClass("android.graphics.Color");
			plus.android.importClass("android.view.Window");
			var mainActivity: any = plus.android.runtimeMainActivity();
			var window_android = mainActivity?.getWindow();

			if (appConfig.value.dark) {
				window_android.setNavigationBarColor(Color.BLACK);
			} else {
				window_android.setNavigationBarColor(Color.WHITE);
			}
		}

		// #endif
		// #ifdef H5
		document.body.style.background = appConfig.value.theme || "";
		// #endif

		if (isDark.value) {
			// #ifndef MP-ALIPAY
			if (!isCustomHeader) {
				uni.setNavigationBarColor({
					backgroundColor: appConfig.value.theme,
					frontColor: '#ffffff'
				})
			}

			// #endif
			if (isTabbarPage) {
				uni.setTabBarStyle({
					backgroundColor: '#000000',
					borderStyle: '#1a1a1a',
					color: '#ffffff',
					selectedColor: uni.$tm.tabBar.selectedColor || tmcomputed.value.textColor
				})
			}

		} else {

			// #ifndef MP-ALIPAY
			if (!isCustomHeader) {
				uni.setNavigationBarColor({
					backgroundColor: props.navbar.background,
					frontColor: props.navbar.fontColor
				})
			}

			// #endif
			if (isTabbarPage) {
				uni.setTabBarStyle({
					backgroundColor: uni.$tm.tabBar.backgroundColor || props.navbar.background,
					borderStyle: uni.$tm.tabBar.borderStyle || '#888888',
					color: uni.$tm.tabBar.color || props.navbar.fontColor,
					selectedColor: uni.$tm.tabBar.selectedColor || tmcomputed.value.textColor
				})
			}

		}

		isSetThemeOk.value = true;
	}

	//向下子组件传递，相关参数，可代替store使用。
	provide('appTextColor', computed(() => tmcomputed.value.textColor));
	//各个组件之间的间隙。
	provide('custom_space_size', [0, 0]);
	/**
	 * 设定主题
	 * @params colorName 主题名称
	 */
	function setTheme(colorName: string) {
		store.setTmVuetifyTheme(colorName)
	}

	//设定暗黑
	function setDark(dark ? : boolean) {
		let maindark = !isDark.value;
		if (typeof dark !== 'undefined' && typeof dark == 'boolean') {
			maindark = dark;
		}
		appConfig.value.dark = maindark;
		store.setTmVuetifyDark(maindark)
	}

	//向ref外层公开本组件的特定方法。
	defineExpose({
		setTheme: setTheme,
		setDark: setDark
	});
	//监视全局主题并立即执行。

	onBeforeMount(() => setAppStyle())
	watch(() => props.showMenu, () => {
		_showMenu.value = props.showMenu
		spinNvueAni()

	})
	watch([() => tmcfg.value.color, isDark], () => {
		isSetThemeOk.value = false;
		setAppStyle();
	});

	function toogleOpen(type: boolean) {
		_showMenu.value = type;
		emits("update:showMenu", _showMenu.value)
	}

	function spinNvueAni(reveser = false) {
		// #ifdef APP-NVUE
		if (!proxy?.$refs.bodyEl) return;
		var testEl = proxy?.$refs.bodyEl;
		animation.transition(testEl, {
			styles: {
				transform: _showMenu.value ? `translateX(70%)   scale(0.8)` : `translateX(0%)  scale(1)`,
				transformOrigin: 'center center'
			},
			duration: 200, //ms
			timingFunction: 'ease',
			delay: 0 //ms
		}, () => {
			
		})
		setTimeout(function() {
			if (!proxy?.$refs.menuEl) return;
			var testElx = proxy?.$refs.menuEl;
			animation.transition(testElx, {
				styles: {
					transform: _showMenu.value ? `translateX(0%)` : `translateX(-101%)`,
					transformOrigin: 'center center'
				},
				duration: 200, //ms
				timingFunction: 'ease',
				delay: 0 //ms
			}, () => {
			
			})
		}, 50);
		// #endif

	}
</script>
<style scoped>
	.menu {
		z-index: 999;
		transform: translateX(-101%);
	}

	/* #ifndef APP-NVUE */
	.menu {
		transition-duration: 0.25s;
		transition-timing-function: ease;
		transition-property: transform;
		transition-delay: 0ms;
		transform: translateX(-101%);
		z-index: 999;
	}

	.menuOn {
		transform: translateX(0%);
	}

	.body {
		transition-duration: 0.25s;
		transition-timing-function: ease;
		transition-property: transform;
		transition-delay: 0ms;
		transform: translateX(0%) scale(1);
	}

	.bodyOn {
		transform: translateX(70%) scale(0.8);
	}

	/* #endif */
</style>
