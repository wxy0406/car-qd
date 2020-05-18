<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增车辆类型' : '编辑车辆类型'" append-to-body width="570px">
    <el-form ref="form1" :inline="true" :model="form" :rules="rules" size="small" label-width="196px">
      <el-form-item label="类型编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入类型编码"/>
      </el-form-item>
      <el-form-item label="类型名称" prop="label">
        <el-input v-model="form.label" placeholder="请输入类型名称"/>
      </el-form-item>
      <el-form-item label="上级类型" >
        <treeselect v-model="form.vehicleType.id" :options="vehicleTypeTree" :load-options="loadOptions" :style="style" placeholder="请选择上级车辆类型" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { addVehicleType, editVehicleType, getVehicleTypeTree, getVehicleTypeByVehicleTypeId, getParentIds } from '@/api/manager'
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
      dialog: false, loading: false, form: { code: '', label: '', vehicleType: { id: null }},
      vehicleTypeTree: [], style: 'width: 184px',
      rules: {
        code: [
          { required: true, message: '车辆类型编码不能为空', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '车辆类型名称不能为空', trigger: 'blur' }
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
      this.$refs['form1'].validate((valid) => {
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
      addVehicleType(this.form).then(res => {
        debugger
        const id = res.id
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        getParentIds(id).then(res1 => {
          debugger
          this.sup_this.defaultExpandedKeys = res1
        })
        this.sup_this.currentKey = id
        this.sup_this.node.childNodes = []
        this.sup_this.loadNode(this.sup_this.node, this.sup_this.resolve)
        // this.sup_this.param = id
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      editVehicleType(this.form).then(res => {
        debugger
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        getParentIds(res.id).then(res1 => {
          debugger
          this.sup_this.defaultExpandedKeys = res1
        })
        this.sup_this.init()
        this.sup_this.node.childNodes = []
        this.sup_this.loadNode(this.sup_this.node, this.sup_this.resolve)
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form1'].resetFields()
      this.form = { code: '', label: '', vehicleType: { id: null }}
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
    }
  }
}
</script>

<style scoped>

</style>
