let local_hospitalId = ''
let local_city = ''
let local_hospitalName = ''
if (localStorage) {
  local_hospitalId = localStorage.getItem('local_hospital')
  local_city = localStorage.getItem('local_city')
  local_hospitalName = localStorage.getItem('local_hospitalName')
}


export default {
  namespaced: true,
  state: {
    id: 0,
    city: local_city || '意大利',
    name: '',
    hospitalId: local_hospitalId || 1 ,
    hospitalName: local_hospitalName || ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateCity (state, city) {
      if (localStorage) {
        localStorage.setItem('local_city', city)
      }
      state.city = city
    },
    updateName (state, name) {
      state.name = name
    },
    updateHospitalId (state, id) {
      if (localStorage) {
        localStorage.setItem('local_hospital', id)
      }
      state.hospitalId = id
    },
    updateHospitalName (state, id) {
      if (localStorage) {
        localStorage.setItem('local_hospitalName', id)
      }
      state.hospitalName = id
    },
    clearHospitalId(state) {
      state.hospitalId = 0
      if (localStorage) {
        localStorage.setItem('local_hospital', '0')
      }
    }
  }
}
