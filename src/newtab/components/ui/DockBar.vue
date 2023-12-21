<script setup lang="ts">
const blocks = Array(4).fill(0)
</script>

<template>
  <div class="dock-wrapper">
    <ul class="dock">
      <li v-for="(_item, index) in blocks" :key="index">
        <img :src="`https://assets.codepen.io/89905/matroshka-0${index + 1}.svg`" alt="" title="" width="222" height="184" draggable="false">
      </li>

      <li data-separator>
        <img src="https://assets.codepen.io/89905/matroshka-03.svg" alt="" title="" width="222" height="184" draggable="false">
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dock li {
  transition: width 0.25s ease;
}
.dock li img {
  transform-origin: 50% 100%;
  transition: all 0.25s ease;
}

/* The hovered li */
.dock li:hover {
  width: 80px;
}
.dock li:hover img {
  translate: 0% -15%;
}

/* The element before and after the hovered li */
.dock li:hover + li,
.dock li:has(+ li:hover) {
  width: 60px;
}

:is(.dock li:hover + li, .dock li:has(+ li:hover)) img {
  translate: 0% -5%;
}

@layer components {
  @layer dock {
    .dock-wrapper {
      width: auto;
      height: auto;

      position: absolute;
      bottom: 1em;
      left: 50%;
      transform: translateX(-50%);
    }

    .dock {
      width: auto;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 1em;
      background: #252835;
      backdrop-filter: blur(1em);
      border: 0.05em solid rgb(255 255 255 / 0.18);
      gap: 8px;
      padding: 8px !important;
    }

    .dock li {
      width: 40px;
      height: 40px;

      display: flex;
      flex-direction: column;
      justify-content: end;

      position: relative;
    }

    .dock li[data-separator] {
      padding-left: 0.5em;
    }

    .dock li[data-separator]::before {
      content: '';
      position: absolute;
      height: 100%;
      width: 0.05em;
      left: 0;
      background: rgb(255 255 255 / 0.4);
    }
  }
}
</style>
