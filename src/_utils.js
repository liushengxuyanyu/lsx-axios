const methodMap = {
	get: 'params',
	post: 'data',
	put: 'data',
	delete: 'data'
};

/**
 * 根据请求方法获取对应的参数
 * @param {Object} config 请求config
 */
const getParams = (config) => {
	return JSON.stringify(config[methodMap[config.method]]);
};

/**
 * 请求加工
 * @param {Object} config 请求config
 */
const requestProcess = (config) => {
	return config.url + '&' + config.method + '&' + getParams(config);
};

/**
 * 删除对象中属性为null、undefined的属性
 * @param {Object} obj
 */
const removeEmpty = (obj) => {
	Object.keys(obj).forEach(
		(key) => (obj[key] === null || obj[key] === undefined) && delete obj[key]
	);
	return obj;
};

/**
 * 加工axios请求配置项
 * @param {Object} config
 */
const configProcess = (options) => {
	options.baseURL = checkBaseURL(options.baseURL, options.url);
	return Object.assign({}, removeEmpty(options));
};

/**
 * 兼容baseURL末尾/ 和url开头 / 处理
 * @param {String} baseURL 根路径
 * @param {String} url 接口地址
 */
const checkBaseURL = (baseURL, url) => {
	const baseURL1 = /.*\/$/.test(baseURL)
		? baseURL.substr(0, baseURL.length - 1)
		: baseURL;
	const baseURL2 = /.*\/$/.test(baseURL) ? baseURL : baseURL + '/';

	return /^\/.*/.test(url) ? baseURL1 : baseURL2;
};

/** response结果处理 */
const responseHandle = function (resolve, response, requestConfig) {
	if (requestConfig && requestConfig.isResponseData) {
		resolve(response.data);
	}
	resolve(response);
};

/** http报错状态码处理 */
const errorHandle = function (reject, error) {
	if (error.response) {
		return reject(error.response);
	}
	// 超时额外处理为408
	if (error.message.includes('timeout')) {
		return reject({ status: 408 });
	}
	return reject(error);
};

export {
	getParams,
	requestProcess,
	configProcess,
	responseHandle,
	errorHandle
};
