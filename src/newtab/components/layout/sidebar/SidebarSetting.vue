<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { deleteWorkArea, editWorkArea } from '~/logic/workAreaData'
import { workAreaIcon } from '~/params/workAreaIcon'
import type { WorkAreaParams } from '~/typings/website'

const props = defineProps<{
  workAreas: WorkAreaParams[]
}>()
const emits = defineEmits(['getWorkAreasList', 'destroy'])

const sideBarSettingRef = ref<HTMLElement | null>(null)

const visible = ref(false)

function handleShowSidebarSetting() {
  visible.value = !visible.value
}

// --------------------------添加新的工作区------------------------------//
const currentWorkAreaCfg = ref<WorkAreaParams>({
  layoutName: `新工作区${props.workAreas.length || 1}`,
  icon: '',
  index: props.workAreas.length + 1,
  isChecked: true,
  remark: {},
})
watch(() => props.workAreas, () => {
  currentWorkAreaCfg.value = {
    layoutName: `新工作区${props.workAreas.length || 1}`,
    icon: '',
    index: props.workAreas.length + 1,
    isChecked: true,
    remark: {},
  }
})

// ------------------------------弹窗 start-----------------------------------------//
const modalRef = ref<typeof import('~/components/CustomModal.vue').default | null>(null)
function handleOpenModal() {
  modalRef.value?.open()
}
function handleCloseModal() {
  modalRef.value?.close()
}
// ------------------------------弹窗 start-----------------------------------------//

function handleSelectedCurrentWorkAreaIcon(item: typeof workAreaIcon[number]) {
  if (currentWorkAreaCfg.value.icon === item.icon)
    currentWorkAreaCfg.value.icon = ''
  else
    currentWorkAreaCfg.value.icon = item.icon
}
function handleAddWorkArea() {
  // 名称
  if (currentWorkAreaCfg.value.layoutName === '') {
    addNameShakeAnimation()
    return
  }
  // 图标
  if (currentWorkAreaCfg.value.icon === '') {
    addIconShakeAnimation()
    return
  }

  // 2. 存储
  const { id, layoutName, index, icon, isChecked } = currentWorkAreaCfg.value

  editWorkArea({
    id,
    layoutName,
    index,
    icon,
    isChecked,
    remark: {},
  }).then(async () => {
    emits('getWorkAreasList')

    handleCloseModal()
  })

  async function addNameShakeAnimation() {
    const animateOutDom1 = document.querySelectorAll('.name-tooltip')[0] as HTMLElement
    animateOutDom1.classList.add('shake-animation')
    animateOutDom1.innerHTML = '请输入名称'

    const ANIMATIONS1 = animateOutDom1.getAnimations()

    await Promise.all(ANIMATIONS1.map(animation => animation.finished))

    animateOutDom1.classList.remove('shake-animation')
    animateOutDom1.innerHTML = ''
  }

  async function addIconShakeAnimation() {
    const animateOutDom1 = document.querySelectorAll('.icon-tooltip')[0] as HTMLElement
    animateOutDom1.classList.add('shake-animation')
    animateOutDom1.innerHTML = '请选择图标'

    const ANIMATIONS1 = animateOutDom1.getAnimations()

    await Promise.all(ANIMATIONS1.map(animation => animation.finished))

    animateOutDom1.classList.remove('shake-animation')
    animateOutDom1.innerHTML = ''
  }
}

function changeCheckbox(item: WorkAreaParams) {
  const { id, layoutName, isChecked, index, icon } = item

  const isCheckedAreas = props.workAreas.filter(item => item.isChecked === true)
  if (isCheckedAreas.length > 1) {
    editWorkArea({
      id,
      layoutName,
      index,
      icon,
      isChecked,
      remark: {},
    }).then(async () => {
      emits('getWorkAreasList')
    })
  }
  else {
    // eslint-disable-next-line no-alert
    alert('请至少显示一个工作区')
    emits('getWorkAreasList')
  }
}

// -------------------------------------------------------------------//
const operateMenuRef = ref<typeof import('~/components/CustomContextMenu.vue').default | null>(null)
const contextMenuOptions = [
  { label: '编辑', key: 'edit' },
  { label: '删除', key: 'delete' },
]
const contextMenuPosition = ref({ x: 0, y: 0 })
function openMenuToEdit(item: WorkAreaParams, e: MouseEvent) {
  contextMenuPosition.value = {
    x: e.clientX + 10,
    y: e.clientY + 10,
  }
  operateMenuRef.value?.open()

  currentWorkAreaCfg.value = { ...item }
}

function handleSelectContextMenu(item: typeof contextMenuOptions[number]) {
  switch (item.key) {
    case 'edit':
      edit()
      break
    case 'delete':
      del()
      break

    default:
      break
  }

  function del() {
    if (props.workAreas.length === 1) {
      // eslint-disable-next-line no-alert
      alert('最后一个工作区不能删除')
    }
    else {
      deleteWorkArea(currentWorkAreaCfg.value.id!)
        .then(async () => {
          emits('getWorkAreasList')
        })
    }
  }

  function edit() {
    modalRef.value?.open()
  }
}

// -------------------------------------------------------------------//

onClickOutside(sideBarSettingRef, () => {
  // 要是修改或者新增弹窗并没有打开的话，鼠标点到其他地方，当前设置面板关闭
  if (
    (operateMenuRef.value && operateMenuRef.value.visible)
    || (modalRef.value && modalRef.value.visible)
  ) {
    // 小弹窗或者大弹窗打开的话，不关闭
  }
  else {
    visible.value = false
  }
})
</script>

<template>
  <div>
    <div
      ref="sideBarSettingRef"
      class=" relative "
      :class="visible ? 'bg-[#484E64]' : ''"
      @click="handleShowSidebarSetting"
    >
      <!-- 图标 -->
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <div class="hover:bg-[#484E6490] w-32px h-32px bg-[transparent] rounded-6px grid place-items-center cursor-pointer group">
              <svg class="w-18px h-18px group-hover-scale-120 transition-transform ease-in-out" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2" /><circle cx="12" cy="12" r="3" /></g></svg>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>侧边栏设置</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- 面板 -->
      <Transition
        name="scale"
        @after-leave="$emit('destroy')"
      >
        <div
          v-if="visible"
          class="
            w-320px h-80vh min-h-300px
            absolute z-999
            rounded-10px
            bg-[#252835] text-white
            select-none py-1
            flex flex-col justify-start
            left-45px bottom-0
            origin-bottom-left
            cursor-default
          "
          @click.stop
        >
          <!-- title -->
          <div class="w-full h-8 flex flex-row justify-between items-center px-4">
            <div class="text-14px font-bold">
              侧边栏设置
            </div>

            <div
              class="
                cursor-pointer
                text-white
                rounded-full
                w-4 h-4
              "
            >
              <div class="w-full h-full" i-carbon-close @click="visible = !visible" />
            </div>
          </div>

          <!-- 工作区 -->
          <div class="w-full h-fit overflow-x-hidden overflow-y-auto ">
            <div
              class="
                p-4 m-10px
                rounded-10px
                bg-[#484e6438]
              "
            >
              <!-- 总 -->
              <div class="w-full h-14px mb-10px flex flex-row justify-between items-center text-12px">
                <div class="font-bold">
                  工作区
                </div>
              <!-- <input
                type="checkbox"
                class="text-16px select-none toggle toggle-sm [--tglbg:#bcbbc1] border-#aaaaaa checked:[--tglbg:#45B0E6] checked:border-#45B0E6 bg-white hover:bg-#ffffff "
                checked
              > -->
              </div>

              <div>
                <!-- 列表 -->
                <div
                  v-for="item in workAreas"
                  :key="item.id"
                >
                  <div
                    class="
                    rounded-md
                    flex flex-row justify-between items-center
                    h-36px
                    text-12px
                  "
                  >
                    <div class="flex flex-row justify-start items-center gap-10px ">
                      <div
                        v-if="item.icon"
                        class="w-18px h-18px"
                        v-html="item.icon"
                      />
                      <div>
                        {{ item.layoutName }}
                      </div>
                    </div>

                    <div class="flex flex-row justify-start items-center gap-10px ">
                      <div @click="e => openMenuToEdit(item, e)">
                        <div class="w-4 h-4 cursor-pointer" i-carbon-overflow-menu-horizontal />
                      </div>

                      <div>
                        <input
                          v-model="item.isChecked"
                          type="checkbox"
                          title="隐藏/显示"
                          class="
                            checkbox checkbox-xs [--chkbg:#45B0E6]
                          border-#45B0E6 checked:border-#45B0E6
                          "
                          @change="changeCheckbox(item)"
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div
                  class="
                    flex flex-row justify-center items-center gap-10px
                    h-36px w-full text-12px
                    cursor-pointer rounded-8px
                    bg-#474d63
                    mt-2
                    border-2 border-transparent
                    duration-200 ease-in-out transition-all
                    hover:border-#767fa2a1
                  "
                  @click="handleOpenModal"
                >
                  <svg class="w-18px h-18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9s-9-1.8-9-9s1.8-9 9-9m3 9H9m3-3v6" />
                  </svg>
                  <div>
                    添加更多
                  </div>
                </div>
              </div>
            </div>

            <!-- 设置 -->
            <div
              class="
                p-4 m-10px
                rounded-10px
                bg-[#484e6438]
              "
            >
              <div class="w-full h-14px flex flex-row justify-between items-center text-12px ">
                <div class="font-bold">
                  设置
                </div>
              </div>

              <div>
              <!-- 列表 -->
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <CustomModal ref="modalRef">
      <div class="modal-content-container flex flex-col justify-around items-center my-4 mx-2 w-270px">
        <!-- title -->
        <div class="flex flex-col w-full">
          <!-- 图标 -->
          <div>
            <div class="my-2 text-14px select-none block">
              图标
              <div class="icon-tooltip text-red-600 text-12px inline-block" />
            </div>
            <div class="w-full h-fit my-4 grid grid-cols-6 justify-items-center gap-y-15px">
              <div
                v-for="item in workAreaIcon"
                :key="item.name"
                class="w-30px h-30px bg-[#404459] grid place-items-center rounded-md cursor-pointer"
                :class="currentWorkAreaCfg.icon === item.icon ? '!bg-#45B0E6' : ''"
                @click="handleSelectedCurrentWorkAreaIcon(item)"
              >
                <div class="w-20px h-20px" v-html="item.icon" />
              </div>
            </div>
          </div>
          <!-- 名称 -->
          <div>
            <label for="name-input" class="my-2 text-14px select-none block">
              名称
              <div class="name-tooltip text-red-600 text-12px inline-block" />
            </label>
            <input
              id="name-input"
              v-model="currentWorkAreaCfg.layoutName"
              :maxlength="128"
              type="text"
              class="
                w-full h-8 text-14px
                rounded-6px
              bg-[#404459] text-[#fafafa]
                box-border px-16px py-8px
                outline-none
              "
            >
          </div>
          <!-- 操作按钮 -->
          <div class="flex flex-row justify-between gap-6 mt-32px w-full">
            <button
              class="
                cancel-btn
                w-1/2 h-32px text-14px
                rounded-6px
                bg-[#40445955] text-[#fafafa]
                hover:bg-[#4044596b]
              "
              @click="handleCloseModal"
            >
              取消
            </button>

            <button
              class="
                ok-btn
                w-1/2 h-32px text-14px
                rounded-6px
                bg-[#404459] text-[#fafafa]
                hover:bg-[#4044596b]
              "
              @click="handleAddWorkArea"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </CustomModal>

    <CustomContextMenu
      ref="operateMenuRef"
      :x="contextMenuPosition.x"
      :y="contextMenuPosition.y"
      :options="contextMenuOptions"
      @select="handleSelectContextMenu"
    />
  </div>
</template>

<style scoped>
.scale-enter-active {
  animation: scale-in 0.2s;
}
.scale-leave-active {
  animation: scale-in 0.2s reverse;
}
@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.shake-animation {
  animation: move 2s 0s forwards;
  -webkit-animation: move 2s 0s forwards;
  transform-origin: bottom;
  -webkit-transform-origin: bottom;
}

::-webkit-scrollbar {
  width: 4px;
  height: 3px;
  background-color: transparent;
  border-radius: 8px;
}
::-webkit-scrollbar-track-piece {
  width: 12px;
  background-color: transparent;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:vertical {
  width: 24px;
  height: 24px;
  background: #484e64;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:horizontal {
  width: 12px;
  height: 12px;
  background: #484e64;
  border-radius: 8px;
}
::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scrollbar-corner {
  display: none;
}
</style>
