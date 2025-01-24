<template>
  <el-form ref="userRef" :model="user" :rules="rules" label-width="100px" label-position="left" style="max-width: 350px">
    <el-form-item :label="$t('user.nickName')" prop="nickName">
      <el-input v-model="user.nickName" maxlength="20" :show-word-limit="true" />
    </el-form-item>
    <el-form-item :label="$t('user.phoneNumber')" prop="phonenumber">
      <el-input v-model="user.phonenumber" maxlength="10" :show-word-limit="true" />
    </el-form-item>
    <el-form-item :label="$t('user.userEmail')" prop="email">
      <el-input v-model="user.email" maxlength="50" :show-word-limit="true" />
    </el-form-item>
    <el-form-item :label="$t('common.sex')">
      <el-radio-group v-model="user.sex">
        <el-radio :value="0">{{ $t('common.male') }}</el-radio>
        <el-radio :value="1">{{ $t('common.female') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <div style="margin-left: 40px">
      <el-button type="danger" icon="Close" @click="close">{{ $t('btn.close') }}</el-button>
      <el-button type="primary" icon="Check" @click="submit">{{ $t('btn.save') }}</el-button>
    </div>
  </el-form>
</template>

<script setup>
import { updateUserProfile } from '@/api/system/user'

const props = defineProps({
  user: {
    type: Object
  }
})

const { proxy } = getCurrentInstance()

const rules = ref({
  nickName: [{ required: true, message: '用户暱稱不能為空', trigger: 'blur' }],
  email: [
    { required: true, message: '郵箱地址不能為空', trigger: 'blur' },
    {
      type: 'email',
      message: "'請輸入正確的郵箱地址",
      trigger: ['blur', 'change']
    }
  ],
  phonenumber: [
    { required: true, message: '手機號碼不能為空', trigger: 'blur' },
    {
      pattern: /^0[9]\d{8}$/,
      message: '請輸入正確的手機號碼',
      trigger: 'blur'
    }
  ]
})

/** 提交按鈕 */
function submit() {
  proxy.$refs.userRef.validate((valid) => {
    if (valid) {
      updateUserProfile(props.user).then((response) => {
        proxy.$modal.msgSuccess('修改成功')
      })
    }
  })
}
/** 關閉按鈕 */
function close() {
  proxy.$tab.closePage()
}
</script>
