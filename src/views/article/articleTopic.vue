<!--
 * @Descripttion: (文章話題/article_topic)
 * @Author: (admin)
 * @Date: (2024-05-24)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具區域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['articletopic:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['articletopic:export']">
          {{ $t('btn.export') }}
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
      @sort-change="sortChange">
      <el-table-column prop="topicId" label="話題ID" align="center" v-if="columns.showColumn('topicId')" />
      <el-table-column prop="topicName" label="話題名" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('topicName')" />
      <el-table-column
        prop="topicDescription"
        label="話題描述"
        align="center"
        :show-overflow-tooltip="true"
        v-if="columns.showColumn('topicDescription')" />
      <el-table-column prop="joinNum" label="參與次數" align="center" v-if="columns.showColumn('joinNum')" />
      <el-table-column prop="addTime" label="創建時間" :show-overflow-tooltip="true" v-if="columns.showColumn('addTime')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            icon="edit"
            title="編輯"
            v-hasPermi="['articletopic:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button
            type="danger"
            size="small"
            icon="delete"
            title="刪除"
            v-hasPermi="['articletopic:delete']"
            @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="title" :lock-scroll="false" v-model="open" width="400">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-row :gutter="20">
          <el-col :lg="24">
            <el-form-item label="話題名" prop="topicName">
              <el-input v-model="form.topicName" placeholder="請輸入話題名" :disabled="opertype == 2" />
            </el-form-item>
          </el-col>

          <el-col :lg="24">
            <el-form-item label="話題描述" prop="topicDescription">
              <el-input type="textarea" v-model="form.topicDescription" placeholder="請輸入話題描述" />
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

<script setup name="articletopic">
import { listArticleTopic, addArticleTopic, delArticleTopic, updateArticleTopic, getArticleTopic } from '@/api/article/articletopic.js'
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'topicid',
  sortType: 'desc'
})
const columns = ref([
  { visible: true, align: 'left', type: '', prop: 'topicId', label: '話題ID' },
  { visible: true, align: 'left', type: '', prop: 'topicName', label: '話題名', showOverflowTooltip: true },
  { visible: true, align: 'left', type: '', prop: 'topicDescription', label: '話題描述', showOverflowTooltip: true },
  { visible: true, align: 'left', type: '', prop: 'joinNum', label: '參與次數' },
  { visible: true, align: 'left', type: '', prop: 'addTime', label: '創建時間', showOverflowTooltip: true }
  //{ visible: false, prop: 'actions', label: '操作', type: 'slot', width: '160' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

var dictParams = []

function getList() {
  loading.value = true
  listArticleTopic(queryParams).then((res) => {
    const { code, data } = res
    if (code == 200) {
      dataList.value = data.result
      total.value = data.totalNum
      loading.value = false
    }
  })
}

// 查詢
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 重置查詢操作
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}
// 自定義排序
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
// 操作類型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
    topicId: [{ required: true, message: '話題ID不能為空', trigger: 'blur', type: 'number' }],
    topicName: [{ required: true, message: '話題名不能為空', trigger: 'blur' }]
  },
  options: {}
})

const { form, rules, options, single, multiple } = toRefs(state)

// 關閉dialog
function cancel() {
  open.value = false
  reset()
}

// 重置表單
function reset() {
  form.value = {
    topicId: null,
    topicName: null,
    topicDescription: null,
    joinNum: null,
    addTime: null
  }
  proxy.resetForm('formRef')
}

// 添加按鈕操作
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加文章話題'
  opertype.value = 1
}
// 修改按鈕操作
function handleUpdate(row) {
  reset()
  const id = row.topicId || ids.value
  getArticleTopic(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改文章話題'
      opertype.value = 2

      form.value = {
        ...data
      }
    }
  })
}

// 添加&修改 表單提交
function submitForm() {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (form.value.topicId != undefined && opertype.value === 2) {
        updateArticleTopic(form.value).then((res) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        addArticleTopic(form.value).then((res) => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}

// 刪除按鈕操作
function handleDelete(row) {
  const Ids = row.topicId || ids.value

  proxy
    .$confirm('是否確認刪除參數編號為"' + Ids + '"的數據項？', '警告', {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      type: 'warning'
    })
    .then(function () {
      return delArticleTopic(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('刪除成功')
    })
}

// 導出按鈕操作
function handleExport() {
  proxy
    .$confirm('是否確認導出文章話題數據項?', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      await proxy.downFile('/article/ArticleTopic/export', { ...queryParams })
    })
}

handleQuery()
</script>
