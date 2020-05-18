<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增车辆' : '编辑车辆'" append-to-body width="570px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="196px">
      <el-form-item label="车辆编码" prop="code">
        <el-input v-model="form.code"/>
      </el-form-item>
      <el-form-item label="车辆名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="车牌号" prop="number">
        <el-input v-model="form.number" />
      </el-form-item>
      <el-form-item label="购买日期" prop="purchaseDate" label-width="196px">
        <el-date-picker v-model="form.purchaseDate" :style="style" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item label="购买价格" prop="price">
        <el-input v-model.number="form.price" />
      </el-form-item>
      <el-form-item label="租赁状态" prop="leaseState">
        <el-radio v-for="item in dicts" :key="item.id" v-model="form.leaseState" :label="item.value">{{ item.label }}</el-radio>
      </el-form-item>
      <el-form-item label="车辆类型" >
        <treeselect v-model="form.vehicleType.id" :options="vehicleTypeTree" :style="style" placeholder="选择车辆类型" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { addVehicleInformat, editVehicleInformat, getVehicleTypeTree } from '@/api/manager'
import Treeselect from '@riophae/vue-treeselect'
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
      dialog: false, loading: false, form: { code: '', name: '', number: '', purchaseDate: '', leaseState: 'NO', vehicleType: { id: null }, price: null },
      vehicleTypeTree: [], style: 'width: 184px',
      rules: {
        code: [
          { required: true, message: '车辆编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '车辆名称不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        purchaseDate: [
          { required: true, message: '购买日期不能为空', trigger: 'change' }
        ],
        price: [
          { required: true, message: '购买价格不能为空', trigger: 'blur' },
          { type: 'number', message: '购买价格必须为数字' }
        ]
      }
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
      addVehicleInformat(this.form).then(res => {
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
        console.log(err)
      })
    },
    doEdit() {
      editVehicleInformat(this.form).then(res => {
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
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { code: '', name: '', number: '', purchaseDate: '', leaseState: 'NO', vehicleType: { id: null }, price: null }
    },
    getVehicleTypeTree() {
      getVehicleTypeTree().then(res => {
        this.vehicleTypeTree = res
      })
    }
  }
}
</script>

<style scoped>

</style>
