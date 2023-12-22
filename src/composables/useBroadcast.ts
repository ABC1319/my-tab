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
