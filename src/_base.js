import axios from 'axios';
import {
	requestProcess,
	configProcess,
	responseHandle,
	errorHandle
} from './_utils';
import CancelMap from './CancelMap';

/**
 * 初始化axios全局默认配置
 * @param {Object} config 配置项
 */
const initDefaultConfig = function (config) {
	/** 全局默认超时时间 */
	axios.defaults.timeout = config.timeout || 20000;
	/** 全局默认baseURL */
	axios.defaults.baseURL = config.baseURL || '';
	/** 全局默认post请求headers */
	axios.defaults.headers.post['Content-Type'] =
		config.postContentType || 'application/json;charset=UTF-8';
	/** 全局默认withCredentials */
	axios.defaults.withCredentials = true;
	/** 全局默认返回类型 */
	axios.defaults.responseType = config.responseType || 'json';
};

/** 取消构造函数 */
const CancelToken = axios.CancelToken;
/** 取消构造Map */
const cancelMap = new CancelMap();

/** 请求拦截 */
const requestInterceptor = axios.interceptors.request.use(
	(config) => {
		const request = requestProcess(config);

		// 通过取消构造函数创建config的cancelToken 并存储每个请求的取消函数
		config.cancelToken = new CancelToken((cancel) => {
			cancelMap.set(request, cancel);
		});

		// 请求存储逻辑
		if (!cancelMap.isIncludes(request)) {
			cancelMap.addRequest(request);
		}
		return config;
	},
	(error) => {
		// 抛出任何异常、包括超时都需要清空cancelMap
		cancelMap.clearRequest();
		return Promise.reject(error);
	}
);

/**  响应拦截 */
const responseInterceptor = axios.interceptors.response.use(
	(response) => {
		const request = requestProcess(response.config);

		// 清空请求
		cancelMap.clearCurrentRequest(request);
		return response;
	},
	(error) => {
		// 如果是重复请求，进行异常抛出
		if (axios.isCancel(error)) {
			throw new axios.Cancel(error.message);
		} else {
			// 抛出任何异常、包括超时都需要清空cancelMap
			cancelMap.clearRequest();
			return Promise.reject(error);
		}
	}
);

/**
 * 取消默认设置的请求、响应拦截
 */
const clearInterceptor = function () {
	axios.interceptors.request.eject(requestInterceptor);
	axios.interceptors.response.eject(responseInterceptor);
};

/**
 * 重写请求拦截器
 * @param {Function} config config回调函数
 * @param {Function} error error回调函数
 */
const overrideRequestInterceptor = function (config, error) {
	clearInterceptor();
	axios.interceptors.request.use(config, error);
};

/**
 * 重写响应拦截器
 * @param {Function} response respon回调函数
 * @param {Function} error error回调函数
 */
const overrideResponseInterceptor = function (response, error) {
	clearInterceptor();
	axios.interceptors.request.use(response, error);
};

/**
 * 统一请求
 * @param {Object} requestConfig 请求配置
 * @returns
 */
const http = function (requestConfig) {
	return new Promise((resolve, reject) => {
		// requestConfig加工处理
		const config = configProcess(requestConfig);

		axios(config).then(
			(response) => {
				responseHandle(resolve, response, requestConfig);
			},
			(error) => {
				// 取消请不做处理
				if (error.__CANCEL__) {
					return console.log(error);
				}
				errorHandle(reject, error);
			}
		);
	});
};

/**
 * 并发请求
 * @param {Array} requestList 请求列表
 * @returns
 */
const httpAll = function (requestList) {
	return new Promise((resolve, reject) => {
		axios.all(requestList).then(
			axios.spread((...callbacks) => {
				resolve(callbacks);
			}),
			(error) => {
				reject(error);
			}
		);
	});
};

export {
	http,
	httpAll,
	initDefaultConfig,
	cancelMap,
	overrideRequestInterceptor,
	overrideResponseInterceptor
};
