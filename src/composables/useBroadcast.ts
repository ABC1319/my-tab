/**
 * 窗口通信
 * @returns {
 *  data: BroadcastChannel
 *  onmessage: () => void
 *  synchronizeWebsites: () => void
 *  synchronizeSidebar: () => void
 * }
 *
 * // 调用
 * broadcast.synchronizeWebsites()
 * // 监听
 * broadcast.onmessage((event: MessageEvent<any>) => {
 *  console.log(event, 'broadcast')
 * })
 */
export function useBroadcast() {
  const broadcastChannel = new BroadcastChannel('broadcast')

  const broadcast = {

    data: broadcastChannel,

    onmessage(callback: (event: MessageEvent<any>) => void) {
      broadcastChannel.onmessage = callback
    },

    synchronizeWebsites(value?: any) {
      broadcastChannel.postMessage(
        JSON.stringify({
          cmd: 'SynchronizeWebsites',
          data: null,
        }),
      )
    },

    synchronizeSidebar(value?: any) {
      broadcastChannel.postMessage(
        JSON.stringify({
          cmd: 'synchronizeSidebar',
          data: null,
        }),
      )
    },
  }

  return broadcast
}
