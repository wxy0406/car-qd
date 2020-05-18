<template>
  <div class="head-container">
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-search"
        @click="queryRentalInformation">查询</el-button>
      <wForm ref="form2" :sup_this="sup_this" :is-add="true" :dicts="dicts"/>
    </div>
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="addRentalInformation">新建</el-button>
      <eForm ref="form" :sup_this="sup_this" :is-add="true" :dicts="dicts"/>
    </div>
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        :disabled="sup_this.delRentalInformation"
        class="filter-item"
        size="mini"
        type="danger"
        icon="el-icon-delete"
        @click="delRentalInformation">删除</el-button>
      <qForm ref="form1" :sup_this="sup_this" :is-add="true" :dicts="dicts"/>
    </div>
  </div>
</template>

<script>
import eForm from './form'
import qForm from './form1'
import wForm from './form2'
import edit1 from './edit1'
import { parseTime } from '@/utils/index'
import { batchDelRentalInformat } from '@/api/rental'
// 查询条件
export default {
  components: { eForm, qForm, wForm, edit1 },
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
    queryRentalInformation() {
      this.$refs.form2.getVehicleTypeTree()
      this.$refs.form2.dialog = true
    },
    addRentalInformation() {
      this.$refs.form.form.rentDate = parseTime((new Date()).valueOf())
      this.$refs.form.change()
      this.$refs.form.getVehicleTypeTree()
      this.$refs.form.dialog = true
    },
    delRentalInformation() {
      this.$confirm('确定删除这些数据么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.sup_this.selection.forEach(element => {
          ids.push(element.id)
        })
        debugger
        batchDelRentalInformat(ids.join(',')).then(res => {
          this.sup_this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          console.log(err.message)
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
