import request from '@/utils/request'

export function getVehicleByVehicleTypeIdYes(id) {
  return request({
    url: 'api/vehicle-informations/is-lease/' + id,
    method: 'get'
  })
}

export function getVehicleByVehicleTypeIdNo(id) {
  return request({
    url: 'api/vehicle-informations/not-lease/' + id,
    method: 'get'
  })
}

export function addRentalInformat(data) {
  return request({
    url: 'api/rental-informations',
    method: 'post',
    data
  })
}

export function editRentalInformat(data) {
  return request({
    url: 'api/rental-informations',
    method: 'put',
    data
  })
}

export function delRentalInformat(id) {
  return request({
    url: 'api/rental-informations/' + id,
    method: 'delete'
  })
}

export function batchDelRentalInformat(ids) {
  return request({
    url: 'api/rental-informations/batch/' + ids,
    method: 'delete'
  })
}
