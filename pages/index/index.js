// pages/index/index.js
const app = getApp()

// 引入菜品数据
const hotDishesData = require('../../data/hot-dishes.js')
const coldDishes = require('../../data/cold-dishes.js')
const soups = require('../../data/soups.js')
const desserts = require('../../data/desserts.js')
const pastaDishes = require('../../data/pasta-dishes.js')
const noodleDishes = require('../../data/noodle-dishes.js')

Page({
  data: {
    // 主分类
    mainCategories: [
      { key: 'hot', name: '热菜', icon: '🔥' },
      { key: 'cold', name: '凉菜', icon: '🥗' },
      { key: 'soup', name: '汤', icon: '🍲' },
      { key: 'dessert', name: '甜品', icon: '🍰' },
      { key: 'pasta', name: '面食', icon: '🥟' },
      { key: 'noodle', name: '面条', icon: '🍜' }
    ],
    currentMainCategory: 'hot',

    // 热菜子分类（菜系）
    cuisineCategories: hotDishesData.categories || [],
    currentCuisine: '',

    dishes: [],
    allDishes: {
      hot: hotDishesData.dishes || [],
      cold: coldDishes.dishes || [],
      soup: soups.dishes || [],
      dessert: desserts.dishes || [],
      pasta: pastaDishes.dishes || [],
      noodle: noodleDishes.dishes || []
    },

    filterTags: [
      { key: 'spicy', name: '偏辣', selected: false },
      { key: 'sour', name: '偏酸', selected: false },
      { key: 'sweet', name: '偏甜', selected: false }
    ],
    showFilter: false,

    // 搜索
    searchKeyword: '',
    isSearching: false,
    searchResults: [],
    categoryNameMap: {
      hot: '热菜',
      cold: '凉菜',
      soup: '汤',
      dessert: '甜品',
      pasta: '面食',
      noodle: '面条'
    }
  },

  onLoad() {
    this.updateDishes()
  },

  // 切换主分类
  switchMainCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      currentMainCategory: category,
      currentCuisine: ''
    })
    this.updateDishes()
  },

  // 切换菜系（仅热菜）
  switchCuisine(e) {
    const cuisine = e.currentTarget.dataset.cuisine
    this.setData({
      currentCuisine: cuisine
    })
    this.updateDishes()
  },

  // 更新菜品列表
  updateDishes() {
    const { currentMainCategory, currentCuisine, allDishes, filterTags } = this.data
    let dishes = allDishes[currentMainCategory] || []

    // 如果是热菜且有菜系筛选
    if (currentMainCategory === 'hot' && currentCuisine) {
      dishes = dishes.filter(dish => dish.category === currentCuisine)
    }

    // 应用口味筛选
    const selectedTags = filterTags.filter(tag => tag.selected).map(tag => tag.name)
    if (selectedTags.length > 0) {
      dishes = dishes.filter(dish =>
        dish.tags && dish.tags.some(tag => selectedTags.includes(tag))
      )
    }

    this.setData({ dishes })
  },

  // 显示/隐藏筛选
  toggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },

  // 选择筛选标签
  selectTag(e) {
    const tagKey = e.currentTarget.dataset.tag
    const filterTags = this.data.filterTags.map(tag => {
      if (tag.key === tagKey) {
        tag.selected = !tag.selected
      }
      return tag
    })
    this.setData({ filterTags })
    this.updateDishes()
  },

  // 清除筛选
  clearFilter() {
    const filterTags = this.data.filterTags.map(tag => {
      tag.selected = false
      return tag
    })
    this.setData({ filterTags })
    this.updateDishes()
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value.trim()
    this.setData({ searchKeyword: keyword })
    if (keyword) {
      this.doSearch(keyword)
    } else {
      this.setData({ isSearching: false, searchResults: [] })
    }
  },

  onSearchConfirm(e) {
    const keyword = e.detail.value.trim()
    if (keyword) {
      this.doSearch(keyword)
    }
  },

  doSearch(keyword) {
    const { allDishes, categoryNameMap } = this.data
    const results = []
    const kw = keyword.toLowerCase()

    Object.keys(allDishes).forEach(categoryKey => {
      const dishes = allDishes[categoryKey] || []
      dishes.forEach(dish => {
        if (dish.name.toLowerCase().includes(kw)) {
          results.push(Object.assign({}, dish, {
            categoryKey: categoryKey,
            categoryName: categoryNameMap[categoryKey] || categoryKey
          }))
        }
      })
    })

    this.setData({ isSearching: true, searchResults: results })
  },

  clearSearch() {
    this.setData({ searchKeyword: '', isSearching: false, searchResults: [] })
  },

  // 搜索结果跳转详情
  goToSearchDetail(e) {
    const dish = e.currentTarget.dataset.dish
    const category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: `/pages/detail/detail?id=${dish.id}&category=${category}`
    })
  },

  // 跳转详情页
  goToDetail(e) {
    const dish = e.currentTarget.dataset.dish
    wx.navigateTo({
      url: `/pages/detail/detail?id=${dish.id}&category=${this.data.currentMainCategory}`
    })
  },

  // 获取当前分类标题
  getCurrentTitle() {
    const { currentMainCategory, currentCuisine, cuisineCategories, mainCategories } = this.data
    if (currentMainCategory === 'hot' && currentCuisine) {
      const cuisine = cuisineCategories.find(c => c.id === currentCuisine)
      return cuisine ? cuisine.name : '热菜'
    }
    const mainCat = mainCategories.find(c => c.key === currentMainCategory)
    return mainCat ? mainCat.name : '热菜'
  }
})
