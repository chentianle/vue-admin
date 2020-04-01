import dayjs from 'dayjs'
import { Message } from 'element-ui'
// import util from '@/libs/util'

// eslint-disable-next-line no-unused-vars
function DownFile (r, fileName, isTime = false) {
  if (!r || r.type === 'application/json') {
    DownLoadErr(r)
    return
  }
  const blob = new Blob([r.data], { type: 'application/vnd.ms-excel' })
  // 非IE下载
  if (window.navigator.msSaveBlob) {
    // IE10+下载
    window.navigator.msSaveBlob(blob, fileName)
  } else {
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob) // 创建下载的链接
    let evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', false, false)
    const namePointIndex = fileName.lastIndexOf('.')
    link.download = isTime ? `${fileName.slice(0, namePointIndex)}${dayjs().format('YYYYMMDD-HHmm')}.${fileName.slice(namePointIndex + 1)}` : `${fileName}` // 下载后文件名
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click() // 点击下载
    window.URL.revokeObjectURL(link.href) // 释放掉blob对象
    document.body.removeChild(link) // 下载完成移除元素
  }
}

// eslint-disable-next-line no-unused-vars
function DownArrayBufferFile (r, fileName, isTime = false) {
  DownLoadErr(new Blob([r], { type: 'application/json' }), {
    r,
    fileName,
    isTime
  })
}
// 下载ArrayBuffer
function CreateAndDownLoadFile ({ r, fileName, isTime = false }) {
  const blob = new Blob([r])
  // 非IE下载
  if (window.navigator.msSaveBlob) {
    // IE10+下载
    window.navigator.msSaveBlob(blob, fileName)
  } else if ('download' in document.createElement('a')) {
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob) // 创建下载的链接
    const namePointIndex = fileName.lastIndexOf('.')
    link.download = isTime ? `${fileName.slice(0, namePointIndex)}${dayjs().format('YYYYMMDD-HHmm')}.${fileName.slice(namePointIndex + 1)}` : `${fileName}` // 下载后文件名
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click() // 点击下载
    window.URL.revokeObjectURL(link.href) // 释放掉blob对象
    document.body.removeChild(link) // 下载完成移除元素
  } else {
    console.log(window.navigator.userAgent, '不支持导出')
  }
}

function DownLoadErr (r, data) {
  let res = new FileReader()
  res.onload = function () {
    try {
      let resData = JSON.parse(this.result) // this.result为FileReader获取blob数据转换为json后的数据，即后台返回的 原始数据
      if (resData && resData['code'] && resData['code'] === 500) {
        const msg = resData.msg || '下载失败，请重试！'
        // 显示提示
        Message({
          message: msg,
          type: 'error',
          showClose: true,
          duration: 3 * 1000
        })
      }
    } catch (err) {
      if (data) {
        CreateAndDownLoadFile(data)
      }
    }
  }
  res.readAsText(r)
}

function createObjectURL (object) { return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object) }

function appendData (fd, data) {
  Object.keys(data).map(key => {
    fd.append(key, data[key])
  })
  return fd
}

function xhrDown (url, fileName, data, isTime = false) {
  const token = this.$cookie.get('token')
// const authorization = util.cookies.get('authorization')
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    if (data) {
      appendData(formData, data)
    }
    xhr.open('post', url) // url填写后台的接口地址，如果是post，在formData append参数（参考原文地址）
    xhr.setRequestHeader('token', token)
    // xhr.setRequestHeader('Authorization', `Bearer ${authorization}`)
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
      if (this.status === 200) {
        var blob = this.response
        const namePointIndex = fileName.lastIndexOf('.')
        var filename = isTime ? `${fileName.slice(0, namePointIndex)}${dayjs().format('YYYYMMDD-HHmm')}.${fileName.slice(namePointIndex + 1)}` : `${fileName}` // 下载后文件名
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename)
        } else {
          var a = document.createElement('a')
          var url = createObjectURL(blob)
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        }

        resolve()
      } else {
        try {
          var reader = new FileReader()
          reader.onload = e => {
            reject(JSON.parse(e.target.result))
          }
          reader.readAsText(this.response)
        } catch (error) {
          console.log(error)
        }
      }
    }
    xhr.send(formData)
  })
}

function xhrDownJSON (url, fileName, data = {}, isTime = false) {
  const token = this.$cookie.get('token')
// const authorization = util.cookies.get('authorization')
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('post', url) // url填写后台的接口地址，如果是post，在formData append参数（参考原文地址）
    xhr.setRequestHeader('token', token)
    // xhr.setRequestHeader('Authorization', `Bearer ${authorization}`)
    xhr.setRequestHeader('content-type', 'application/json; charset=UTF-8')
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
      if (this.status === 200) {
        var blob = this.response
        const namePointIndex = fileName.lastIndexOf('.')
        var filename = isTime ? `${fileName.slice(0, namePointIndex)}${dayjs().format('YYYYMMDD-HHmm')}.${fileName.slice(namePointIndex + 1)}` : `${fileName}` // 下载后文件名
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename)
        } else {
          var a = document.createElement('a')
          var url = createObjectURL(blob)
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
        }

        resolve()
      } else {
        try {
          var reader = new FileReader()
          reader.onload = e => {
            reject(JSON.parse(e.target.result))
          }
          reader.readAsText(this.response)
        } catch (error) {
          console.log(error)
        }
      }
    }
    xhr.send(JSON.stringify(data))
  })
}

export { DownFile, DownArrayBufferFile, xhrDown, xhrDownJSON }
