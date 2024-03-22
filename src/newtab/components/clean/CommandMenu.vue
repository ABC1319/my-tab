<script setup lang="ts">

</script>

<template>
  <div class="appFrame">
    <!-- <div class="glow" /> -->
    <div class="navigationBar">
      <a class="backButton">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="icon">
          <path
            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M6.25 4.75 2.75 8m0 0 3.5 3.25M2.75 8h10.5"
          />
        </svg>
      </a>

      <input
        type="text" name="searchInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
        class="searchInput" placeholder="Search Store for Extensions" value=""
      >

      <div class="queryDropdown">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" style="height: 16px;">
          <path
            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9.093 2.094S10.531 4.083 10.531 8s-1.438 5.906-1.438 5.906M6.907 2.094S5.469 4.083 5.469 8s1.438 5.906 1.438 5.906M1.755 8h12.49m.005 0a6.25 6.25 0 1 1-12.5 0 6.25 6.25 0 0 1 12.5 0Z"
          />
        </svg><span>Public</span><svg
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"
          style="height: 11px;"
        >
          <path
            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12.25 5.75 8 10.25l-4.25-4.5"
          />
        </svg>
      </div>
    </div>

    <div class="content">
      <div class="section">
        <strong>Featured</strong>
        <div class="items">
          <a class="extension" href="https://www.raycast.com/HelloImSteven/sips">链接1</a>
          <a class="extension" href="https://www.raycast.com/HelloImSteven/sips">链接2</a>
          <a class="extension" href="https://www.raycast.com/HelloImSteven/sips">链接3</a>
        </div>
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
      <span class="actionLabel">Store</span>

      <div class="actions">
        <span class="action mainAction">
          Show Details
          <div class="hotKeys">
            <i class="hotKey">↵</i>
          </div>
        </span>
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

<style scoped>
.appFrame {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 750px;
  height: 475px;
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
  border-bottom: 0.5px solid hsla(0, 0%, 100%, 0.1);
}

.backButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 12px;
  background: hsla(0, 0%, 100%, 0.1);
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
}

.queryDropdown {
  color: #fff;
  -webkit-font-smoothing: antialiased;
  display: flex;
  gap: 10px;
  align-items: center;
  width: 256px;
  height: 32px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.1px;
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  border-radius: 8px;
}
.queryDropdown > span {
  flex-grow: 1;
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
.items {
  padding: 0 5px;
}
.extension {
  height: 58px;
  background: transparent;
  border-radius: 6px;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  text-decoration: none;
  color: #fff;

  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: #fff;
  text-overflow: ellipsis;
  letter-spacing: 0.1px;
  white-space: nowrap;
}
.extension:hover {
  background: hsla(0, 0%, 100%, 0.1);
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
.hotKeys::after {
  display: inline-block;
  width: 2px;
  height: 12px;
  margin: 0 8px;
  content: '';
  box-sizing: border-box;
  background: hsla(0, 0%, 100%, 0.1);
  border-radius: 3px;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.1px;
}
</style>
