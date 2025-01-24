<!--
 * @Descripttion: (寄送地址維護/sendaddress)
 * @Author: (admin)
 * @Date: (2024-12-24)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="寄送公司行號" prop="recipient">
        <el-input v-model="queryParams.recipient" placeholder="请输入寄送公司行號" />
      </el-form-item>
      <el-form-item label="收件者" prop="contacts">
        <el-input v-model="queryParams.contacts" placeholder="请输入收件者" />
      </el-form-item>
      <el-form-item label="連絡電話" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入連絡電話" />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['sendaddress:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table
      :data="dataList"
      v-loading="loading"
      ref="table"
      border
      header-cell-class-name="el-table-header-cell"
      highlight-current-row
      @sort-change="sortChange"
      >
      <el-table-column prop="linenum" label="列編號" align="center" v-if="columns.showColumn('linenum')"/>
      <el-table-column prop="customerID" label="客戶編號" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('customerID')"/>
      <el-table-column prop="recipient" label="寄送公司行號" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('recipient')"/>
      <el-table-column prop="contacts" label="收件者" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('contacts')"/>
      <el-table-column prop="phone" label="連絡電話" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('phone')"/>
      <el-table-column prop="address" label="收件地址" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('address')"/>
      <el-table-column prop="mobile" label="手機號碼" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('mobile')"/>
      <el-table-column prop="sendComment" label="備註" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('sendComment')"/>
      <el-table-column prop="agency" label="代收款" align="center" v-if="columns.showColumn('agency')"/>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['sendaddress:edit']" @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['sendaddress:delete']" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />


    <el-dialog :title="title" :lock-scroll="false" v-model="open" >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
            
          <el-col :lg="12">
            <el-form-item label="列編號" prop="linenum">
              <el-input v-model.number="form.linenum" placeholder="请输入列編號" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="客戶編號" prop="customerID">
              <el-input v-model="form.customerID" placeholder="请输入客戶編號" />
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
              <el-input v-model.number="form.agency" placeholder="请输入代收款" />
            </el-form-item>
          </el-col>
            
          <el-col :lg="12" v-if="opertype != 1">
            <el-form-item label="Id" prop="id">
              <el-input-number v-model.number="form.id" controls-position="right" placeholder="请输入Id" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="sendaddress">
import { listSendaddress,
 addSendaddress, delSendaddress, 
 updateSendaddress,getSendaddress, 
 } 
from '@/api/business/sendaddress.js'
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Linenum',
  sortType: 'asc',
  recipient: undefined,
  contacts: undefined,
  phone: undefined,
})
const columns = ref([
  { visible: true, align: 'center', type: '', prop: 'linenum', label: '列編號'   },
  { visible: true, align: 'center', type: '', prop: 'customerID', label: '客戶編號'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'recipient', label: '寄送公司行號'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'contacts', label: '收件者'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'phone', label: '連絡電話'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'address', label: '收件地址'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'mobile', label: '手機號碼'  ,showOverflowTooltip: true  },
  { visible: true, align: 'center', type: '', prop: 'sendComment', label: '備註'  ,showOverflowTooltip: true  },
  { visible: false, align: 'center', type: '', prop: 'agency', label: '代收款'   },
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
]


function getList(){
  loading.value = true
  listSendaddress(queryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      dataList.value = data.result
      total.value = data.totalNum
      loading.value = false
    }
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
const title = ref('')
// 操作类型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur" }],
  },
  options: {
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

// 关闭dialog
function cancel(){
  open.value = false
  reset()
}

// 重置表单
function reset() {
  form.value = {
    linenum: null,
    customerID: null,
    recipient: null,
    contacts: null,
    phone: null,
    address: null,
    mobile: null,
    sendComment: null,
    agency: null,
    id: null,
  };
  proxy.resetForm("formRef")
}


// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加寄送地址維護'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getSendaddress(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改寄送地址維護'
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
        updateSendaddress(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSendaddress(form.value).then((res) => {
            proxy.$modal.msgSuccess("新增成功")
            open.value = false
            getList()
          })
      }
    }
  })
}

// 删除按钮操作
function handleDelete(row) {
  const Ids = row.id || ids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？', "警告", {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: "warning",
    })
    .then(function () {
      return delSendaddress(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}




handleQuery()
</script>