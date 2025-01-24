// 官方文檔：https://docs.microsoft.com/zh-cn/aspnet/core/signalr/javascript-client?view=aspnetcore-6.0&viewFallbackFrom=aspnetcore-2.2&tabs=visual-studio
import * as signalR from '@microsoft/signalr'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import cache from '@/plugins/cache'
import analysis from '@/signalr/analysis'

export default {
  // signalR對象
  SR: {},
  // 失敗連接重試次數
  failNum: 4,
  init(url) {
    var socketUrl = window.location.origin + url + '?clientId=' + cache.local.get('clientId')
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(socketUrl, { accessTokenFactory: () => getToken() })
      .withAutomaticReconnect() //自動重新連接
      .configureLogging(signalR.LogLevel.Warning)
      .build()
    this.SR = connection
    // 斷線重連
    connection.onclose(async (error) => {
      console.error('斷開連接了' + error)
      console.assert(connection.state === signalR.HubConnectionState.Disconnected)
      // 建議用户重新刷新瀏覽器
      await this.start()
    })

    connection.onreconnected((connectionId) => {
      ElMessage({
        message: '與服務器通訊已連接成功',
        type: 'success',
        duration: 2000
      })
      console.log('斷線重新連接成功' + connectionId)
    })

    connection.onreconnecting(async () => {
      console.log('斷線重新連接中... ')

      await this.start()
    })
    analysis.onMessage(connection)
    // 啓動
    // this.start();
  },
  /**
   * 調用 this.signalR.start().then(async () => { await this.SR.invoke("method")})
   * @returns
   */
  async start() {
    try {
      console.log('signalR-1', this.SR.state)
      //使用async和await 或 promise的then 和catch 處理來自服務端的異常
      if (this.SR.state === signalR.HubConnectionState.Disconnected) {
        await this.SR.start()
      }

      console.log('signalR-2', this.SR.state)
      return true
    } catch (error) {
      console.error(error)
      this.failNum--
      // console.log(`失敗重試剩餘次數${that.failNum}`, error)
      if (this.failNum > 0 && this.SR.state.Disconnected) {
        setTimeout(async () => {
          await this.start()
        }, 5000)
      }
      return false
    }
  }
}
