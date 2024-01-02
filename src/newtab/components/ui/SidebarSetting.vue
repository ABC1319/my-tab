<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { editWorkArea } from '~/logic/workAreaData'
import { workAreaIcon } from '~/params/workAreaIcon'
import type { WorkAreaParams } from '~/typings/website'

const props = defineProps<{
  workAreas: WorkAreaParams[]
}>()
const emits = defineEmits(['getWorkAreasList', 'destroy'])

const sideBarSettingRef = ref<HTMLElement | null>(null)

// 工作区的设置
const workOptions = [
  {
    icon: workAreaIcon.find(res => res.name === 'tabler-building-tunnel')?.icon,
    label: '工作区1',
    key: 'work-area-1',
    shortcuts: '',
    isChecked: true,
  },
  {
    icon: workAreaIcon.find(res => res.name === 'tabler-brand-tabler')?.icon,
    label: '工作区1',
    key: 'work-area-2',
    shortcuts: '',
    isChecked: true,
  },
]

const visible = ref(false)

onClickOutside(sideBarSettingRef, () => {
  // visible.value = false
})
function handleShowSidebarSetting() {
  visible.value = !visible.value
}

// --------------------------添加新的工作区------------------------------//
const currentWorkAreaCfg = ref<WorkAreaParams>({
  layoutName: `新工作区${props.workAreas.length || 1}`,
  icon: '',
  index: props.workAreas.length + 1,
  remark: {},
})
watch(() => props.workAreas, () => {
  currentWorkAreaCfg.value = {
    layoutName: `新工作区${props.workAreas.length || 1}`,
    icon: '',
    index: props.workAreas.length + 1,
    remark: {},
  }
})
const modalRef = ref<typeof import('~/components/CustomModal.vue').default | null>(null)
function handleOpenModal() {
  modalRef.value?.open()
}
function handleSelectedCurrentWorkAreaIcon(item: typeof workAreaIcon[number]) {
  if (currentWorkAreaCfg.value.icon === item.icon)
    currentWorkAreaCfg.value.icon = ''
  else
    currentWorkAreaCfg.value.icon = item.icon
}
function handleAddWorkArea() {
  // 1. 名称
  if (currentWorkAreaCfg.value.layoutName === '') {
    // eslint-disable-next-line no-alert
    alert('请输入名称')
    // addShakeAnimation()
    return
  }

  // 2. 存储
  const { layoutName, index, icon } = currentWorkAreaCfg.value

  editWorkArea({
    layoutName,
    index,
    icon,
    remark: {},
  }).then(async () => {
    emits('getWorkAreasList')

    handleCloseModal()
  })
}
function handleCloseModal() {
  modalRef.value?.close()
}
</script>

<template>
  <div>
    <div
      ref="sideBarSettingRef"
      class="
        w-32px h-32px
        rounded-6px
        grid place-items-center cursor-pointer
        relative
        hover:bg-[#484E64]
      "
      @click="handleShowSidebarSetting"
    >
      <div
        class="w-5 h-5 "
        i-carbon:settings
      />

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
          <div class="w-full h-50px flex flex-row justify-between items-center px-4 pt-2 pb-4 border-b-1 border-[#bcbbc130]">
            <div class="text-16px">
              侧边栏设置
            </div>
            <div class="w-6 h-6" i-carbon-close @click="visible = !visible" />
          </div>

          <!-- 工作区 -->
          <div class="border-b-1 border-[#bcbbc130] p-4 pb-6">
            <!-- 总 -->
            <div class="w-full h-50px flex flex-row justify-between items-center">
              <div class="text-16px font-bold">
                工作区
              </div>
              <input
                type="checkbox"
                class="text-16px select-none toggle toggle-sm [--tglbg:#bcbbc1] border-#aaaaaa checked:[--tglbg:#45B0E6] checked:border-#45B0E6 bg-white hover:bg-#ffffff "
                checked
              >
            </div>
            <!-- 操作按钮 -->
            <div
              class="flex h-36px flex-row justify-start items-center gap-10px w-full cursor-pointer"
              @click="handleOpenModal"
            >
              <svg class="w-20px h-20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" @click="visible = !visible"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9s-9-1.8-9-9s1.8-9 9-9m3 9H9m3-3v6" /></svg>
              <div class="text-14px">
                添加更多
              </div>
            </div>
            <!-- 列表 -->
            <div
              v-for="item in workOptions"
              :key="item.label"
            >
              <div
                class="
                  rounded-md
                  flex flex-row justify-between items-center
                  h-36px
                "
              >
                <div class="flex flex-row justify-start items-center gap-10px ">
                  <div
                    v-if="item?.icon"
                    class="w-20px h-20px"
                    v-html="item?.icon"
                  />
                  <div class="text-14px">
                    {{ item.label }}
                  </div>
                </div>

                <div class="flex flex-row justify-start items-center gap-10px ">
                  <div>
                    <div class="w-6 h-6" i-carbon-overflow-menu-horizontal />
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      :checked="item.isChecked"
                      class="
                      checkbox checkbox-xs [--chkbg:#45B0E6]
                      border-#45B0E6 checked:border-#45B0E6
                    "
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 设置 -->
          <div class="border-b-1 border-[#bcbbc130] py-4">
            <div class="w-full flex flex-row justify-between py-2 ">
              <div class="text-16px px-4 font-bold">
                设置
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
                ok-btn
                w-1/2 h-32px text-14px
                rounded-6px
                bg-[#404459] text-[#fafafa]
                hover:bg-[#4044596b]
              "
              @click="handleAddWorkArea"
            >
              确定
            </button>
            <button
              class="
                cancel-btn
                w-1/2 h-32px text-14px
                rounded-6px
                bg-[#40445990] text-[#fafafa]
                hover:bg-[#4044596b]
              "
              @click="handleCloseModal"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
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
