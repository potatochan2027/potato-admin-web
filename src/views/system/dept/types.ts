interface FormItemProps {
  departmentName: String;
  departmentHeadName:String;
  remark:String;
  parentId:number;
  status:number;
  id:number;
}
interface FormProps {
  formInline: FormItemProps;
}
export type { FormItemProps, FormProps }

