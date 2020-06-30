<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
      <Select2
              :dataSource="dataSource"
              @change="change"
      >
        <a-icon slot="suffixIcon" type="down"/>
        <h2 slot="optionSlot" slot-scope="{ record }">{{ record.title }}</h2>
      </Select2>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import HelloWorld from './components/HelloWorld.vue'
import Select2 from './components/Select3.vue'

export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      locale: zhCN,
      dataSource: [],
      isRouterAlive: true
    }
  },
  components: {
    HelloWorld,
    Select2
  },
  mounted() {
    console.log(Select2.methods.requestData)
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    change () {

    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
}
</style>
