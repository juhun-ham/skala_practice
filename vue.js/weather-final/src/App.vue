<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import ko from 'element-plus/es/locale/lang/ko'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const route = useRoute()

const activeMenu = computed(() => {
  if (route.path === '/weather/about') return '/weather/about'
  if (route.path === '/weather/guide') return '/weather/guide'

  return '/weather'
})
</script>

<template>
  <el-config-provider :locale="ko">
    <header class="app-header">
      <div class="header-inner">
        <div class="left-navigation">
          <div class="brand">🌤️ Weather Desk</div>

          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            router
            :ellipsis="false"
            class="navigation-menu"
          >
            <el-menu-item index="/weather">날씨 대시보드</el-menu-item>
            <el-menu-item index="/weather/guide">날씨 가이드</el-menu-item>
            <el-menu-item index="/weather/about">서비스 소개</el-menu-item>
          </el-menu>
        </div>

        <div class="unit-control">
          <UnitToggler />
        </div>
      </div>
    </header>

    <div class="page-content">
      <RouterView />
    </div>
  </el-config-provider>
</template>

<style>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #dce5f0;
  box-shadow: 0 2px 10px rgb(23 59 108 / 6%);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: min(1440px, calc(100% - 48px));
  min-height: 72px;
  margin: 0 auto;
  gap: 24px;
}

.left-navigation {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 24px;
}

.brand {
  flex: none;
  color: #173b6c;
  font-size: 18px;
  font-weight: bold;
}

.navigation-menu {
  min-width: 410px;
  border-bottom: none !important;
  --el-menu-active-color: #2458a6;
  --el-menu-hover-bg-color: #f1f5fb;
}

.unit-control {
  flex: none;
}

.page-content {
  min-height: calc(100vh - 73px);
  padding: 36px 24px 64px;
}

@media (max-width: 1040px) {
  .header-inner,
  .left-navigation {
    align-items: stretch;
    flex-direction: column;
  }

  .header-inner {
    width: min(100% - 32px, 760px);
    padding: 16px 0;
  }

  .left-navigation {
    gap: 8px;
  }

  .navigation-menu {
    width: 100%;
    min-width: 0;
  }

  .unit-control {
    width: 100%;
  }

  .page-content {
    padding: 24px 16px 48px;
  }
}
</style>
