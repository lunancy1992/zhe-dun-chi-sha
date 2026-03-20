// pages/index/index.js
const app = getApp()

// 引入菜品数据
const hotDishesData = require('../../data/hot-dishes.js')
const coldDishes = require('../../data/cold-dishes.js')
const soups = require('../../data/soups.js')
const desserts = require('../../data/desserts.js')

Page({
  data: {
    // 主分类
    mainCategories: [
      { key: 'hot', name: '热菜', icon: '🔥' },
      { key: 'cold', name: '凉菜', icon: '🥗' },
      { key: 'soup', name: '汤', icon: '🍲' },
      { key: 'dessert', name: '甜品', icon: '🍰' }
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
      dessert: desserts.dishes || []
    },

    filterTags: [
      { key: 'spicy', name: '偏辣', selected: false },
      { key: 'sour', name: '偏酸', selected: false },
      { key: 'sweet', name: '偏甜', selected: false }
    ],
    showFilter: false
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
