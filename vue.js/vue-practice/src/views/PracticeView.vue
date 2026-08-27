<script setup>
import HelloWorld from '../components/HelloWorld.vue'
import SampleOne from '../components/practices/basic/SampleOne.vue'
import SampleTwo from '../components/practices/basic/SampleTwo.vue'
import SampleThree from '../components/practices/basic/SampleThree.vue' 
import SampleFour from '../components/practices/basic/SampleFour.vue'
import SampleFive from '../components/practices/basic/SampleFive.vue'
import SampleSix from '../components/practices/basic/SampleSix.vue'
import SampleSeven from '../components/practices/basic/SampleSeven.vue'
import SampleEight from '../components/practices/basic/SampleEight.vue'
import SampleNine from '../components/practices/basic/SampleNine.vue'
import SampleTen from '../components/practices/basic/SampleTen.vue'
import SampleEleven from '../components/practices/basic/SampleEleven.vue'
import SampleTwelve from '../components/practices/basic/SampleTwelve.vue'
import SampleThirteen from '../components/practices/basic/SampleThirteen.vue'
import SampleFourteen from '../components/practices/basic/SampleFourteen.vue'
import SampleFifteen from '../components/practices/basic/SampleFifteen.vue'
import SampleSixteen from '../components/practices/basic/SampleSixteen.vue'
import SampleSeventeen from '../components/practices/basic/SampleSeventeen.vue'
import SampleEighteen from '../components/practices/basic/SampleEighteen.vue'
import SampleNineteen from '../components/practices/basic/SampleNineteen.vue'
import SampleTwenty from '../components/practices/basic/SampleTwenty.vue'
import SampleTwentyOne from '../components/practices/basic/SampleTwentyOne.vue' 
import SampleTwentyTwo from '../components/practices/basic/SampleTwentyTwo.vue' 
import SampleTwentyThree from '../components/practices/basic/SampleTwentyThree.vue'
import SampleTwentyFour from '../components/practices/basic/SampleTwentyFour.vue' 
import SampleTwentyFive from '../components/practices/basic/SampleTwentyFive.vue'
import SampleTwentySix from '../components/practices/basic/SampleTwentySix.vue'
import SampleTwentySeven from '../components/practices/basic/SampleTwentySeven.vue' 
import SampleTwentyEight from '../components/practices/basic/SampleTwentyEight.vue' 
import SampleTwentyNine from '../components/practices/basic/SampleTwentyNine.vue'
import AxiosWeather from "../components/practices/library/AxiosWeather.vue";
</script>   

<template>
  <main class="practice-container">
    <section class="practice-item">
      <HelloWorld msg="첫 번째 실습" />
    </section>

    <section class="practice-item">
      <SampleOne />
    </section>

    <section class="practice-item">
      <SampleTwo />
    </section>

    <section class="practice-item">
      <SampleThree />
    </section>

    <section class="practice-item">
      <SampleFour />
    </section>

    <section class="practice-item">
      <SampleFive />
    </section>

    <section class="practice-item">
      <SampleSix />
    </section>

    <section class="practice-item">
      <SampleSeven />
    </section>

    <section class="practice-item">
      <SampleEight />
    </section>
    
    <section class="practice-item">
      <SampleNine />
    </section>

    <section class="practice-item">
      <SampleTen />
    </section>

    <section class="practice-item">
      <SampleEleven />
    </section>

    <section class="practice-item">
      <SampleTwelve />
    </section>

    <section class="practice-item">
      <SampleThirteen />
    </section>

    <section class="practice-item">
      <SampleFourteen />
    </section>

    <section class="practice-item">
      <SampleFifteen />
    </section>

    <section class="practice-item">
      <SampleSixteen />
    </section>
    
    <section class="practice-item">
      <SampleSeventeen />
    </section>

    <section class="practice-item">
      <SampleEighteen />
    </section>

    <section class="practice-item">
      <SampleNineteen />
    </section>

    <section class="practice-item">
      <SampleTwenty />
    </section>

    <section class="practice-item">
      <SampleTwentyOne />
    </section>

    <section class="practice-item">
      <SampleTwentyTwo />
    </section>

    <section class="practice-item">
      <SampleTwentyThree />
    </section>

    <section class="practice-item">
      <SampleTwentyFour />
    </section>

    <section class="practice-item">
      <SampleTwentyFive />
    </section>

    <section class="practice-item">
      <SampleTwentySix />
    </section>

    <section class="practice-item">
      <SampleTwentySeven />
    </section>

    <section class="practice-item">
      <SampleTwentyEight />
    </section>

    <section class="practice-item">
      <SampleTwentyNine />
    </section>

    <section class="practice-item">
      <AxiosWeather />
    </section>
  </main>
</template>

<style>
body {
  display: block;
  margin: 0;
  background: #f5f5f5;
}

#app {
  display: block;
  width: 100%;
  max-width: none;
  padding: 0;
}

.practice-container {
  width: min(900px, calc(100% - 40px));
  margin: 0 auto;
  padding: 40px 0;
}

.practice-item {
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>