<template>
    <el-dialog :title="title" v-model="open" width="30%" :close-on-click-modal="false" :style="{'padding':'2%'}" append-to-body>
      <el-form ref="contractsRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="所属运营商/供应商" prop="provider">
          <el-select v-model="form.operator" placeholder="请选择供应商">
            <el-option v-for="dict in operators" :key="dict.id" :label="dict.operatorName"
              :value="parseInt(dict.id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>     
        </el-form-item>
        <div ref="definedContentArea" v-for="el in elements" :key="el">
          <component :is="el"/>
        </div>
        <el-form-item label="备注" prop="comments">
          <el-input v-model="form.comments" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
</template>
<script setup name="AddModel">
import { onMounted, h, onBeforeMount, ref } from 'vue';
import { getOperators } from '../../../../api/chanhu/process_extra';
import { ceateExtraArea } from './dynamicModel.js'
import { getInstance } from 'element-plus/es/components/message/src/instance.mjs';

const params = [
  {
    'type':'input',
    'key':'点位数',
    'val':'ponitsNum',
    'rules':'',
    'comment':'请填写...'
  },
  {
    'type':'input',
    'key':'客户人数',
    'val':'clientsNum',
    'rules':'',
    'comment':'请填写...'
  }
]

const open = ref(false);
// 定义响应式变量
const operators = ref([]);

const title = ref("业务信息录入")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contractType: null,
    provider: null,
    startDate: null,
    endDate: null,
    detail: null,
    comments: null,
    departmentId: null
  },
  rules: {
  }
});

const { proxy } = getCurrentInstance();
const definedContentArea = ref(null);

const elements = ceateExtraArea(params, data);

onMounted(() =>{
  getOperators().then(item =>{
    operators.value = item.data

  }) 
})



const { queryParams, form, rules } = toRefs(data);


function visControl(){
  open.value = !open.value
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {};
}


function submitForm(){
  console.log(form.value);
  
}

defineExpose({ visControl });
</script>
