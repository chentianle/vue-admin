// eslint-disable-next-line no-unused-vars
let navbarLayoutType = ''
let sidebarLayoutSkin = ''
let layoutSize = ''

if (localStorage) {
  navbarLayoutType = localStorage.getItem('navbarLayoutType')
  sidebarLayoutSkin = localStorage.getItem('sidebarLayoutSkin')
  layoutSize = localStorage.getItem('layoutSize')
}

export default {
  namespaced: true,
  // if(lo)
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: navbarLayoutType || 'default',
    layoutSize: layoutSize || 'mini',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: sidebarLayoutSkin || 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: true,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 内容, 是否需要刷新
    contentIsNeedRefresh: false,
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: ''
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      if (localStorage) {
        localStorage.setItem('navbarLayoutType', type)
      }
      state.navbarLayoutType = type
    },
    updateLayoutSize (state, value) {
      if (localStorage) {
        localStorage.setItem('layoutSize', value)
      }
      state.layoutSize = value
    },
    updateSidebarLayoutSkin (state, skin) {
      if (localStorage) {
        localStorage.setItem('sidebarLayoutSkin', skin)
      }
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateContentIsNeedRefresh (state, status) {
      state.contentIsNeedRefresh = status
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    }
  }
}
