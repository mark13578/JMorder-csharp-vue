<!--
 * @Descripttion: (Order4/order_4)
 * @Author: (admin)
 * @Date: (2024-12-19)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['order4:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
       <el-col :span="1.5">
        <el-button type="info" plain icon="sort" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 数据区域 -->
    <el-table
      v-if="refreshTable"
      :data="dataList"
      v-loading="loading"
      ref="tableRef"
      border
      highlight-current-row
      @selection-change="handleSelectionChange"
      :default-expand-all="isExpandAll"
      row-key="linenum"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column prop="linenum" label="列編號" align="center" />
      <el-table-column prop="recipient" label="寄送公司行號" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="contacts" label="收件者" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="phone" label="連絡電話" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="address" label="收件地址" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="mobile" label="手機號碼" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="sendComment" label="備註" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="agency" label="代收款" align="center" />

      <el-table-column label="操作" align="center" width="140">
        <template #default="scope">
          <el-button v-hasPermi="['order4:edit']" type="success" icon="edit" title="编辑" 
            @click="handleUpdate(scope.row)"></el-button>      
          <el-button v-hasPermi="['order4:delete']" type="danger" icon="delete" title="删除" 
            @click="handleDelete(scope.row)"></el-button>
        </template>      
      </el-table-column>
    </el-table>

    <!-- 添加或修改Order4对话框 -->
    <el-dialog :title="title" :lock-scroll="false" v-model="open" >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="24">
            <el-form-item label="父级id" prop="docEntry">
              <el-cascader
                class="w100"
                :options="dataList"
                :props="{ checkStrictly: true, value: 'linenum', label: 'linenum', emitPath: false }"
                placeholder="请选择上级菜单"
                clearable
                v-model="form.docEntry"
              >
                <template #default="{ node, data }">
                  <span>{{ data.linenum }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
    
          <el-col :lg="12">
            <el-form-item label="列編號" prop="linenum">
              <el-input v-model="form.linenum" placeholder="请输入列編號" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="寄送公司行號" prop="recipient">
              <el-input v-model="form.recipient" placeholder="请输入寄送公司行號" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="收件者" prop="contacts">
              <el-input v-model="form.contacts" placeholder="请输入收件者" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="連絡電話" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入連絡電話" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="收件地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入收件地址" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="手機號碼" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手機號碼" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="備註" prop="sendComment">
              <el-input v-model="form.sendComment" placeholder="请输入備註" />
            </el-form-item>
          </el-col>
    
          <el-col :lg="12">
            <el-form-item label="代收款" prop="agency">
              <el-input v-model="form.agency" placeholder="请输入代收款" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="orderaddress">
import { treelistOrderAddress, listOrderAddress, 
 addOrderAddress, delOrderAddress, updateOrderAddress,getOrderAddress,
 } from '@/api/business/orderaddress.js'

const { proxy } = getCurrentInstance()
const isExpandAll = ref(false)
const refreshTable = ref(true)
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

// 选中id数组数组
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Linenum',
  sortType: 'asc',
})
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
]


function getList(){
  loading.value = true
  treelistOrderAddress(queryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      //dataList.value = res.data.result
      //total.value = res.data.totalNum
      dataList.value = res.data
      loading.value = false
    }
  })
    .catch(() => {
      loading.value = false
    })
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 重置查询操作
function resetQuery(){
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1
  multiple.value = !selection.length;
}

// 自定义排序
function sortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

  }
  queryParams.sort = sort
  queryParams.sortType = sortType
  handleQuery()
}

/*************** form操作 ***************/
const formRef = ref()
const title = ref("")
// 操作类型 1、add 2、edit
const opertype = ref(0)
const open = ref(false)
const state = reactive({
  form: {},
  rules: {
  },
  options: {
  }
})

const { form, rules, options } = toRefs(state)

// 关闭dialog
function cancel(){
  open.value = false
  reset()
}

// 重置表单
function reset() {
  proxy.resetForm("formRef")
}

// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加'
  opertype.value = 1
}

// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getOrderAddress(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = "修改数据"
      opertype.value = 2

      form.value = {
      ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined && opertype.value === 2) {
        updateOrderAddress(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
        .catch(() => {})
      } else {
        addOrderAddress(form.value).then((res) => {
            proxy.$modal.msgSuccess("新增成功")
            open.value = false
            getList()
          })
          .catch(() => {})
      }
    }
  })
}

// 删除按钮操作
function handleDelete(row) {
  const Ids = row.id || ids.value

  proxy.$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？')
  .then(function () {
      return delOrderAddress(Ids)
  })
  .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
  })
  .catch(() => {})
}


handleQuery()
</script>