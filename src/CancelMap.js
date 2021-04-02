const requestList = Symbol();
const cancelMessage = Symbol();

/**
 * 取消请求Map类
 */
export default class CancelMap extends Map {
	/**
	 * 初始化cancelMap和请求列表
	 */
	constructor() {
		super();
		this[cancelMessage] = '取消重复请求';
		this[requestList] = [];
	}
	/**
	 * 清空cancelMap以及请求列表
	 */
	clearRequest() {
		for (const cancel of this.values()) {
			cancel('取消当前页面请求');
		}
		this.clear();
		this[requestList].length = 0;
	}
	/**
	 * 清空当前请求
	 * @param {String} request
	 */
	clearCurrentRequest(request) {
		this[requestList].splice(
			this[requestList].findIndex((item) => item === request),
			1
		);
	}
	/**
	 * 获取请求列表
	 * @returns 请求列表
	 */
	getRequestList() {
		return this[requestList];
	}
	/**
	 * 是否含有此次请求 包含则触发取消请求函数
	 * @param {String} request
	 * @returns Boolean
	 */
	isIncludes(request) {
		if (this[requestList].includes(request)) {
			this.get(request)(this[cancelMessage]);
			return true;
		}
		return false;
	}
	/**
	 * 添加请求
	 * @param {String} request
	 */
	addRequest(request) {
		this[requestList].push(request);
	}
}
