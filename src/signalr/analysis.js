import { ElNotification, ElMessageBox } from 'element-plus'
import useSocketStore from '@/store/modules/socket'
import useUserStore from '@/store/modules/user'
import { webNotify } from '@/utils/index'
import gongaoIcon from '@/assets/icons/svg/gonggao.svg'

export default {
  onMessage(connection) {
    connection.on(MsgType.M001, (data) => {
      useSocketStore().setOnlineUsers(data)
    })

    // 接收後台手動推送消息
    connection.on('receiveNotice', (title, data) => {
      ElNotification({
        type: 'info',
        title: title,
        message: data,
        dangerouslyUseHTMLString: true,
        duration: 0
      })
      webNotify({ title: title, body: '你有一條新消息', icon: gongaoIcon })
    })
    // 接收系統通知/公告
    connection.on('moreNotice', (data) => {
      if (data.code == 200) {
        useSocketStore().setNoticeList(data.data)
      }
    })

    // 接收在線用户
    // connection.on('onlineUser', (data) => {
    //   useSocketStore().setOnlineUsers(data)
    // })

    // 接收強退通知
    connection.on('forceUser', (data) => {
      useSocketStore().setGlobalError({ code: 0, msg: `你的賬號已被強退，原因：${data.reason || '無'}` })
      useUserStore()
        .logOut()
        .then(() => {
          location.href = import.meta.env.VITE_APP_ROUTER_PREFIX + 'error'
        })
    })
    // 接收聊天數據
    connection.on('receiveChat', (data) => {
      const { fromUser, message } = data

      useSocketStore().setChat(data)
      if (data.userId != useUserStore().userId) {
        ElNotification({
          title: fromUser.nickName,
          message: message,
          type: 'success',
          duration: 3000
        })
        webNotify({ title: '來自：' + fromUser.nickName, body: message, icon: gongaoIcon })
      }
    })

    connection.on('onlineInfo', (data) => {
      useSocketStore().getOnlineInfo(data)
    })

    connection.on(MsgType.LogOut, () => {
      useUserStore()
        .logOut()
        .then(() => {
          ElMessageBox.alert(`你的賬號已在其他設備登錄，如果不是你的操作請儘快修改密碼`, '提示', {
            confirmButtonText: '確定',
            callback: () => {
              location.href = import.meta.env.VITE_APP_ROUTER_PREFIX + 'index'
            }
          })
        })
    })
  }
}
const MsgType = {
  M001: 'onlineNum',
  M002: 'connId',
  LogOut: 'logOut'
}
