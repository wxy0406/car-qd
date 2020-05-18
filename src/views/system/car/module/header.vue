<template>
  <div class="head-container">
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="addVehicleType">新增车辆类型</el-button>
      <qForm ref="form1" :sup_this="sup_this" :is-add="true" :dicts="dicts"/>
    </div>
    <div style="display: inline-block;margin: 0px 2px;">
      <edit1 :dicts="dicts" :data="sup_this.leaf" :sup_this="sup_this"/>
    </div>
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        :disabled="sup_this.delVehicleType"
        class="filter-item"
        size="mini"
        type="danger"
        icon="el-icon-delete"
        @click="delVehicleType">删除车辆类型</el-button>
      <qForm ref="form1" :sup_this="sup_this" :is-add="true" :dicts="dicts"/>
    </div>
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="addVehicleInformat">新增车辆</el-button>
      <eForm ref="form" :sup_this="sup_this" :is-add="true" :dicts="dicts"/>
    </div>
    <div style="display: inline-block;margin: 0px 2px;">
      <edit2 :dicts="dicts" :data="sup_this.selection0" :sup_this="sup_this"/>
    </div>
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        :disabled="sup_this.delVehicleInformat"
        class="filter-item"
        size="mini"
        type="danger"
        icon="el-icon-delete"
        @click="delVehicleInformat">删除车辆</el-button>
      <eForm ref="form" :sup_this="sup_this" :is-add="true" :dicts="dicts"/>
    </div>
  </div>
</template>

<script>
import eForm from './form'
import qForm from './form1'
import edit1 from './edit1'
import edit2 from './edit2'
import { batchDelVehicleInformat, delVehicleType, getBrotherId, getParentIds } from '@/api/manager'
// 查询条件
export default {
  components: { eForm, qForm, edit2, edit1 },
  props: {
    query: {
      type: Object,
      required: true
    },
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
    addVehicleInformat() {
      this.$refs.form.getVehicleTypeTree()
      this.$refs.form.form.vehicleType.id = this.sup_this.param
      this.$refs.form.dialog = true
    },
    addVehicleType() {
      this.$refs.form1.getVehicleTypeTree()
      this.$refs.form1.form.vehicleType.id = this.sup_this.param
      this.$refs.form1.dialog = true
    },
    delVehicleInformat() {
      this.$confirm('确定删除这些数据么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.sup_this.selection.forEach(element => {
          ids.push(element.id)
        })
        batchDelVehicleInformat(ids.join(',')).then(res => {
          ids.forEach(element => {
            this.sup_this.$refs[element].doClose()
          })
          this.sup_this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          ids.forEach(element => {
            this.sup_this.$refs[element].doClose()
          })
          console.log(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delVehicleType() {
      this.$confirm('确定删除这些数据么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getBrotherId(this.sup_this.param).then(res1 => {
          debugger
          this.sup_this.currentKey = res1
          getParentIds(res1).then(res2 => {
            this.sup_this.defaultExpandedKeys = res2
          })
          delVehicleType(this.sup_this.param).then(res => {
            debugger
            // this.$refs[id].doClose()
            this.sup_this.node.childNodes = []
            this.sup_this.loadNode(this.sup_this.node, this.sup_this.resolve)
            this.sup_this.param = res1
            this.sup_this.init()
            this.$notify({
              title: '删除成功',
              type: 'success',
              duration: 2500
            })
          }).catch(err => {
            // this.$refs[id].doClose()
            console.log(err.response.data.message)
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
