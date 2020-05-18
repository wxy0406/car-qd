<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增订单' : '编辑订单'" append-to-body width="570px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="196px">
      <el-form-item label="订单编号" prop="code">
        <el-input v-model="form.code" placeholder="自动生成" disabled/>
      </el-form-item>
      <el-form-item label="制单人" prop="preparedPeople">
        <el-input v-model="form.preparedPeople" placeholder="请输入制单人" />
      </el-form-item>
      <el-form-item label="出租日期" prop="rentDate">
        <el-date-picker v-model="form.rentDate" :style="style" type="date" placeholder="请选择出租日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" @change="change"/>
      </el-form-item>
      <el-form-item label="租赁单位" prop="rentalUnits">
        <el-input v-model="form.rentalUnits" placeholder="请填写租赁单位" />
      </el-form-item>
      <el-form-item label="承建人" prop="builder">
        <el-input v-model="form.builder" placeholder="请填写承建人" />
      </el-form-item>
      <el-form-item label="租金" prop="rental">
        <el-input v-model.number="form.rental" placeholder="请填写租金" />
      </el-form-item>
      <el-form-item label="出租时长（月）" prop="leaseTime">
        <el-select v-model="form.leaseTime" :style="style" filterable placeholder="请选择出租时长">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆类型" >
        <treeselect v-model="form.vehicleType.id" :options="vehicleTypeTree" :load-options="loadOptions" :style="style" :clearable="clearable" placeholder="请选择车辆类型" @select="selectFun" />
      </el-form-item>
      <el-form-item label="车辆">
        <el-select v-model="form.vehicleInformation.id" :style="style" clearable placeholder="请先选择车辆类型">
          <el-option
            v-for="item in vehicles"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" :rows="2" type="textarea" placeholder="请输入备注信息"/>
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
import { addRentalInformat, editRentalInformat, getVehicleByVehicleTypeIdNo, getVehicleByVehicleTypeIdYes } from '@/api/rental'
import { LOAD_CHILDREN_OPTIONS, Treeselect } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
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
      dialog: false, loading: false, form: { code: '', preparedPeople: '', rentalUnits: '', rentDate: '', builder: '', vehicleType: { id: null }, vehicleInformation: { id: null }, rental: null, leaseTime: null },
      vehicleTypeTree: [], style: 'width: 184px', vehicles: [], clearable: false,
      dialogStyle: {
        backgroundColor: '#E6E3E3',
        height: '1px'
      },
      rules: {
        preparedPeople: [
          { required: true, message: '制单人不能为空', trigger: 'blur' }
        ],
        rentDate: [
          { required: true, message: '出租日期不能为空', trigger: 'change' }
        ],
        rentalUnits: [
          { required: true, message: '租赁单位不能为空', trigger: 'blur' }
        ],
        builder: [
          { required: true, message: '承建人不能为空', trigger: 'blur' }
        ],
        rental: [
          { required: true, message: '租金不能为空', trigger: 'blur' },
          { type: 'number', message: '租金必须为数字' }
        ],
        leaseTime: [
          { required: true, message: '出租时长不能为空', trigger: 'blur' }
        ]
      },
      options: [
        {
          value: '1',
          label: '1月'
        }, {
          value: '2',
          label: '2月'
        }, {
          value: '3',
          label: '3月'
        }, {
          value: '4',
          label: '4月'
        }, {
          value: '5',
          label: '5月'
        }
      ]
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
    change() {
      if (this.isAdd) {
        const random = Math.floor(Math.random() * 1000)
        this.form.code = 'ZDL' + this.form.rentDate.replace(/-/g, '') + random
      }
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      // this.form.vehicleType.id = this.form.vehicleTypeId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.vehicleType.id === null || this.form.vehicleType.id === undefined) {
            this.$message({
              message: '车辆类型不能为空',
              type: 'warning'
            })
          } else if (this.form.vehicleInformation.id === null || this.form.vehicleInformation.id === undefined) {
            this.$message({
              message: '车辆不能为空',
              type: 'warning'
            })
          } else {
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          }
        } else {
          return false
        }
      })
    },
    doAdd() {
      addRentalInformat(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      editRentalInformat(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { code: '', preparedPeople: '', rentalUnits: '', rentDate: '', builder: '', vehicleType: { id: null }, vehicleInformation: { id: null }, rental: null, leaseTime: null }
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
      this.getVehicles1(node.id)
    },
    getVehicles1(id) {
      getVehicleByVehicleTypeIdNo(id).then(res => {
        this.vehicles = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getVehicles2(id) {
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
