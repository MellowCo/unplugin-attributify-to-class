<template>
	<view v-if="showDom" :class="['fixed ']"
	:style="[
		pos.left!==null?{left:pos.left+'px'}:'',
		pos.right!==null?{right:pos.right+'px'}:'',
		pos.top!==null?{top:pos.top+'px'}:'',
		pos.bottom!==null?{bottom:pos.bottom+'px'}:'',
		pos.width!==null?{width:pos.width+'px'}:'',
		props.shadow?{padding:(props.shadow*4)+'rpx'}:'',
		{zIndex:500}
	]"
	>
		<tm-translate
		ref="tranmatioan"
		:autoPlay="false"
		:name="tranName"
		@end="endAnimation"
		:reverse="reverse"
		 >
			<tm-sheet
			@click="emits('click', $event)"
			:color="props.color"
			:_class="_class"
			:_style="_style"
			:followTheme="props.followTheme"
			:dark="props.dark"
			:round="props.round"
			:shadow="props.shadow"
			:outlined="props.outlined"
			:border="props.border"
			:borderStyle="props.borderStyle"
			:borderDirection="props.borderDirection"
			:text="props.text"
			:transprent="props.transprent"
			:linear="props.linear"
			:linearDeep="props.linearDeep"
			:margin="props.margin"
			:padding="props.padding"
			>
			<slot>
				<view class="flex flex-row flex-row-center-between  relative ">
					
					<view class="flex flex-1 flex-row overflow flex-row-center-start" >
						<tm-icon _class="pr-10" :fontSize="26" :name="icon_str"></tm-icon>
						<slot>
							<tm-text _class="text-overflow-1" :label="label_str"></tm-text>
						</slot>
					</view>
					<view class="pl-24 pr-12 flex flex-center" style="width:0rpx">
						<tm-icon @click="hide" :fontSize="24" name="tmicon-times"></tm-icon>
					</view>
				</view>
			</slot>
			</tm-sheet>
		</tm-translate>
	</view>
	
		
	
</template>

<script lang="ts" setup>
	/**
	 * 通知提醒
	 * @description 通知提醒,总共四个角和上下，6个位置的提醒,使用时请注意内容变动即可显示。如果想一开始不想显示，不要提供内容就行。
	 */
	import tmSheet from "../tm-sheet/tm-sheet.vue";
	import tmText from "../tm-text/tm-text.vue";
	import tmIcon from "../tm-icon/tm-icon.vue";
	import tmTranslate from "../tm-translate/tm-translate.vue";
	import {
		custom_props,
	} from '../../tool/lib/minxs';
	import { getCurrentInstance, computed, ref, provide, inject , onUpdated, onMounted, onUnmounted, nextTick ,watch, PropType } from 'vue';
import { showOpts } from "./interface";
	const emits = defineEmits(['click','close'])
	const proxy = getCurrentInstance()?.proxy??null;
	const tranmatioan = ref<InstanceType<typeof tmTranslate> | null>(null)
	const props = defineProps({
		...custom_props,
		followTheme:{
			type:[Boolean,],
			default:true
		},
		transprent:{
			type: [Boolean,],
			default: false
		},
		border: {
			type: [Number, ],
			default: 0
		},
		round: {
			type: [Number, ],
			default: 2
		},
		shadow: {
			type: [Number],
			default: 0
		},
		margin: {
			type:Array as PropType<Array<number>>,
			default: () => [0, 0]
		},
		padding: {
			type:Array as PropType<Array<number>>,
			default: () => [24, 16]
		},
		//多少秒后消失。0表示永不消失。
		duration: {
			type: Number,
			default: 2000
		},
		offset:{
			type:Array as PropType<Array<number>>,
			default:()=>[32,32] //x,y
		},
		//位置
		placement: {
			type: String,
			default: 'topLeft' //topLeft|topRight|bottomLeft|bottomRight|top|bottom
		},
		label:{
			type:String,
			default:"",
		},
		icon:{
			type:String,
			default:'tmicon-info-circle-fill'
		}
	})
	const { windowTop,windowBottom ,windowWidth } = uni.getSystemInfoSync();
	
		let nowPage = getCurrentPages().pop()
	// 本页面是否定义了头部的原生导航
	let isCustomHeader = false;
	for(let i=0;i<uni.$tm.pages.length;i++){
		if(nowPage?.route==uni.$tm.pages[i].path&&uni.$tm.pages[i].custom=='custom'){
			isCustomHeader = true;
			break;
		}
	}

	const p_top = ref(windowTop||0)
	if(isCustomHeader){
		p_top.value=44
	}else{
		p_top.value=0
	}
	const p_bottom = ref(windowBottom||0)
	const p_width = ref(windowWidth||0)
	const timeid = ref(uni.$tm.u.getUid(5))
	const iconProxy = ref('')
	const labelProxy = ref('')
	const isEnd = ref(true)
	const showDom = ref(false)
	const handleClose = ref(false) //是否是手动关闭。
	const label_str = computed({
			get:()=>labelProxy.value,
			set:(val)=>{
				labelProxy.value = val;
				if(props.label!==""){
					showDom.value = true;
				}
				nextTick(function(){
					if(tranmatioan.value){
						tranmatioan.value?.play();
					}
				})
			}
		})
	const icon_str = computed({
		get:()=>iconProxy.value,
		set:(val)=>{
			iconProxy.value = val;
			if(props.label!==""){
				showDom.value = true;
			}
			nextTick(function(){
				if(tranmatioan.value){
					tranmatioan.value?.play();
				}
			})
		}
	})
	const tranName = computed(()=>{
		if(props.placement=="topLeft"||props.placement=="bottomLeft") return "left"
		if(props.placement=="topRight"||props.placement=="bottomRight") return "right"
		if(props.placement=="top") return "up"
		if(props.placement=="bottom") return "down"
	})
	const pos = computed(()=>{
		if(props.placement == 'topLeft'){
			return {
				top:p_top.value+uni.upx2px(props.offset[1]),
				left:uni.upx2px(props.offset[0]),
				right:null,
				bottom:null,
				width:null,
			}
		}
		if(props.placement == 'topRight'){
			return {
				top:p_top.value+uni.upx2px(props.offset[1]),
				left:null,
				right:uni.upx2px(props.offset[0]),
				bottom:null,
				width:null,
			}
		}
		if(props.placement == 'bottomLeft'){
			return {
				top:null,
				left:uni.upx2px(props.offset[0]),
				right:null,
				bottom:p_bottom.value+uni.upx2px(props.offset[1]),
				width:null,
			}
		}
		if(props.placement == 'bottomRight'){
			return {
				top:null,
				left:null,
				right:uni.upx2px(props.offset[0]),
				bottom:p_bottom.value+uni.upx2px(props.offset[1]),
				width:null,
			}
		}
		if(props.placement == 'top'){
			return {
				top:p_top.value+uni.upx2px(props.offset[1]),
				left:uni.upx2px(props.offset[0]),
				right:null,
				bottom:null,
				width:p_width.value - (uni.upx2px(props.offset[0])*2),
			}
		}
		if(props.placement == 'bottom'){
			return {
				top:null,
				left:uni.upx2px(props.offset[0]),
				right:null,
				bottom:p_bottom.value +uni.upx2px(props.offset[1]),
				width:p_width.value  -(uni.upx2px(props.offset[0])*2),
			}
		}
		return {
			left:null,
			right:null,
			bottom:null,
			width:null,
			top:null,
		}
	})
	const reverse = ref(true)
	onMounted(()=>{
		label_str.value = props.label;
		icon_str.value = props.icon;
	})
	function endAnimation(){
		clearTimeout(timeid.value)
		if(props.duration==0&&!handleClose.value) return;
		timeid.value = setTimeout(function(){
			showDom.value = false;
			reverse.value=true;
			isEnd.value = true
			emits('close')
		},props.duration)
	}
	//手动显示
	function show(arg:showOpts){
		if(!isEnd.value) return
		let {icon,label} = arg||{};
		if(!icon&&!label){
			showDom.value = true;
			reverse.value=true;
			handleClose.value=false;
			nextTick(function(){
				if(tranmatioan.value){
					tranmatioan.value?.play();
				}
			})
			return;
		}
		label_str.value = label ||"";
		icon_str.value = icon ||"";
		
	}
	//手动隐藏。
	function hide(){
		if(!isEnd.value) return
		reverse.value=false;
		handleClose.value = true;
		if(tranmatioan.value){
			nextTick(()=>tranmatioan.value?.play())
		}else{
			showDom.value = false;
			reverse.value=true;
		}
		emits('close')
	}
	
	defineExpose({show:show,hide:hide})
	
</script>

<style>

</style>
