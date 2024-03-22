<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { appSearchEngine } from '~/logic/storage'
import { searchEngine } from '~/params/searchEngine'
import type { ISearchEngine } from '~/typings/app'

const searchText = ref('')

const defaultSearchArr = ref<ISearchEngine[]>(searchEngine)

function handleSelectEngine(item: ISearchEngine) {
  appSearchEngine.value = item
}

function handleSearchInEngine() {
  window.open(`${appSearchEngine.value.url}${searchText.value}`)
}

const keys = useMagicKeys()
const AltQ = keys['Alt+Q']

watch(AltQ, (v) => {
  if (v) {
    const index = defaultSearchArr.value.findIndex(item => item.webName === appSearchEngine.value.webName)
    handleSelectEngine(defaultSearchArr.value[(index + 1) % defaultSearchArr.value.length])
  }
})
</script>

<template>
  <div class="appFrame">
    <!-- <div class="glow" /> -->
    <div class="navigationBar">
      <a class="backButton">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21l-4.3-4.3" /></g></svg>
      </a>

      <input
        v-model="searchText"
        type="text"
        class="searchInput"
        placeholder="按下回车检索, 按下Alt+Q切换搜索引擎"
        autofocus
        @keyup.enter="handleSearchInEngine"
      >

      <select
        v-model="appSearchEngine.webName"
        class="queryDropdown outline-none! shadow-none!"
      >
        <!-- <div class="queryDropdownContent"> -->
        <option
          v-for="item in defaultSearchArr"
          :key="item.webName"
          class=" hover:bg-#27272a! cursor-pointer"
          :value="item.webName"
          @click="handleSelectEngine(item)"
        >
          <div>{{ item.webName }}</div>
        </option>
        <!-- </div> -->
      </select>
    </div>

    <div class="content">
      <div class="section">
        <strong>Featured</strong>
      </div>
    </div>

    <div class="actionBar">
      <div class="storeIcon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="icon">
          <path
            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M7.75 8h3.5m-6.5 0h.5m-1.5 3h8.5a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-8.5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2ZM11.875 1.75h-7.75a.375.375 0 1 0 0 .75h7.75a.375.375 0 0 0 0-.75ZM11.875 14.25h-7.75a.375.375 0 0 1 0-.75h7.75a.375.375 0 0 1 0 .75Z"
          />
        </svg>
      </div>
      <span class="actionLabel">TabTab</span>

      <div class="actions">
        <span class="action">
          Actions
          <div class="hotKeys">
            <i class="hotKey">⌘</i>
            <i class="hotKey">k</i>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
.appFrame {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 750px;
  height: 475px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  -webkit-backdrop-filter: blur(72px);
  backdrop-filter: blur(72px);
  border: 1px solid #8f8d9133;
  border-radius: 12px;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.8),
    0 4px 40px 8px rgba(0, 0, 0, 0.4),
    inset 0 0.5px 0 hsla(0, 0%, 100%, 0.3);
  transform: translateZ(0);
}

.glow {
  display: block;
  position: absolute;
  left: -24px;
  z-index: -1;
  width: calc(100% + 24px);
  height: calc(100% + 24px);
  content: '';
  background: hsla(0, 0%, 100%, 0.1);
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  border-radius: 0 24px 24px 24px;
  -webkit-mask-image: linear-gradient(
    40deg,
    #fff 16.35%,
    hsla(0, 0%, 100%, 0) 39.66%
  );
  mask-image: linear-gradient(40deg, #fff 16.35%, hsla(0, 0%, 100%, 0) 39.66%);
}

.navigationBar {
  position: relative;
  display: flex;
  gap: 8px;
  align-items: center;
  height: 56px;
  padding: 16px;
  border-bottom: 0.5px solid #ffffff1a;
}

.backButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 12px;
  background: #ffffff1a;
  border-radius: 8px;
  color: white;
  text-decoration: none;
}
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: inherit;
}

.searchInput {
  display: flex;
  flex-grow: 1;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.1px;
  background: none;
  border: 0;
  outline: none;
  margin: 0;
  color: white;
}

.queryDropdown {
  background: #0f1016;
  text-align: start !important;
  color: #fff !important;
  -webkit-font-smoothing: antialiased !important;
  display: flex !important;
  gap: 10px !important;
  align-items: center !important;
  width: 142px !important;
  height: 32px !important;
  padding: 0 10px !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  line-height: 16px !important;
  letter-spacing: 0.1px !important;
  border: 1px solid #ffffff33 !important;
  border-radius: 8px !important;
}
.queryDropdownContent {
  color: #fff !important;
  padding: 0 10px !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  line-height: 16px !important;
  letter-spacing: 0.1px !important;
  border: 1px solid hsla(0, 0%, 100%, 0.2) !important;
  border-radius: 8px !important;
}
.queryDropdown > span {
  flex-grow: 1;
}
.queryDropdown:focus {
  box-shadow: none !important;
}

/* 中间的内容 */
.content {
  flex-grow: 1;
  height: 0;
  overflow-y: hidden;
}
.section > strong {
  padding: 16px 16px 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  color: hsla(0, 0%, 100%, 0.6);
  letter-spacing: 0.1px;
}
.section {
  display: flex;
  flex-direction: column;
}

/* footer */
.actionBar {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: hsla(0, 0%, 100%, 0.6);
  letter-spacing: 0.1px;
  background: rgba(0, 0, 0, 0.1);
  -webkit-backdrop-filter: blur(96px);
  backdrop-filter: blur(96px);
  border-top: 1px solid hsla(270, 2%, 56%, 0.2);
  border-radius: 0 0 11px 11px;
  transform: translateZ(0);
}
.storeIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18.7px;
  height: 18.7px;
  font-size: 12px;
  color: #fff;
  background: linear-gradient(135deg, #ff6363, #d72a2a);
  border-radius: 6px;
}
.actionLabel {
  flex-grow: 1;
}
.actions {
  display: flex;
}
.action {
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.1px;
}
.hotKeys {
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: #fff;
  display: flex;
  gap: 4px;
  margin-left: 10px;
}
.hotKey {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 10px;
  color: hsla(0, 0%, 100%, 0.6);
  text-transform: uppercase;
  background: hsla(0, 0%, 100%, 0.1);
  border-radius: 4px;
}
</style>
