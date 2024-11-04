import { h } from 'vue';
import { ElInput,ElFormItem } from 'element-plus';

export function createInput(key, val, _this) {
  return h(ElFormItem, 
    { props: key, label: key }, 
    {
    default: 
      () => h(ElInput,
        {
          modelValue: _this.form[val],
          'onUpdate:modelValue': (newValue) => {
            _this.form[val] = newValue;
          },
          placeholder: '请输入...'
        },
        {}
      )
  });

}


export function ceateExtraArea(elements, _this){
    let res = []
    for(let index in elements){
      let currentElement = elements[index];
      if(currentElement.type == 'input'){
        res.push(createInput(currentElement.key, currentElement.val, _this))
      }
    }
    
    return res;
}