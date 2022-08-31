import { fetchNet } from './tool/lib/fetch';
import themeTool from './tool/theme/theme';
import preview, * as util from './tool/function/util';
import { language, languageByGlobal } from "./tool/lib/language"
import { share } from "./tool/lib/share"
import { App, nextTick } from "vue"
import PageJsonInit from "../pages.json"

let pages:Array<pagesType> = [];
PageJsonInit.pages.forEach(el => {
	let customType:pagesCustomType = <pagesCustomType>(el?.style?.navigationStyle ?? "default");
	pages.push({
		path: el.path,
		custom: customType
	})
})
if (Array.isArray(PageJsonInit?.subPackages)) {
	PageJsonInit.subPackages.forEach(el => {
		let rootPath = el.root;
		el.pages.forEach(el2 => {
			let elany:any = el2;
			pages.push({
				path: rootPath + "/" + elany.path,
				custom: elany?.style?.navigationStyle ?? "default",
			})
		})
	})
}
let pagers:any = PageJsonInit;
let tabBar:tabBarType = pagers?.tabBar?? {
	color: "",
	selectedColor: "",
	borderStyle: "",
	backgroundColor: "",
	list:[]
}
const $tm = {
	tabBar: tabBar,
	pages: pages,
	isColor: themeTool.isCssColor,
	u: { ...util, preview },
	language: language,
	fetch: fetchNet
};

uni.$tm = $tm

export default {
	install: (app: App, options: object) => {
		// #ifndef APP-NVUE
		app.use(languageByGlobal())
		// #endif
		let appconfig = {};
		// #ifdef MP
		const { onShareAppMessage, onShareTimeline } = share()
		appconfig = { ...appconfig, onShareAppMessage, onShareTimeline }
		// #endif

		app.mixin({
			...appconfig,
		})
		app.config.globalProperties.tm = $tm;
	}
};
