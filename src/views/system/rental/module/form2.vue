<template>
  <el-dialog :visible.sync="dialog" :before-close="handleClose" title="查询" append-to-body width="570px" >
    <el-form ref="form2" :inline="true" :model="form" size="small" label-width="196px">
      <el-form-item label="订单编号" prop="code">
        <el-input v-model="form.code" placeholder="请输入订单编号"/>
      </el-form-item>
      <el-form-item label="车辆类型" >
        <treeselect v-model="form.vehicleTypeId" :options="vehicleTypeTree" :load-options="loadOptions" :style="style" :clearable="clearable" placeholder="请选择车辆类型" @select="selectFun" />
      </el-form-item>
      <el-form-item label="车辆">
        <el-select v-model="form.vehicleInformationId" :style="style" clearable placeholder="请先选择车辆类型">
          <el-option
            v-for="(item, index) in vehicles"
            :key="item.name + index"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { getVehicleTypeTree, getVehicleTypeByVehicleTypeId } from '@/api/manager'
import { getVehicleByVehicleTypeIdYes } from '@/api/rental'
import { LOAD_CHILDREN_OPTIONS, Treeselect } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    sup_this: {
      type: Object,
      default: null
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialog: false, loading: false, clearable: false,
      form: { code: '', vehicleTypeId: null, vehicleInformationId: null }, vehicles: [],
      vehicleTypeTree: [], style: 'width: 184px'
    }
  },
  created() {
    const explorer = navigator.userAgent
    if (explorer.indexOf('Chrome') >= 0) {
      this.style = 'width: 184px'
    } else {
      this.style = 'width: 172px'
    }
  },
  methods: {
    handleClose(done) {
      debugger
      this.$confirm('直接关闭将重置查询条件，确认关闭？')
        .then(_ => {
          this.cancel()
          done()
        })
        .catch(_ => {})
    },
    toQuery() {
      this.sup_this.page = 0
      this.sup_this.param = this.form
      this.sup_this.init().then(() => {
        this.resetForm()
      })
      this.loading = false
    },
    cancel() {
      this.$refs['form2'].resetFields()
      this.form = { code: '', vehicleTypeId: null, vehicleInformationId: null }
      this.resetForm()
      this.doSubmit()
    },
    doSubmit() {
      this.loading = true
      this.$refs['form2'].validate((valid) => {
        if (valid) {
          this.toQuery()
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
    //   this.$refs['form2'].resetFields()
    //   this.form = { code: '', vehicleTypeId: null, vehicleInformationId: null }
    },
    getVehicleTypeTree() {
      getVehicleTypeTree().then(res => {
        this.vehicleTypeTree = res
      })
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getVehicleTypeByVehicleTypeId(parentNode.id).then(res => {
          parentNode.children = res
          callback()
        })
      }
    },
    selectFun(node, instanceId) {
      this.getVehicles(node.id)
    },
    getVehicles(id) {
      getVehicleByVehicleTypeIdYes(id).then(res => {
        this.vehicles = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
