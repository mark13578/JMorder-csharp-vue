<template>
  <div class="app-container">
    <el-form :model="form" ref="formRef" :rules="rules" @submit.prevent>
      <el-row class="mb10">
        <el-col :lg="24">
          <el-form-item label="" prop="title">
            <el-input v-model="form.title" placeholder="請輸入文章標題（必須）" />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item prop="content" label="">
            <MdEditor v-model="form.content" :showToolbarName="true" :theme="settingsStore.codeMode" :onUploadImg="onUploadImg" />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item prop="abstractText">
            <el-input v-model="form.abstractText" type="textarea" show-word-limit maxlength="100" placeholder="請輸入文章摘要（必須）" />
          </el-form-item>
        </el-col>

        <el-col :lg="5">
          <el-form-item prop="categoryId" label="分類" label-position="100px">
            <el-cascader
              class="w100"
              :options="categoryOptions"
              :props="{ checkStrictly: true, value: 'categoryId', label: 'name', emitPath: false }"
              placeholder="請選擇文章分類"
              clearable
              v-model="form.categoryId" />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item label="標籤">
            <el-tag v-for="tag in form.dynamicTags" :key="tag" class="mr10" closable :disable-transitions="false" @close="handleCloseTag(tag)">
              {{ tag }}
            </el-tag>
            <el-input
              size="small"
              v-if="inputVisible"
              style="width: 150px"
              ref="inputRef"
              v-model="inputValue"
              maxLength="8"
              placeholder="最多8個字符"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm" />

            <el-button v-else class="button-new-tag" size="small" icon="plus" text @click="showInput">文章標籤</el-button>
          </el-form-item>
        </el-col>
        <el-col :lg="8">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="不公開只有自己會看到" placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                是否公開
              </span>
            </template>
            <el-switch v-model="form.isPublic" inline-prompt :active-value="1" :in-active-value="0" active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>

        <el-col :lg="24">
          <el-form-item>
            <UploadImage ref="uploadRef" v-model="form.coverUrl" :limit="1" :fileSize="15" style="width: 90px">
              <template #icon>
                <div class="upload-wrap">
                  <el-icon class="avatar-uploader-icon"><plus /></el-icon>
                  <div>請選擇封面</div>
                </div>
              </template>
            </UploadImage>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="btn-wrap">
      <el-button type="success" @click="handlePublish('1')">發佈文章</el-button>
      <el-button @click="handlePublish('2')" v-if="!info || info.status == 2">存為草稿</el-button>
    </div>
  </div>
</template>
<script setup name="articlepublish">
import { addArticle, updateArticle, getArticle } from '@/api/article/article.js'
import { treelistArticleCategory } from '@/api/article/articlecategory.js'
import useSettingsStore from '@/store/modules/settings'
import { upload } from '@/api/common.js'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const settingsStore = useSettingsStore()
const { proxy } = getCurrentInstance()
const route = useRoute()
// 文章目錄下拉框
const categoryOptions = ref([])
const inputVisible = ref(false)
const inputValue = ref('')
const formRef = ref()
const inputRef = ref()
const data = reactive({
  form: {
    dynamicTags: [],
    fmtType: 'markdown',
    tags: undefined,
    cid: undefined,
    content: undefined,
    status: undefined,
    categoryId: undefined,
    isPublic: 1,
    abstractText: undefined,
    editorType: 'markdown'
  },
  rules: {
    title: [{ required: true, message: '標題不能為空', trigger: 'blur' }],
    content: [{ required: true, message: '內容不能為空', trigger: 'blur' }],
    abstractText: [{ required: true, message: '摘要不能為空', trigger: 'blur' }]
  }
})
const { form, rules } = toRefs(data)

const cid = route.query.cid
form.value.cid = cid

/** 查詢菜單下拉樹結構 */
function getCategoryTreeselect() {
  treelistArticleCategory({}).then((res) => {
    if (res.code == 200) {
      categoryOptions.value = res.data
    }
  })
}

// 將圖片上傳到服務器，返回地址替換到md中
async function onUploadImg(files, callback) {
  const res = await Promise.all(
    Array.from(files).map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData()
        form.append('file', file)

        upload(form)
          .then((res) => rev(res))
          .catch((error) => rej(error))
      })
    })
  )

  callback(res.map((item) => item.data.url))
}

/** 提交按鈕 */
function handlePublish(status) {
  form.value.status = status
  form.value.tags = form.value.dynamicTags.toString()

  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (form.value.cid != undefined) {
        updateArticle(form.value).then((res) => {
          if (res.code == 200) {
            if (status == 1) {
              proxy.$modal.msgSuccess('發佈文章成功')
              proxy.$tab.closeOpenPage({ path: '/article/index' })
            } else {
              proxy.$modal.msgSuccess('保存成功')
            }
          } else {
            proxy.$modal.msgError('修改文章失敗')
          }
        })
      } else {
        addArticle(form.value).then((res) => {
          if (res.code == 200) {
            form.value.cid = res.data
            if (status == 1) {
              proxy.$modal.msgSuccess('發佈文章成功')
              proxy.$tab.closeOpenPage({ path: '/article/index' })
            } else {
              proxy.$modal.msgSuccess('保存成功')
            }
          } else {
            proxy.$modal.msgError('發佈文章失敗')
          }
        })
      }
    }
  })
}
function handleCloseTag(tag) {
  form.value.dynamicTags.splice(form.value.dynamicTags.indexOf(tag), 1)
}

const showInput = () => {
  if (form.value.dynamicTags.length >= 5) {
    proxy.$modal.msgError('最多5個標籤')
    return
  }
  inputVisible.value = true
  nextTick(() => {
    inputRef.value.input.focus()
  })
}
// 標籤確認
function handleInputConfirm() {
  if (inputValue.value) {
    form.value.dynamicTags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
const info = ref()
function getInfo(cid) {
  if (!cid || cid == undefined) return
  getArticle(cid).then((res) => {
    if (res.code == 200) {
      var data = res.data
      info.value = data
      form.value = {
        ...data,
        dynamicTags: data.tags != null && data.tags.length > 0 ? data.tags.split(',') : []
      }
    }
  })
}
getInfo(cid)
getCategoryTreeselect()
</script>
<style scoped>
.app-container {
  position: relative;
}
.button-new-tag {
  padding-top: 0;
  padding-bottom: 0;
  width: 90px;
  margin-right: 10px;
  vertical-align: bottom;
}

.upload-wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #ccc;
}
.btn-wrap {
  z-index: 10;
  width: 100%;
  /* top: 0; */
  background: #fff;
  padding: 3px 20px;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: var(--base-footer-height);
}
</style>
