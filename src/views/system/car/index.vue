<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <el-tree ref="vehicleTypeTree" :props="defaultProps" :expand-on-click-node="false" :load="loadNode" :default-expanded-keys="defaultExpandedKeys" lazy node-key="id" highlight-current @node-click="handleNodeClick"/>
      </el-col>
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <eHeader :query="query" :sup_this="sup_this" :dicts="dicts"/>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @select="select" @select-all="select">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="code" label="车辆编码"/>
          <el-table-column prop="name" label="名称"/>
          <el-table-column :show-overflow-tooltip="true" prop="number" label="车牌号"/>
          <el-table-column label="购买价格">
            <template slot-scope="scope">
              <div>{{ scope.row.price }}</div>
            </template>
          </el-table-column>
          <el-table-column label="租赁状态" align="center">
            <template slot-scope="scope">
              <div v-for="item in dicts" :key="item.id">
                <el-tag v-if="scope.row.leaseState === item.value" :type="scope.row.leaseState === 'YES' ? 'success' : 'info'">{{ item.label }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="purchaseDate" label="购买日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.purchaseDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="125" fixed="right" align="center">
            <template slot-scope="scope">
              <edit :dicts="dicts" :data="scope.row" :sup_this="sup_this"/>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="click(scope.row)"/>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
// import { del } from '@/api/user'
import { getVehicleTypeTree, delVehicleInformat, getVehicleTypeByVehicleTypeId, getParentIds } from '@/api/manager'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData, initDict],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      delLoading: false, sup_this: this, vehicleType: [], selection: [], selection0: {}, node: [], resolve: [], leaf: {}, editVehicleType: true,
      delVehicleType: true, editVehicleInformat: true, delVehicleInformat: true, disabled: false, defaultExpandedKeys: [], currentKey: null,
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
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/vehicle-informations/tree'
      this.params = { pageIndex: this.page, pageSize: this.size, param: this.param }
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
      delVehicleInformat(id).then(res => {
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
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.node = node
        this.resolve = resolve
        getVehicleTypeTree().then(res => {
          this.vehicleType = res
          resolve(res)
          this.$refs.vehicleTypeTree.setCurrentKey(this.currentKey)
          this.handleNodeClick1(this.$refs.vehicleTypeTree.getCurrentNode(this.currentKey))
        })
      } else {
        getVehicleTypeByVehicleTypeId(node.data.id).then(res => {
          resolve(res)
          this.$refs.vehicleTypeTree.setCurrentKey(this.currentKey)
          this.handleNodeClick1(this.$refs.vehicleTypeTree.getCurrentNode(this.currentKey))
        })
      }
    },
    handleNodeClick1(data) {
      this.leaf = {}
      if (data !== null) {
        // this.currentKey = data.id
        this.param = data.id
        this.leaf = data
        this.editVehicleType = false
      }
      this.init().then(res => {
        this.delVehicleType = false
        this.data.forEach(element => {
          if (element.leaseState === 'YES') {
            this.delVehicleType = true
          }
        })
        // this.delVehicleType = delVehicleType1
      })
    },
    handleNodeClick(data) {
      this.leaf = {}
      if (data !== null) {
        this.currentKey = data.id
        this.param = data.id
        this.leaf = data
      }
      this.editVehicleType = false
      this.init().then(res => {
        this.delVehicleType = false
        this.data.forEach(element => {
          if (element.leaseState === 'YES') {
            this.delVehicleType = true
          }
        })
        // this.delVehicleType = delVehicleType1
      })
    },
    select(selection) {
      this.editVehicleInformat = true
      this.delVehicleInformat = true
      if (selection.length === 1) {
        this.editVehicleInformat = false
        this.selection0 = selection[0]
      }
      if (selection.length !== 0) {
        this.delVehicleInformat = false
      }
      selection.forEach(element => {
        if (element.leaseState === 'YES') {
          this.delVehicleInformat = true
        }
      })
      this.selection = selection
    },
    getParentIds(id) {
      getParentIds(id).then(res => {
        this.defaultExpandedKeys = res
      })
    }
  }
}
</script>

<style scoped>
</style>
