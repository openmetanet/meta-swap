import axios from "axios";
const prefix = process.env.VUE_APP_WALLET_API;
const suffix = process.env.VUE_APP_SUFFIX;
const timeout = process.env.VUE_APP_AJAXTIMEOUT;

// axios配置
const axiosBaseConfig = {
  // baseURL: prefix,
  timeout: timeout,
  headers: {
    "Content-Type": "text/plain"
    // 'Content-Type': 'application/json'
  },
  method: "post",
  // 跨域请求，是否带上认证信息
  withCredentials: false, // default
  // http返回的数据类型
  // 默认是json，可选'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: "json", // default
  // http请求返回状态码检查
  validateStatus: status => status >= 200 && status < 300, // default
  // 请求数据预处理
  transformRequest: [
    data => {
      // 请求对象转换成jon字符串，formdata数据除外
      if (typeof data === "object" && !(data instanceof FormData)) {
        return JSON.stringify(data);
      }
      return data;
    }
  ],
  // 返回数据预处理
  transformResponse: [
    (respData, headers) => {
      // 针对ie处理一下字符串情况
      const ct = headers["content-type"];
      if (ct && ct.indexOf("application/json") !== -1) {
        if (typeof respData === "string") {
          return JSON.parse(respData);
        }
      }
      return respData;
    }
  ]
};
// axios 实例
const axiosInstance = axios.create(axiosBaseConfig);
// 拦截器
axiosInstance.interceptors.request.use(
  req => req,
  error =>
    // 当请求错误时
    Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  resp => resp,
  error => {
    // 当返回错误时
    if (axios.isCancel(error)) {
      throw { message: "请求被取消" };
    }
    if ("code" in error && error.code === "ECONNABORTED") {
      throw { message: "请求超时" };
    }
    if ("message" in error && error.message === "Network Error") {
      throw { message: "网络错误" };
    }
    if ("response" in error) {
      throw { message: `请求失败，HTTP CODE：${error.response.status}` };
    }
    return Promise.reject(error);
  }
);

const axiosPost = (url, config, reqData) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return axiosInstance
    .post(url, reqData, {
      cancelToken: source.token,
      ...config
    })
    .then(resp => {
      return resp.data;
    });
};

const axiosGet = (url, config, reqData) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  let reqArray = [];
  Object.keys(reqData).forEach(key => {
    reqArray.push(`${key}=${encodeURIComponent(reqData[key])}`);
  });
  let newUrl = `${url}?${reqArray.join("&")}`;

  return axiosInstance
    .get(newUrl, {
      cancelToken: source.token,
      ...config
    })
    .then(resp => resp.data);
};

const axiosGetWithBase64 = (url, config, reqData) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const base64 = btoa(JSON.stringify(reqData));
  let newUrl = `${url}${base64}`;

  return axiosInstance
    .get(newUrl, {
      cancelToken: source.token,
      ...config
    })
    .then(resp => resp.data);
};

// post json字符串，即text/plain形式
const createHttpPost = (url, reqData, target) => {
  let newUrl;
  if (target) {
    newUrl = `${target}${url}${suffix}`;
  } else {
    newUrl = `${prefix}${url}${suffix}`;
  }

  return axiosPost(newUrl, {}, reqData);
};

const createHttpGet = (url, reqData, target) => {
  let newUrl;
  if (target) {
    newUrl = `${target}${url}${suffix}`;
  } else {
    newUrl = `${prefix}${url}${suffix}`;
  }

  return axiosGet(newUrl, {}, reqData);
};

const createHttpGetWithBase64 = (url, reqData, target) => {
  let newUrl;
  if (target) {
    newUrl = `${target}${url}${suffix}`;
  } else {
    newUrl = `${prefix}${url}${suffix}`;
  }

  return axiosGetWithBase64(newUrl, {}, reqData);
};

 const queryFindMetaData = params => {
  let paramsJson = JSON.parse(atob(params));
  return axiosInstance({
    url: "/api/showMANDB/api/v1/query/queryFindMetaData/" + params,
    method: "get"
  });

};

export {queryFindMetaData, createHttpPost, createHttpGet, createHttpGetWithBase64, axiosPost, axiosGet };
