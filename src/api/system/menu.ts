import {http} from "@/utils/http";
import {baseUrlApi} from "@/api/utils";


type Result = {
    success: boolean;
    data?: Array<any>;
    msg?:String;
}

type ResultTable = {
    success: boolean;
    data?: Array<any>;
    msg?:String;
};

export const getMenuList = (data?: Object) => {
    return http.request<ResultTable>("post", baseUrlApi("admin/menu/list"), {data});
}

export const getMenuListByRoleId = (data?: Object) => {
  return http.request<ResultTable>("post", baseUrlApi("admin/menu/listByRoleId"), {data});
}

export const addMenuRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/menu/add"),{data});
}

export const modifyMenuRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/menu/modify"),{data});
}

export const delMenuRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/menu/del"),{data});
}

export const modifyMenuMetaRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/menu/meta/modify"),{data});
}
