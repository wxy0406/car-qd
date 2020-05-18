import request from '@/utils/request'

export function getVehicleTypeTree() {
  return request({
    url: 'api/vehicle-types/node',
    method: 'get'
  })
}

export function getVehicleTypeByVehicleTypeId(vehicleTypeId) {
  return request({
    url: 'api/vehicle-types/leaf/' + vehicleTypeId,
    method: 'get'
  })
}
export function getVehicleInformationByVehicleTypeId(vehicleTypeId) {
  return request({
    url: 'api/vehicle-informations/tree/' + vehicleTypeId,
    method: 'get'
  })
}

export function addVehicleInformat(data) {
  return request({
    url: 'api/vehicle-informations',
    method: 'post',
    data
  })
}
export function editVehicleInformat(data) {
  return request({
    url: 'api/vehicle-informations',
    method: 'put',
    data
  })
}

export function delVehicleInformat(id) {
  return request({
    url: 'api/vehicle-informations/' + id,
    method: 'delete'
  })
}

export function addVehicleType(data) {
  return request({
    url: 'api/vehicle-types',
    method: 'post',
    data
  })
}
export function editVehicleType(data) {
  return request({
    url: 'api/vehicle-types',
    method: 'put',
    data
  })
}

export function delVehicleType(id) {
  return request({
    url: 'api/vehicle-types/' + id,
    method: 'delete'
  })
}

export function batchDelVehicleInformat(ids) {
  return request({
    url: 'api/vehicle-informations/batch/' + ids,
    method: 'delete'
  })
}

export function getParentIds(id) {
  return request({
    url: 'api/vehicle-types/parent/' + id,
    method: 'get'
  })
}

export function getBrotherId(id) {
  return request({
    url: 'api/vehicle-types/brother/' + id,
    method: 'get'
  })
}
