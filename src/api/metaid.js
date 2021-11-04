import Api from "./base";

export function getImg(txId) {
  const query = {
    find: {
      txId
    }
  };
  return Api.ajaxGetUseBase64("/showMANDB/api/v1/query/queryFindMetaData/", query);
}

/**
 *
 * @param {String} txId 传入rootTxId
 */
export async function getUserData(txId) {
  return getOwnShowAccount(txId);
}
export function getOwnShowAccount(txid) {
  return Api.ajaxGet(
    "/apis/showMANDB/api/v1/query/getMetaIDInfo/" + txid,
    {},
    process.env.VUE_APP_imghttpUrl
  );
}

export function batchGetUserInfo(usertxs) {
  return Api.ajaxPost(
    "/apis/showMANDB/api/v1/query/getMetaIDInfoBatch",
    {
      data: {
        metaIds: usertxs
      }
    },
    process.env.VUE_APP_imghttpUrl
  );
}
/**
 *
 * @param {String | Array} protocols 协议列表 demo:['ShowText',['metanode',{isPrivate:0}],['metanote',{isPrivate:0}]]  || 'ShowText'
 * @param {Number} skip 偏移量
 * @param {NUmber} limit 数据限制量，默认10，负数为无限制
 * @param {Number} timestamp 排序，-1为倒序，1为顺序,默认倒序-1
 */
export function getProtocolData(protocols, config, skip = 0, limit = 10, timestamp = -1) {
  let protocol_list = [];
  let fin = {};

  if (!config) {
    config = {};
  }
  if (Object.prototype.toString.call(config) !== "[object Object]") {
    throw new Error("second param must be object {}");
  }

  if (typeof protocols !== "string" && !Array.isArray(protocols)) {
    throw new Error("first param must be Array or string");
  }

  if (typeof protocols === "string") {
    fin = {
      parentNodeName: protocols
    };
  } else {
    protocols.forEach(val => {
      if (typeof val !== "string" && !Array.isArray(val)) {
        throw new Error("item must be Array or string");
      }
      if (Array.isArray(val)) {
        let [parentNodeName, screen] = val;
        let obj = {};
        if (Object.prototype.toString.call(screen) !== "[object Object]") {
          throw new Error("if protocol item is array,the second item must be an object");
        } else {
          obj["parentNodeName"] = parentNodeName;
          for (let key in screen) {
            obj[`data.${key}`] = screen[key];
          }
          protocol_list.push(obj);
        }
      } else {
        protocol_list.push({ parentNodeName: val });
      }
    });
    fin = {
      $and: [
        {
          $or: [...protocol_list]
        }
      ]
    };
  }
  const query = {
    find: {
      ...fin,
      metaId: process.env.VUE_APP_IDtags,
      ...config
      // isValid: true,
    },
    sort: {
      timestamp
    },
    skip,
    limit
  };
  return Api.ajaxGetUseBase64("/showMANDB/api/v1/query/queryFindMetaData/", query);
}

/**
 *
 * @param {String} protocol 'ShowText'
 * @param {Array} config
 * @param {Number} skip 偏移量
 * @param {NUmber} limit 数据限制量，默认10，负数为无限制
 * @param {Number} timestamp 排序，-1为倒序，1为顺序,默认倒序-1
 */
export function batchGetProtocolData(protocol, config, skip = 0, limit = 10, timestamp = -1) {
  let fin = {};

  if (!Array.isArray(config)) {
    throw new Error("second param must be array");
  }
  fin = {
    $or: [...config]
  };
  const query = {
    find: {
      ...fin,
      parentNodeName: protocol,
      metaId: process.env.VUE_APP_IDtags
      // isValid: true,
    },
    sort: {
      timestamp
    },
    skip,
    limit
  };
  return Api.ajaxGetUseBase64("/showMANDB/api/v1/query/queryFindMetaData/", query);
}
