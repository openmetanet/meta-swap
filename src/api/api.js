import axios from "axios";
import qs from "qs";
var axiosApi = axios.create();
const EXPIRE_TIME = 30000;
let pedding = {};

const createReqStr = config => {
  let reqStr;
  if (config.method === "get") {
    reqStr = config.url + config.method;
  }
  if (config.method === "post") {
    reqStr =
      config.url +
      config.method +
      (typeof config.data == "string"
        ? config.data
        : JSON.stringify(config.data));
  }
  return reqStr;
};
const createCacheResponseData = promise => {
  return {
    promise: promise,
    time: Date.now()
  };
};
axiosApi.interceptors.request.use(
  reqConfig => {
    return reqConfig;
  },
  err => {
    return Promise.reject(err);
  }
);
axiosApi.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    return Promise.reject(err);
  }
);

const handleRequestPromise = options => {
  return new Promise(async (resolve, reject) => {
    try {
      let key = createReqStr({
        url: options.url,
        method: options.method,
        data: options.data
      });
      let requests = pedding[key];
      let axiosApiConfig = {
        method: options.method,
        url: options.url
      };
      if (options.method == "post") {
        axiosApiConfig["data"] = options.data;
      }
      if (options.transformRequest) {
        axiosApiConfig["transformRequest"] = options.transformRequest;
      }
      if (options.headers) {
        axiosApiConfig["headers"] = options.headers;
      }
      if (requests) {
        pedding[key].push(axiosApiConfig);
        let reponsenData = pedding[key][0];
        if (reponsenData.time + EXPIRE_TIME > Date.now()) {
          //可用 response
          reponsenData.promise
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          reponsenData = createCacheResponseData(axiosApi(axiosApiConfig));
          pedding[key] = [reponsenData];
          reponsenData.promise
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            });
          //不可用 response
        }
      } else {
        let reponsenData = createCacheResponseData(axiosApi(axiosApiConfig));
        pedding[key] = [reponsenData];
        reponsenData.promise
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            console.log("出错了")
           
            reject(err);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getOwnShowAccount = params => {
  return handleRequestPromise({
    method: "get",
    url: "/api/showMANDB/api/v1/query/getMetaIDInfo/" + params
  });
};

// 获取第三方登录token
export const getToken = params => {
  return axiosApi({
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    // url: 'http://192.168.168.83:9001/oauth/token',
    url: "/showmoney/oauth2/oauth/token",
    data: params,
    transformRequest: [
      function(data) {
        return qs.stringify(data);
      }
    ]
  });
};
