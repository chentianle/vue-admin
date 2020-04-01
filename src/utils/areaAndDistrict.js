



// 获取市
export function areaListFunction (even) {
  let sysUserEntity = JSON.parse(sessionStorage.getItem('sysUserEntity') || '{}')
  if(sysUserEntity.hospitalType != null){
    even.hospitalType = sysUserEntity.hospitalType
    if(sysUserEntity.hospitalType == 1){
      even.dataForm.area = sysUserEntity.hospitalName
      selectByDistrict(even)
    }else if(sysUserEntity.hospitalType == 2){
      even.dataForm.district =  sysUserEntity.hospitalName
      selectByHospitalName(even)
    }
  }else{
    even.hospitalType = 0
    even.$http({
      url: even.$http.adornUrl('/generator/webHospital/selectByArea'),
      method: 'get',
      params: even.$http.adornParams({})
    }).then(({data}) => {
      if (data && data.code === 0) {
        even.areaList = data.list
      }
    })
  }
}
// 获取区
export function selectByDistrict (even) {
  if (even.dataForm.area !== null && even.dataForm.area !== '') {
    even.$http({
      url: even.$http.adornUrl('/generator/webHospital/selectByDistrict'),
      method: 'get',
      params: even.$http.adornParams({'area': even.dataForm.area})
    }).then(({data}) => {
      if (data && data.code === 0) {
        even.districtList = data.list
        even.dataForm.hospitalName = ''
      }
    })
  } else {
    even.districtList = []
    even.dataForm.district = ''
  }
}
// 获取小区
export function selectByHospitalName (even) {
  if (even.dataForm.district !== null && even.dataForm.district !== '') {
    even.$http({
      url: even.$http.adornUrl('/generator/webHospital/selectList'),
      method: 'get',
      params: even.$http.adornParams({'district': even.dataForm.district})
    }).then(({data}) => {
      if (data && data.code === 0) {
        even.options = data.list
        even.dataForm.hospitalName = ''
      }
    })
  } else {
    even.options = []
    even.dataForm.hospitalName = ''
  }
}
export function remoteMethod (query, even) {
  if (query !== '') {
    even.selectLoading = true
    even.$http({
      url: even.$http.adornUrl('/generator/webHospital/selectList'),
      method: 'get',
      params: even.$http.adornParams({'district': even.dataForm.district, 'hospitalName': query})
    }).then(({data}) => {
      even.selectLoading = false
      even.options = data && data.code === 0 ? data.list : []
    })
  } else {
    even.options = []
  }
}
