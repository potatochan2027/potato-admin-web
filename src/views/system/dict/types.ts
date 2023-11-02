interface FormItemProps {
  id: number;
  name: String;
  remark: String;
}

interface FormProps {
  formInline: FormItemProps;
}

interface KeyItemProps{
  id:number;
  dictId:number;
  keyName:String;
  keyValue:String;
}

interface KeyProps{
  keyInline:KeyItemProps;
}




export type {FormItemProps, FormProps,KeyItemProps,KeyProps}
