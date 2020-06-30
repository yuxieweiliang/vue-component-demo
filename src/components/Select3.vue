<script>
  import { debounce } from 'lodash'
  const defaultStyle = { maxHeight: '250px', minWidth: '200px', overflow: 'auto' }

  function filterItem (item) {
    if (item && item.id) {
      const hasItem = this.dataSource.filter(d => d.id === item.id)
      if (hasItem.length === 0) {
        this.dataSource.push(item)
      }
    }
  }

  export default {
    name: 'LsSelect',
    model: {
      prop: 'value',
      event: 'change'
    },
    data () {
      return {
        indicator: <a-icon type="loading" style="font-size: 24px" />,
        // 字段列表数据
        dataSource: [],
        loading: false,
        page: 1,
        limit: 10,
        busy: false
      }
    },
    props: {
      textFormat: {
        type: Function,
        default: () => ''
      },
      value: {
        type: String,
        default: null
      },
      selectedValue: {
        type: Object,
        default: () => ({})
      },
      params: {
        type: Object,
        default: () => ({})
      },
      reload: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      /**
       * 回显默认选中的值
       * 如果列表中没有这个值，则需要将这个值添加到列表中，否则列表不会回显。
       * 无法回显值 动态拼接一个值
       * @param item
       */
      selectedValue (item) {
        filterItem.call(this, item)
      },
      reload: {
        handler (is) {
          if (is) this.refreshData()
        },
        deep: true
      }
    },
    computed: {
      computedDropdownStyle () {
        return Object.assign(defaultStyle, this.$attrs.dropdownStyle)
      }
    },
    created() {
      this.init()
    },
    methods: {
      /**
       * 初始化组件
       */
      init () {
        if (!this.requestApi) {
          console.error('Failed url is request to undefined ')
          return
        }
        this.requestData()
      },

      /**
       * 下拉框滚动时调用
       * 当滚动到底部时，请求下一页。
       */
      popupScroll: debounce(function (e) {
        const sh = e.target.scrollHeight
        const oh = e.target.offsetHeight
        const st = e.target.scrollTop
        if (sh === 0 || oh === 0) {
          return
        }
        if (sh - oh - st <= 10) {
          this.requestData(function (bool) {
            if (bool) {
              setTimeout(() => {
                e.target.scrollTop = sh - oh / 2 - 10
              }, 200)
            }
          })
        }
      }, 500),

      /**
       * 防止下拉框内容不跟随
       * @param trigger
       * @returns {HTMLElement}
       */
      getPopupContainer (trigger) {
        return trigger.parentElement
      },

      /**
       * 刷新数据
       */
      refreshData () {
        this.page = 1
        this.dataSource = []
        this.busy = false
        this.params.searchText = null
        this.requestData()
      },

      requestApi(option) {
        const queryString = Object.entries(option).reduce((prev, [key, value]) => `${prev}${prev ? '&' : ''}${key}=${value}`, '')
        console.log(Object.entries(option))
        return fetch('http://localhost:3000/echo/id' + (queryString ? `?${queryString}` : ''))
          .then(res => res.json()).then(res => {
            return new Promise((resolve) => setTimeout(() => resolve(res), 2000))
          })
      },
      /**
       * 请求数据
       * @param resolve
       */
      requestData (resolve) {
        if (this.busy) return
        const { page, limit, params } = this
        this.loading = true
        this.requestApi({ page, limit }, Object.assign(params, { state: 0 })).then(({ results }) => {
          // 回显
          filterItem.call(this, this.selectedValue)
          if (results && results.length > 0) {
            // this.dataSource = this.listData.concat(data.datas)
            results.forEach(item => {
              if (this.dataSource.some(d => d.id === item.id)) return
              this.dataSource.push(item)
            })
            this.page++
          } else {
            this.busy = true
          }
          if (resolve) {
            resolve(true)
          }
          this.loading = false
          this.reload = false
          this.$emit('loaded', this.dataSource)
          this.$emit('update:reload', false)
        })
      },

      /**
       * 当输入搜索内容时：
       * 1. 如果当前列表中找不到，则重新请求。
       * 2. 如果当前列表中存在，则不请求。
       */
      onSearchData: debounce(function (keyword) {
        console.log('onSearchData')
        if (this.hasSearchValue) return
        this.page = 1
        this.dataSource = []
        this.busy = false
        this.params.searchText = keyword
        this.requestData()
      }, 800),

      /**
       * 根据用户数据，返回搜索状态
       * 并记录当前是否存在。
       * @param input
       * @param option
       * @returns {boolean}
       */
      filterOption (input, option) {
        console.log('filterOption')
        const { text } = option.componentOptions.children[0].children[0]
        this.hasSearchValue = text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        return this.hasSearchValue
      },

      /**
       *
       */
      onChangeSelect (_, record) {
        console.log('onChangeSelect')
        const data = record ? record.data.attrs.data : record
        this.$emit('change', _, data)
      }
    },

    render () {
      const value = this.value
      const listeners = {
        ...this.$listeners,
        popupScroll: this.popupScroll.bind(this),
        change: this.onChangeSelect.bind(this)
      }

      console.log(this)

      return (
        <a-select
          allowClear
          showSearch
          style='width: 200px;'
          placeholderOption="first"
          optionLabelProp="text"
          attrs={ this.$attrs }
          on={ listeners }
          props={{ value }}
          onSearch={ this.onSearchData.bind(this) }
          getPopupContainer={ this.getPopupContainer.bind(this) }
          dropdownStyle={ this.computedDropdownStyle }
          filterOption={ this.filterOption.bind(this) }
          dropdownClassName={ this.$attrs.dropdownClassName + ' ls-select-dropdown' }
          notFoundContent={ this.loading ? <a-spin slot="notFoundContent" size="small"/> : null }>

          {
            this.$scopedSlots.suffixIcon && (
              <span slot="suffixIcon">
              { this.$scopedSlots.suffixIcon() }
                <a-icon type="down"/>
            </span>
            )
          }

          {
            this.dataSource.map((item, index) => (
              <a-select-option
                key={item.id}
                value={item.id}
                data={item}
                text={this.textFormat(item)}
              >

                { this.$scopedSlots.optionSlot && this.$scopedSlots.optionSlot({record: item}) }

                {
                  (index === this.dataSource.length - 1 && this.loading) && (
                    <div class="ls-select-dropdown-loading">
                      <a-spin size="small"/>
                    </div>
                  )
                }
              </a-select-option>
            ))
          }
        </a-select>
      )
    }
  }
</script>

<style lang="less">
  .ls-select-dropdown{
    .ant-select-dropdown-menu-item{
      position: static!important;
    }
    .ls-select-dropdown-loading{
      position: absolute;background: rgba(255,255,255,.6);width: 100%;height: 100%;top: 0;left:0;
      text-align: center;
      .ant-spin{
        margin: 120px auto;
      }
    }
  }
</style>
