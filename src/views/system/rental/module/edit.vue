<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" @click="to"/>
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
      _this.getVehicles2(this.data.vehicleInformation.vehicleType.id)
      _this.form = {
        id: this.data.id,
        code: this.data.code,
        preparedPeople: this.data.preparedPeople,
        builder: this.data.builder,
        remarks: this.data.remarks,
        rentDate: this.data.rentDate,
        rentalUnits: this.data.rentalUnits,
        rental: this.data.rental,
        leaseTime: this.data.leaseTime,
        vehicleInformation: { id: this.data.vehicleInformation.id },
        vehicleType: { id: this.data.vehicleInformation.vehicleType.id }}
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{display: inline-block;margin-right: 3px;}
</style>
