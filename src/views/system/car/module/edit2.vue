<template>
  <div>
    <el-button :disabled="sup_this.sup_this.editVehicleInformat" class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="to">修改车辆</el-button>
    <eForm ref="form" :sup_this="sup_this" :is-add="false" :dicts="dicts"/>
  </div>
</template>
<script>
import eForm from './form'
export default {
  components: { eForm },
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
  methods: {
    to() {
      const _this = this.$refs.form
      _this.getVehicleTypeTree()
      _this.form = { id: this.data.id, code: this.data.code, name: this.data.name, number: this.data.number, purchaseDate: this.data.purchaseDate, price: this.data.price, leaseState: this.data.leaseState, vehicleType: { id: this.data.vehicleType.id }}
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{display: inline-block;margin-right: 3px;}
</style>
