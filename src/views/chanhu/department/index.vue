<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="110px">
      <el-form-item label="部门名称" prop="departmentName">
        <el-input v-model="queryParams.departmentName" placeholder="请输入部门名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="客户单位id" prop="clientUnitId">
        <el-input v-model="queryParams.clientUnitId" placeholder="请输入客户单位id" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="部门联系人姓名" prop="contactsName">
        <el-input v-model="queryParams.contactsName" placeholder="请输入部门联系人姓名" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="联系人电话" prop="contactsMobile">
        <el-input v-model="queryParams.contactsMobile" placeholder="请输入联系人电话" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="联系人职务" prop="duties">
        <el-input v-model="queryParams.duties" placeholder="请输入联系人职务" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['chanhu:department:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['chanhu:department:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['chanhu:department:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['chanhu:department:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="departmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="${comment}" align="center" prop="id" /> -->
      <el-table-column label="部门名称" align="center" prop="departmentName" />
      <el-table-column label="客户单位id" align="center" prop="clientUnitId" />
      <el-table-column label="部门联系人姓名" align="center" prop="contactsName" />
      <el-table-column label="联系人电话" align="center" prop="contactsMobile" />
      <el-table-column label="联系人职务" align="center" prop="duties" />
      <el-table-column label="备注" align="center" prop="comments" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['chanhu:department:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['chanhu:department:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改客户单位部门管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="departmentRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="form.departmentName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="客户单位id" prop="clientUnitId">
          <el-input v-model="form.clientUnitId" placeholder="请输入客户单位id" />
        </el-form-item>
        <el-form-item label="部门联系人姓名" prop="contactsName">
          <el-input v-model="form.contactsName" placeholder="请输入部门联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactsMobile">
          <el-input v-model="form.contactsMobile" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="联系人职务" prop="duties">
          <el-input v-model="form.duties" placeholder="请输入联系人职务" />
        </el-form-item>
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
  </div>
</template>

<script setup name="Department">
import { listDepartment, getDepartment, delDepartment, addDepartment, updateDepartment } from "@/api/chanhu/department";
import { useRoute } from "vue-router";

const { proxy } = getCurrentInstance();

const departmentList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    departmentName: null,
    clientUnitId: null,
    contactsName: null,
    contactsMobile: null,
    duties: null,
    comments: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户单位部门管理列表 */
function getList() {
  loading.value = true;
  listDepartment(queryParams.value).then(response => {
    departmentList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    departmentName: null,
    clientUnitId: null,
    contactsName: null,
    contactsMobile: null,
    duties: null,
    comments: null
  };
  proxy.resetForm("departmentRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加客户单位部门管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getDepartment(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改客户单位部门管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["departmentRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDepartment(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDepartment(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除客户单位部门管理编号为"' + _ids + '"的数据项？').then(function () {
    return delDepartment(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('chanhu/department/export', {
    ...queryParams.value
  }, `department_${new Date().getTime()}.xlsx`)
}


// 怎么接受另一个页面传过来的clientUnitId参数，然后加载数据
// contract也是
const route = useRoute();
const clientUnitId = route.query.clientUnitId;


queryParams.value.clientUnitId = clientUnitId;
console.log(queryParams.clientUnitId);



getList();
</script>
