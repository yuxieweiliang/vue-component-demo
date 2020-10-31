<template>
  <a-modal
    v-if="dialogFooter"
    :width="dialogWidth"
    :maskClosable="false"
    :height="dialogHeight"
    :visible="dialogVisible"
    :wrapClassName="dialogCls"
    :destroyOnClose="destroyOnClose"
    @cancel="onCancel"
  >
    <a-spin :spinning="dialogLoading">
      <a-form :layout="dialogFormLayout" :form="dialogForm" v-if="dialogForm">
        <slot></slot>
      </a-form>
      <slot v-else></slot>
    </a-spin>
    <div slot="footer" >
      <template v-if="footerVisible">
        <a-button key="back" @click="onCancel">
          <!--<a-icon :component="icons.quxiao"/>-->
          {{ footerCancelBtnText }}
        </a-button>
        <a-button key="submit" :type="footerOkBtnType" :loading="dialogLoading" @click="onOk" :disabled="defaultDisabledOkBtn">
          <!--<a-icon :component="icons.queding" v-if="!dialogLoading"/>-->
          {{ footerOkBtnText }}
        </a-button>
      </template>
    </div>
    <div slot="title" class="dialog-title-icon" v-if="!dialogTitleIcon || typeof dialogTitleIcon === 'string'">
      <!--<a-space size="small" align="center">
        <i :class="' iconfont f20 '+(dialogTitleIcon||$route.meta.icon) "></i>
        <span>{{ dialogTitle }}</span>
      </a-space>-->
    </div>
    <div slot="title" class="dialog-title-icon" v-else>
      <!--<a-space size="small" align="center">
        <span>{{ dialogTitle }}</span>
      </a-space>-->
    </div>
  </a-modal>
  <a-modal
    v-else
    :width="dialogWidth"
    :height="dialogHeight"
    :visible="dialogVisible"
    :footer="null"
    :maskClosable="false"
    :wrapClassName="dialogCls"
    :destroyOnClose="destroyOnClose"
    @cancel="onCancel"
  >
    <a-spin :spinning="dialogLoading">
      <a-form :layout="dialogFormLayout" :form="dialogForm" v-if="dialogForm">
        <slot></slot>
      </a-form>
      <slot v-else></slot>
    </a-spin>
    <div slot="title" class="dialog-title-icon">
      <!--<a-space size="small" align="center">
        <i v-if="typeof dialogTitleIcon === 'string'" :class="'iconfont f20 '+dialogTitleIcon "></i>
        <span class="ml10">{{ dialogTitle }}</span>
      </a-space>-->
    </div>
  </a-modal>
</template>

<script>
// import { icons } from '@/core/icons'
export default {
  name: 'LsDialog',
  data () {
    return {
      // icons,
    }
  },
  props: {
    // 弹窗显示状态
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // 弹窗加载遮罩
    dialogLoading: {
      type: Boolean,
      default: false,
    },
    // 弹窗加载遮罩
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    // @deprecated
    dialogSubmitLoading: {
      type: Boolean,
      default: false,
    },
    // 弹窗包含form
    dialogForm: {
      type: Object,
      default: null,
    },
    // 弹窗包含底部工具栏
    dialogFooter: {
      type: Boolean,
      default: true,
    },
    // 弹窗标题
    dialogTitle: {
      type: String,
      default: '新增',
    },
    // 弹窗标题icon
    dialogTitleIcon: {
      type: Object,
      default: null,
    },
    // 弹窗宽度
    dialogWidth: {
      type: String,
      default: '500px',
    },
    // 弹窗高度
    dialogHeight: {
      type: String,
      default: '80%',
    },
    // form布局
    dialogFormLayout: {
      type: String,
      default: 'vertical',
    },
    // 样式
    dialogCls: {
      type: String,
      default: 'lansen-dialog',
    },
    defaultDisabledOkBtn: {
      type: Boolean,
      default: false,
    },
    footerOkBtnText: {
      type: String,
      default: '确定',
    },
    footerCancelBtnText: {
      type: String,
      default: '取消',
    },
    footerOkBtnType: {
      type: String,
      default: 'primary',
    },
    footerVisible: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    // 弹窗工具栏 确定按钮事件
    onOk: function () {
      this.$emit('ok')
    },
    // 弹窗工具栏 取消按钮事件
    onCancel: function () {
      this.$emit('cancel')
    },
  },
}
</script>
<style scoped>

</style>
<style>
  .lansen-dialog .ant-modal-body{
    padding: 0px 20px 20px 20px!important
  }
  .dialog-title-icon{
    position: relative;
    left: 0;
    top: 1px;
  }
</style>
