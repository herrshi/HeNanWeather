<template>
  <mdb-modal
    :show="showModal"
    size="lg"
    scrollable
    @show="$_modal_beforeShow"
    @close="$emit('closeDetail')"
  >
    <mdb-modal-header>
      <div class="d-flex align-items-end">
        <mdb-modal-title>
          {{ stationName }}
        </mdb-modal-title>
      </div>
    </mdb-modal-header>

    <mdb-modal-body>
      <div v-if="pollutantType === '一般废气'">
        <mdb-accordion v-for="(data, index) in airData" :key="index" table>
          <mdb-accordion-pane
            :title="data.OUTPUTNAME + '  ' + data.MONITORTIME"
            type="table"
            :is-open="openPaneNum === index"
            @pane-clicked="$_handlePaneOpened(index)"
          >
            <mdb-row>
              <mdb-col>
                <div class="table-ui p-2 mb-3 mx-3 mb-4">
                  <div class="table-responsive mx-3">
                    <table class="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>监测因子</th>
                          <th>检测值</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="factor in airShowFactors1" :key="factor">
                          <th>
                            {{ airFactors.get(factor).alias }}
                          </th>
                          <th>
                            {{
                              data[factor]
                                ? data[factor] + airFactors.get(factor).unit
                                : '无数据'
                            }}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </mdb-col>

              <mdb-col>
                <div class="table-ui p-2 mb-3 mx-3 mb-4">
                  <div class="table-responsive mx-3">
                    <table class="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>监测因子</th>
                          <th>检测值</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="factor in airShowFactors2" :key="factor">
                          <th>
                            {{ airFactors.get(factor).alias }}
                          </th>
                          <th>
                            {{
                              data[factor]
                                ? data[factor] + airFactors.get(factor).unit
                                : '无数据'
                            }}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </mdb-col>
            </mdb-row>
          </mdb-accordion-pane>
        </mdb-accordion>
      </div>

      <div v-if="pollutantType === '一般废水'">
        <mdb-accordion v-for="(data, index) in waterData" :key="index" table>
          <mdb-accordion-pane
            :title="data.OUTPUTNAME + '  ' + data.MONITORTIME"
            type="table"
            :is-open="openPaneNum === index"
            @pane-clicked="$_handlePaneOpened(index)"
          >
            <mdb-row>
              <mdb-col>
                <div class="table-ui p-2 mb-3 mx-3 mb-4">
                  <div class="table-responsive mx-3">
                    <table class="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>监测因子</th>
                          <th>检测值</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="factor in waterShowFactors1" :key="factor">
                          <th>
                            {{ waterFactors.get(factor).alias }}
                          </th>
                          <th>
                            {{
                              data[factor]
                                ? data[factor] + waterFactors.get(factor).unit
                                : '无数据'
                            }}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </mdb-col>
            </mdb-row>
          </mdb-accordion-pane>
        </mdb-accordion>
      </div>
    </mdb-modal-body>

    <mdb-modal-footer>
      <mdb-btn color="info" rounded @click="$emit('closeDetail')">
        <mdb-icon icon="times" class="mr-1" />关闭
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import {
  mdbBtn,
  mdbIcon,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
  mdbAccordion,
  mdbAccordionPane,
  mdbRow,
  mdbCol
} from 'mdbvue'
import { mapMutations, mapGetters } from 'vuex'
import { axiosGet } from '~/api/axios'

export default {
  name: 'PollutantSourceDetail',

  components: {
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbAccordion,
    mdbAccordionPane,
    mdbRow,
    mdbCol
  },

  props: {
    stationId: {
      type: String,
      required: true
    },
    showModal: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      stationRTData: {},
      stationName: '',
      pollutantType: '',
      elHeight: 0,
      openPaneNum: 0,
      airFactors: new Map(),
      airShowFactors1: [
        'VALUE1',
        'VALUEZS1',
        'VALUE2',
        'VALUE3',
        'COUFLOW',
        'PVALUE1',
        'PVALUE2'
      ],
      airShowFactors2: [
        'PVALUE3',
        'PVALUE4',
        'PVALUE5',
        'PVALUE6',
        'PVALUE7',
        'PVALUE8'
      ],
      waterFactors: new Map(),
      waterShowFactors1: ['VALUE1', 'VALUE2', 'VALUE4', 'COUFLOW'],
      airData: [],
      waterData: []
    }
  },

  computed: {
    ...mapGetters('business-data', ['getBusinessData'])
  },

  mounted() {
    this.airFactors.set('VALUE1', { alias: '烟尘原始实测', unit: 'mg/m3' })
    this.airFactors.set('VALUEZS1', { alias: '烟尘原始折算', unit: 'mg/m3' })
    this.airFactors.set('VALUE2', { alias: 'SO2', unit: 'μg/m3' })
    this.airFactors.set('VALUE3', { alias: 'NOX', unit: 'μg/m3' })
    this.airFactors.set('COUFLOW', { alias: '烟气流量', unit: 'm3' })
    this.airFactors.set('PVALUE1', { alias: '氧含量', unit: '%' })
    this.airFactors.set('PVALUE2', { alias: '烟气流速', unit: 'm/s' })
    this.airFactors.set('PVALUE3', { alias: '烟温', unit: '℃' })
    this.airFactors.set('PVALUE4', { alias: '烟气动压', unit: '' })
    this.airFactors.set('PVALUE5', { alias: '烟气湿度', unit: '%' })
    this.airFactors.set('PVALUE6', { alias: '制冷温度', unit: '℃' })
    this.airFactors.set('PVALUE7', { alias: '烟道截面积', unit: '' })
    this.airFactors.set('PVALUE8', { alias: '烟气压力', unit: '' })

    this.waterFactors.set('VALUE1', { alias: 'COD', unit: '' })
    this.waterFactors.set('VALUE2', { alias: '氨氮', unit: '' })
    this.waterFactors.set('VALUE4', { alias: '总磷', unit: 'mg/l' })
    this.waterFactors.set('COUFLOW', { alias: '流量', unit: 't' })
  },

  methods: {
    ...mapMutations('business-data', ['startFetchData', 'stopFetchData']),

    beforeEnter(el) {
      this.elHeight = el.scrollHeight
    },
    enter(el) {
      el.style.height = this.elHeight + 'px'
    },
    beforeLeave(el) {
      el.style.height = 0
    },

    $_handlePaneOpened(num) {
      if (this.openPaneNum === num) {
        return (this.openPaneNum = null)
      }
      this.openPaneNum = num
    },

    async $_modal_beforeShow() {
      this.startFetchData()
      this.openPaneNum = 0

      const sources = this.getBusinessData('PollutantSourceEnterprise')
      const source = sources.find((source) => source.id === this.stationId)
      if (!source) {
        return
      }

      this.stationName = source.name
      this.pollutantType = source.pollutantSourceTypeName

      switch (source.pollutantSourceTypeName) {
        case '一般废水':
          this.waterData = await axiosGet(
            'monitor_data/get_company_water_factors',
            { psCode: this.stationId }
          )
          break

        case '一般废气':
          this.airData = await axiosGet(
            'monitor_data/get_company_air_factors',
            { psCode: this.stationId }
          )
          break
      }
      this.stopFetchData()
    }
  }
}
</script>

<style scoped></style>
