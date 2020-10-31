import Vue from 'vue'
import LsDialog from './components/Dialog'

export default function $alert ({on = {}, ...props} = {}) {
  const Instance = new Vue({
    name: 'CountPieces',
    components: {
      LsDialog,
    },
    data () {
      return {
        // 默认值，可以被传入的值覆盖
        visible: false,
        record: {},
        confirmLoading: false,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 14 } },
        layoutLabel: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },

        // 可以覆盖默认值
        ...props,
      }
    },
    methods: {
      onShow () {
        console.log('show', this)
        this.visible = true
      },
      _onOk () {
        this.form.validateFields((error, data) => {
          if (error) return
          console.log(data)
          this.confirmLoading = true
        })
      },
      _onCancel () {
        this.confirmLoading = false
        this.$emit('onCancel', this)
        this.onCancel()
      },
      onCancel () {
        this.confirmLoading = false
        this.visible = false
      }
    },
    render () {
      console.log(on)
      console.log('------------------', this)
      return (
        <ls-dialog
          dialogWidth="500px"
          dialogHeight="400px"
          dialogCls="ls-count-popup"
          dialogTitleIcon={{}}
          dialogVisible={this.visible}
          dialogLoading={this.confirmLoading}
          dialogForm={this.form}
          dialogTitle="单位换算"
          onok={this._onOk}
          oncancel={this._onCancel}
        >
          <a-row className="computer-count">
            <a-col span={10} push="2">
              <a-form-item label="生产单号" {...this.layout}>{this.record.produceNo}</a-form-item>
            </a-col>
            <a-col span={10} push="2">
              <a-form-item label="物料编码" {...this.layout}>{this.record.materialInfoNo}</a-form-item>
            </a-col>
          </a-row>
          <a-row className="computer-count">
            <a-col span={20} push="2">
              fdsafdsafdsaffffffffffffffff
            </a-col>
          </a-row>
        </ls-dialog>
      )
    }
  })

  const component = Instance.$mount()

  document.body.appendChild(component.$el)

  // return Instance.$children[0]
  return Instance
}

