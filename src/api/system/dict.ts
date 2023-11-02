import {http} from "@/utils/http";
import {baseUrlApi} from "@/api/utils";

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
  msg?:String;
};

type Result = {
  success: boolean;
  data?: Array<any>;
  msg?:String;
}



export const listDictRequest = (data?: Object) => {
  return http.request<ResultTable>("post", baseUrlApi("admin/dict/list"), {data});
}

export const addDictRequest = (data?: Object) => {
  return http.request<ResultTable>("post", baseUrlApi("admin/dict/add"), {data});
}

export const modifyDictRequest = (data?: Object) => {
  return http.request<ResultTable>("post", baseUrlApi("admin/dict/modify"), {data});
}

export const delDictRequest = (data?: Object) => {
  return http.request<ResultTable>("post", baseUrlApi("admin/dict/del"), {data});
}



export const listDictKeyRequest = (data?: Object) => {
  return http.request<Result>("post", baseUrlApi("admin/dict/listKey"), {data});
}

export const addDictKeyRequest = (data?: Object) => {
  return http.request<Result>("post", baseUrlApi("admin/dict/addKey"), {data});
}

export const modifyDictKeyRequest = (data?: Object) => {
  return http.request<Result>("post", baseUrlApi("admin/dict/modifyKey"), {data});
}

export const delDictKeyRequest = (data?: Object) => {
  return http.request<Result>("post", baseUrlApi("admin/dict/delKey"), {data});
}

export const getKeyRequest = (data?: Object) => {
  return http.request<Result>("post", baseUrlApi("admin/dict/getKey"), {data});
}
