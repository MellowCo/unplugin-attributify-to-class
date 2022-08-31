<template>
    <tm-drawer ref="drawer" @open="drawerOpen" 
	@close="drawerClose" @update:show = "showPop=$event" :show="showPop" :dark="isDark" 
	:follow-dark="props.followDark" :follow-theme="false" :height="dHeight"
        :hide-header="true" color="grey-3" :mask="false">
        <keyborad-number :showInputContent="props.showInputContent" :decimal="props.decimal" :followTheme="props.followTheme" :random="props.random" :color="props.color" v-if="_typemodel=='number'" @change="change" @confirm="confirm" :model-value="_value" @update:modelValue="_value = $event" :dark="isDark" class="flex-1"></keyborad-number>
        <keyborad-pass :showInputContent="props.showInputContent" :followTheme="props.followTheme" :random="props.random" :color="props.color" v-if="_typemodel=='password'" @change="change" @confirm="confirm" :model-value="_value" @update:modelValue="_value = $event" :dark="isDark" class="flex-1"></keyborad-pass>
        <keyborad-car :showInputContent="props.showInputContent" :followTheme="props.followTheme" :random="props.random" :color="props.color" v-if="_typemodel=='car'" @change="change" @confirm="confirm" :model-value="_value" @update:modelValue="_value = $event" :dark="isDark" class="flex-1"></keyborad-car>
        <keyborad-card :showInputContent="props.showInputContent" :followTheme="props.followTheme" :random="props.random" :color="props.color" v-if="_typemodel=='card'" @change="change" @confirm="confirm" :model-value="_value" @update:modelValue="_value = $event" :dark="isDark" class="flex-1"></keyborad-card>
    </tm-drawer>
</template>
<script lang="ts" setup>
import { ref,computed, watch, toRaw,getCurrentInstance,nextTick } from "vue"
import { custom_props, computedDark } from '../../tool/lib/minxs';
import tmDrawer from '../tm-drawer/tm-drawer.vue';
import keyboradNumber from "./keyborad-number.vue";
import keyboradCard from "./keyborad-card.vue";
import keyboradPass from "./keyborad-pass.vue"
import keyboradCar from "./keyborad-car.vue"
import { useTmpiniaStore } from '../../tool/lib/tmpinia';
const store = useTmpiniaStore();
const emits=defineEmits(["change","confirm","update:show","update:modelValue"])
const {proxy} = getCurrentInstance();
const drawer = ref<InstanceType<typeof tmDrawer> | null>(null)
const props = defineProps({
    ...custom_props,
	followTheme: {
		type: [Boolean,String],
		default: true
	},
	/**
	 * password | card | car | number
	 * 密码     | 身份证|  车牌 | 数字键盘
	 */
	type:{
		type:String,
		default:'number'
	},
	//显示隐藏键盘可v-model:show
	show:{
		type:Boolean,
		default:false
	},
	//数据可v-model
	modelValue:{
		type:String,
		default:""
	},
	//初始默认值。
	defaultValue:{
		type:String,
		default:""
	},
	color:{
		type:String,
		default:"primary"
	},
	/** 是否随机键盘 */
    random:{
        type:Boolean,
        default:false 
    },
	//是否需要显示小数点。
	decimal:{
		type:Boolean,
		default:false 
	},
	// 是否显示输入内容在键盘顶部。
	showInputContent:{
		type:Boolean,
		default:false
	},
})
// 设置响应式全局组件库配置表。
const tmcfg = computed(() => store.tmStore);
//是否暗黑模式。
const isDark = computed(() => computedDark(props, tmcfg.value));
const showPop = ref(props?.show??false);
const _value = ref(props?.defaultValue??"");
const _typemodel = computed(()=>props.type)
watch(()=>props.show,()=>{
	showPop.value = props.show;
})
let timerId = NaN;

function debounce(func: Function, wait = 200, immediate = false) {
	// 清除定时器
	if (!isNaN(timerId)) clearTimeout(timerId);
	// 立即执行，此类情况一般用不到

	if (immediate) {
		var callNow = !timerId;
		timerId = setTimeout(() => {
			timerId = NaN;
		}, wait);

		if (callNow) typeof func === "function" && func();
	} else {
		// 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
		timerId = setTimeout(() => {
			typeof func === "function" && func();
		}, wait);
	}
}

function drawerClose(){
	emits('update:show',false)
}
function drawerOpen(){
	emits('update:show',true)
}

watch(()=>props.modelValue,()=>{
	_value.value = props.modelValue
})
function change(){
	emits("update:modelValue",toRaw(_value.value))
	nextTick(()=>{
		_value.value = props.modelValue
		emits("change",toRaw(_value.value))
	})
	// #ifdef MP
	uni.vibrateShort()
	// #endif
}
function confirm(){
	debounce(()=>{
		emits("confirm",toRaw(_value.value))
		drawer.value?.close()
	},250,true)
	
}


// #ifdef APP || MP-WEIXIN
let win_bottom = uni.getSystemInfoSync()?.safeAreaInsets?.bottom??0
// #endif
// #ifndef APP || MP-WEIXIN
let win_bottom = uni.getSystemInfoSync()?.safeArea?.bottom??0
win_bottom = win_bottom>uni.getSystemInfoSync().windowHeight?0:win_bottom
// #endif

const dHeight = computed(() => {
    
    return 520+win_bottom
})
</script>
