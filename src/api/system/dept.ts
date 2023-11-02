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

export const getDeptListRequest = (data?: Object) => {
    return http.request<ResultTable>("post", baseUrlApi("admin/dept/list"), {data});
}

export const addDeptRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/dept/add"),{data});
}

export const modifyDeptRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/dept/modify"),{data});
}

export const delDeptRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/dept/del"),{data});
}
