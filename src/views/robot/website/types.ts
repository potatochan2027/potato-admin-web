interface FormItemProps {
  id: number;
  url: String;
  remark: String;
  crawlerType:String;
  crawlerList:Array<any>;
}

interface FormProps {
  formInline: FormItemProps;
}

export type {FormItemProps, FormProps}
