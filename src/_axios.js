import {
	http,
	httpAll,
	cancelMap,
	initDefaultConfig,
	overrideRequestInterceptor,
	overrideResponseInterceptor
} from './_base';
import qs from 'qs';

// 是否返回response.data， 默认true。 false的话返回response
const baseConfig = {
	isResponseData: true
};

/**
 * get请求
 * @param {string} url 接口 地址
 * @param {object} params get请求参数
 * @param {object} requestConfig 各自业务自定义传入的配置
 */
const get = async (url, params, requestConfig = {}) => {
	return new Promise((resolve, reject) => {
		const config = Object.assign(
			{ method: 'get', url, params },
			baseConfig,
			requestConfig
		);

		http(config).then(
			(response) => {
				resolve(response);
			},
			(err) => {
				reject(err);
			}
		);
	});
};

/**
 * post请求
 * @param {string} url 接口 地址
 * @param {object} data post请求参数
 * @param {object} requestConfig 各自业务自定义传入的配置
 */
const post = async (url, data, requestConfig = {}) => {
	return new Promise((resolve, reject) => {
		const config = Object.assign(
			{
				method: 'post',
				url,
				data
			},
			baseConfig,
			requestConfig
		);

		http(config).then(
			(response) => {
				resolve(response);
			},
			(err) => {
				reject(err);
			}
		);
	});
};

/**
 * post formData格式 请求
 * @param {string} url 接口 地址
 * @param {object} data post请求参数
 */
const postFormData = async (url, data, requestConfig = {}) => {
	return new Promise((resolve, reject) => {
		const config = Object.assign(
			{
				method: 'post',
				url,
				data,
				transformRequest: [
					function (data, headers) {
						headers['Content-Type'] =
							'application/x-www-form-urlencoded; charset=UTF-8';
						return qs.stringify(data);
					}
				]
			},
			baseConfig,
			requestConfig
		);

		http(config).then(
			(response) => {
				resolve(response);
			},
			(err) => {
				reject(err);
			}
		);
	});
};

/**
 * 并发请求
 * @param {Array} requestList 请求列表
 */
const all = async (requestList) => {
	return new Promise((resolve, reject) => {
		httpAll(requestList).then(
			(...response) => {
				resolve(...response);
			},
			(err) => {
				reject(err);
			}
		);
	});
};

const _axios = {
	get,
	post,
	all,
	cancelMap,
	postFormData,
	initDefaultConfig,
	overrideRequestInterceptor,
	overrideResponseInterceptor,
	install(Vue) {
		Vue.prototype._axios = _axios;
	}
};

export default _axios;
