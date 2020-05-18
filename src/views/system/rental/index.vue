<template>
  <div class="app-container">
    <!-- <el-row :gutter="20">
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20"> -->
    <eHeader :query="query" :sup_this="sup_this" :dicts="dicts"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @select="select" @select-all="select">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="code" label="订单编号"/>
      <el-table-column prop="preparedPeople" label="制单人"/>
      <el-table-column :show-overflow-tooltip="true" prop="rentDate" label="出租日期"/>
      <el-table-column prop="rentalUnits" label="出租单位"/>
      <el-table-column prop="rental" label="租金"/>
      <el-table-column prop="leaseTime" label="出租时长（月）"/>
      <el-table-column label="车辆">
        <template slot-scope="scope">
          <div>{{ scope.row.vehicleInformation === null ? '' : scope.row.vehicleInformation.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="builder" label="承租人" show-overflow-tooltip/>
      <el-table-column label="操作" width="125" fixed="right" align="center">
        <template slot-scope="scope">
          <edit :dicts="dicts" :data="scope.row" :sup_this="sup_this"/>
          <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="click(scope.row)"/>
          <!-- <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover> -->
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
      <!-- </el-col>
    </el-row> -->
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
// import { del } from '@/api/user'
import { delRentalInformat } from '@/api/rental'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData, initDict],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      delLoading: false, sup_this: this, vehicleType: [], selection: [], node: [], resolve: [], leaf: {}, delRentalInformation: true,
      param: { code: null, vehicleInformationId: null },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    // this.getVehicleTypeTree()
    this.$nextTick(() => {
      this.init()
      // 加载数据字典
      this.getDict('user_status')
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/rental-informations/table'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const form = this.param
      const code = form.code
      const vehicleInformationId = form.vehicleInformationId
      if (code) { this.params['code'] = code }
      if (vehicleInformationId) { this.params['vehicleInformationId'] = vehicleInformationId }
      return true
    },
    click(row) {
      if (row.leaseState === 'YES') {
        this.$notify({
          title: '该车辆已经出租，无法删除',
          type: 'warning',
          duration: 2500
        })
      } else {
        this.$confirm('确定删除这些数据么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.subDelete(row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    subDelete(id) {
      this.delLoading = true
      delRentalInformat(id).then(res => {
        this.delLoading = false
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        console.log(err.response.data.message)
      })
    },
    select(selection) {
      this.delRentalInformation = true
      if (selection.length !== 0) {
        this.delRentalInformation = false
      }
      this.selection = selection
    }
  }
}
</script>

<style scoped>
</style>
