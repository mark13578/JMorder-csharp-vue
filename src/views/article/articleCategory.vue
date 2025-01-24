<!--
 * @Descripttion: (文章目錄/articleCategory)
 * @version: (1.0)
 * @Author: (zr)
 * @Date: (2022-05-13)
 * @LastEditors: (zr)
 * @LastEditTime: (2022-05-13)
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item>
        <el-radio-group v-model="queryParams.categoryType" @change="handleQuery()">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button v-for="item in categoryTypeOptions" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item> -->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['articlecategory:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="sort" @click="toggleExpandAll">展開/摺疊</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['articlecategory:delete']" plain icon="delete" @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['articlecategory:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 數據區域 -->
    <el-table
      v-if="refreshTable"
      :data="dataList"
      v-loading="loading"
      ref="tableRef"
      border
      highlight-current-row
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      :default-expand-all="isExpandAll"
      row-key="categoryId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="目錄名" :show-overflow-tooltip="true" />
      <el-table-column prop="icon" label="圖標" :show-overflow-tooltip="true">
        <template #default="{ row }">
          <svg-icon :name="row.icon" v-if="row.icon"></svg-icon>
          {{ row.icon }}
        </template>
      </el-table-column>
      <el-table-column prop="bgImg" label="背景" :show-overflow-tooltip="true">
        <template #default="{ row }">
          <image-preview :src="row.bgImg" split=","></image-preview>
        </template>
      </el-table-column>
      <el-table-column prop="categoryType" label="分類" align="center">
        <template #default="{ row }">
          <dict-tag :options="categoryTypeOptions" :value="row.categoryType"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column prop="categoryId" label="目錄id" sortable align="center" />
      <el-table-column prop="orderNum" label="排序" sortable align="center">
        <template #default="scope">
          <span v-show="editIndex != scope.row.categoryId" @click="editCurrRow(scope.row.categoryId)">{{ scope.row.orderNum }}</span>
          <el-input
            :ref="setColumnsRef"
            v-show="editIndex == scope.row.categoryId"
            v-model="scope.row.orderNum"
            @blur="handleChangeSort(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="introduce" label="介紹" :show-overflow-tooltip="true" />
      <el-table-column prop="createTime" label="添加時間" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="parentId" label="父級id" align="center" />

      <el-table-column label="操作" align="center" width="140">
        <template #default="scope">
          <el-button v-hasPermi="['articlecategory:edit']" type="success" icon="edit" title="編輯" @click="handleUpdate(scope.row)"></el-button>
          <el-button v-hasPermi="['articlecategory:delete']" type="danger" icon="delete" title="刪除" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改文章目錄對話框 -->
    <el-dialog :title="title" :lock-scroll="false" v-model="open" width="550px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :lg="24">
            <el-form-item label="父級id" prop="parentId">
              <el-cascader
                class="w100"
                :options="dataList"
                :props="{ checkStrictly: true, value: 'categoryId', label: 'name', emitPath: false }"
                placeholder="請選擇上級菜單"
                clearable
                v-model="form.parentId">
                <template #default="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="目錄分類" prop="categoryType">
              <el-select v-model="form.categoryType" placeholder="請選擇分類" clearable>
                <el-option v-for="dict in categoryTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="目錄名" prop="name">
              <el-input v-model="form.name" placeholder="請輸入目錄名" />
            </el-form-item>
          </el-col>

          <el-col :lg="24">
            <el-form-item label="圖標" prop="icon">
              <el-popover placement="bottom" :width="540" trigger="click">
                <template #reference>
                  <el-input v-model="form.icon" placeholder="點擊選擇圖標" readonly>
                    <template #prefix>
                      <svg-icon v-if="form.icon" :name="form.icon" />
                      <el-icon v-else>
                        <search />
                      </el-icon>
                    </template>
                  </el-input>
                </template>
                <icon-select ref="iconSelectRef" @selected="iconSelected" />
              </el-popover>
            </el-form-item>
          </el-col>

          <el-col :lg="24">
            <el-form-item label="排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" placeholder="請輸入排序值" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="介紹" prop="introduce">
              <el-input v-model="form.introduce" placeholder="請輸入介紹" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="背景圖" prop="bgImg">
              <UploadImage ref="uploadRef" v-model="form.bgImg" :limit="1" :fileSize="15"> </UploadImage>
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
<script setup name="articlecategory">
import {
  treelistArticleCategory,
  addArticleCategory,
  delArticleCategory,
  updateArticleCategory,
  getArticleCategory,
  exportArticleCategory,
  changeSort
} from '@/api/article/articlecategory.js'
import IconSelect from '@/components/IconSelect'
const { proxy } = getCurrentInstance()
// 是否展開，默認全部摺疊
const isExpandAll = ref(false)
const refreshTable = ref(true)
//展開/摺疊操作
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

// 選中categoryId數組數組
const ids = ref([])
// 非單選禁用
const single = ref(true)
// 非多個禁用
const multiple = ref(true)
// 遮罩層
const loading = ref(false)
// 顯示搜索條件
const showSearch = ref(true)
// 查詢參數
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: undefined,
  sortType: undefined,
  categoryType: ''
})
// 彈出層標題
const title = ref('')
// 操作類型 1、add 2、edit
const opertype = ref(0)
// 是否顯示彈出層
const open = ref(false)
// 表單參數
const state = reactive({
  form: {},
  rules: {
    name: [{ required: true, message: '目錄名不能為空', trigger: 'blur' }],
    categoryType: [{ required: true, message: '目錄分類不能為空', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(state)
// 總記錄數
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const formRef = ref()

var dictParams = []

function getList() {
  loading.value = true
  treelistArticleCategory(queryParams).then((res) => {
    if (res.code == 200) {
      //dataList.value = res.data.result
      //total.value = res.data.totalNum
      dataList.value = res.data
      loading.value = false
    }
  })
}

// 關閉dialog
function cancel() {
  open.value = false
  reset()
}

// 重置表單
function reset() {
  form.value = {
    name: undefined,
    parentId: 0,
    icon: '',
    orderNum: 0,
    categoryType: undefined
  }
  proxy.resetForm('formRef')
}

// 查詢
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 添加
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加'
  opertype.value = 1
  if (queryParams.categoryType) {
    form.value.categoryType = parseInt(queryParams.categoryType)
  }
}

// 刪除按鈕操作
function handleDelete(row) {
  const Ids = row.categoryId || ids.value

  proxy
    .$confirm('是否確認刪除參數編號為"' + Ids + '"的數據項？')
    .then(function () {
      return delArticleCategory(Ids)
    })
    .then(() => {
      handleQuery()
      proxy.$modal.msgSuccess('刪除成功')
    })
    .catch(() => {})
}

// 修改按鈕操作
function handleUpdate(row) {
  reset()
  const id = row.categoryId || ids.value
  getArticleCategory(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改數據'
      opertype.value = 2

      form.value = {
        ...data
      }
    }
  })
}

// 表單提交
function submitForm() {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (form.value.categoryId != undefined && opertype.value === 2) {
        updateArticleCategory(form.value)
          .then((res) => {
            proxy.$modal.msgSuccess('修改成功')
            open.value = false
            getList()
          })
          .catch(() => {})
      } else {
        addArticleCategory(form.value)
          .then((res) => {
            proxy.$modal.msgSuccess('新增成功')
            open.value = false
            getList()
          })
          .catch((err) => {
            //TODO 錯誤邏輯
          })
      }
    }
  })
}

// 重置查詢操作
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}
// 導出按鈕操作
function handleExport() {
  proxy
    .$confirm('是否確認導出所有文章目錄數據項?', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(function () {
      return exportArticleCategory(queryParams)
    })
    .then((response) => {
      proxy.download(response.data.path)
    })
}

// 多選框選中數據
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.categoryId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

// 自定義排序
function sortChange(column) {
  if (column.prop == null || column.order == null) {
    queryParams.sort = undefined
    queryParams.sortType = undefined
  } else {
    queryParams.sort = column.prop
    queryParams.sortType = column.order
  }

  handleQuery()
}

function iconSelected(name) {
  form.value.icon = name
  document.body.click()
}

// ******************自定義編輯 start **********************
// 動態ref設置值
const columnRefs = ref([])
const setColumnsRef = (el) => {
  if (el) {
    columnRefs.value.push(el)
  }
}
const editIndex = ref(-1)
// 顯示編輯排序
function editCurrRow(rowId) {
  editIndex.value = rowId

  setTimeout(() => {
    columnRefs.value[rowId].focus()
  }, 100)
}
// 保存排序
function handleChangeSort(info) {
  editIndex.value = -1
  proxy
    .$confirm('是否保存數據?')
    .then(function () {
      return changeSort({ value: info.orderNum, id: info.categoryId })
    })
    .then(() => {
      handleQuery()

      proxy.$modal.msgSuccess('修改成功')
    })
    .catch(() => {
      handleQuery()
    })
}
// ******************自定義編輯 end **********************

const categoryTypeOptions = ref([])
proxy.getDicts('article_category_type').then((response) => {
  categoryTypeOptions.value = response.data
})

handleQuery()
</script>
