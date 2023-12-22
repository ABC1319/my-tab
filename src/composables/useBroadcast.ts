/**
 * 窗口通信
 * 1. sidebar
 * 2. usefulSite
 * @returns {
 *  data: BroadcastChannel
 *  synchronizeWebsites: () => void
 *  synchronizeSidebar: () => void
 * }
 *
 * @demo
 * function handleSynchronize() {
 *   broadcast.syncWebsites.listen(async (event: MessageEvent<any>) => {
 *     if (JSON.parse(event.data).cmd === 'SyncWebsites') {
 *       await getList()
 *       resetLayout()
 *     }
 *   })
 * }
 * function noticeSynchronize() {
 *   broadcast.syncWebsites.call()
 * }
 * @return broadcast
 */
export function useBroadcast() {
  const broadcastChannel = new BroadcastChannel('broadcast')
  const messageCallbacks: ((event: MessageEvent<any>) => void)[] = []

  const broadcast = {

    data: broadcastChannel,

    syncWebsites: {
      call(value?: any) {
        broadcastChannel.postMessage(
          JSON.stringify({
            cmd: 'SyncWebsites',
            data: value,
          }),
        )
      },
      listen(callback: (event: MessageEvent<any>) => void) {
        messageCallbacks.push(callback)
      },
    },

    syncSearchEngine: {
      call(value?: any) {
        broadcastChannel.postMessage(
          JSON.stringify({
            cmd: 'syncSearchEngine',
            data: value,
          }),
        )
      },
      listen(callback: (event: MessageEvent<any>) => void) {
        messageCallbacks.push(callback)
      },
    },

    /**
     * 这里的同步，纯粹是不同窗口直接动画时间的一致性
     * 否则，因为 sidebar 的状态是存储在 useStorageLocal 中，直接 watch 监听就行了
     * 但是因为状态是在第一个窗口的动画结束后才更改的，所以如果 watch 状态，会导致别的窗口动画慢一步
     */
    syncSidebar: {
      call(value?: any) {
        broadcastChannel.postMessage(
          JSON.stringify({
            cmd: 'syncSidebar',
            data: value,
          }),
        )
      },
      listen(callback: (event: MessageEvent<any>) => void) {
        messageCallbacks.push(callback)
      },
    },

  }

  broadcastChannel.onmessage = (event) => {
    messageCallbacks.forEach((callback) => {
      callback(event)
    })
  }

  return broadcast
}
