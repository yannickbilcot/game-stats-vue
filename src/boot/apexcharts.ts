import { boot } from 'quasar/wrappers'
import ApexCharts from 'apexcharts';
import VueApexCharts from 'vue3-apexcharts';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $apexcharts: typeof ApexCharts;
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$apexcharts = ApexCharts;
  app.use(VueApexCharts)
})
