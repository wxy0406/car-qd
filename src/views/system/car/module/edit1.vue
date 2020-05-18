<template>
  <div>
    <el-button :disabled="sup_this.sup_this.editVehicleType" class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="to">修改车辆类型</el-button>
    <qForm ref="qform" :sup_this="sup_this" :is-add="false" :dicts="dicts"/>
  </div>
</template>
<script>
import qForm from './form1'
export default {
  components: { qForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    // index.vue 的this 可用于刷新数据
    sup_this: {
      type: Object,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    to() {
      const _this = this.$refs.qform
      _this.getVehicleTypeTree()
      const id = this.data.vehicleType === null ? null : this.data.vehicleType.id
      _this.form = { id: this.data.id, code: this.data.code, label: this.data.label, vehicleType: { id: id }}
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{display: inline-block;margin-right: 3px;}
</style>
