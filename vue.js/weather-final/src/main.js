import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App) // creatapp이 vue에서 제공하는 함수

app.use(createPinia())
app.use(router) // 길찾기 기능 장착

app.mount('#app') // mount는 화면에서 component를 화면에 붙임. 메모리 속 자바스크립트 상태로만 존재하던 Vue앱을 index.html 파일 안에 있는 <div id="app"></div> 태그 위치에 실제 눈에 보이는 HTML로 그려 넣는 명령
