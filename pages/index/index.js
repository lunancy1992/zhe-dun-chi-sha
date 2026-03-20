// pages/index/index.js
const app = getApp()

// 引入菜品数据
const hotDishes = require('../../data/hot-dishes.json')
const coldDishes = require('../../data/cold-dishes.json')
const soups = require('../../data/soups.json')
const desserts = require('../../data/desserts.json')

Page({
  data: {
    categories: [
      { key: 'hot', name: '热菜', icon: '🔥' },
      { key: 'cold', name: '凉菜', icon: '🥗' },
      { key: 'soup', name: '汤', icon: '🍲' },
      { key: 'dessert', name: '甜品', icon: '🍰' }
    ],
    currentCategory: 'hot',
    dishes: [],
    allDishes: {
      hot: hotDishes.dishes,
      cold: coldDishes.dishes,
      soup: soups.dishes,
      dessert: desserts.dishes
    },
    filterTags: [
      { key: 'spicy', name: '偏辣', selected: false },
      { key: 'sour', name: '偏酸', selected: false },
      { key: 'sweet', name: '偏甜', selected: false }
    ],
    showFilter: false
  },

  onLoad() {
    this.setData({
      dishes: this.data.allDishes.hot
    })
  },

  // 切换分类
  switchCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      currentCategory: category,
      dishes: this.filterDishes(this.data.allDishes[category])
    })
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
    this.applyFilter()
  },

  // 应用筛选
  applyFilter() {
    const selectedTags = this.data.filterTags
      .filter(tag => tag.selected)
      .map(tag => tag.name)

    const categoryDishes = this.data.allDishes[this.data.currentCategory]

    if (selectedTags.length === 0) {
      this.setData({ dishes: categoryDishes })
    } else {
      const filtered = categoryDishes.filter(dish =>
        dish.tags && dish.tags.some(tag => selectedTags.includes(tag))
      )
      this.setData({ dishes: filtered })
    }
  },

  // 筛选菜品
  filterDishes(dishes) {
    const selectedTags = this.data.filterTags
      .filter(tag => tag.selected)
      .map(tag => tag.name)

    if (selectedTags.length === 0) {
      return dishes
    }
    return dishes.filter(dish =>
      dish.tags && dish.tags.some(tag => selectedTags.includes(tag))
    )
  },

  // 跳转详情页
  goToDetail(e) {
    const dish = e.currentTarget.dataset.dish
    wx.navigateTo({
      url: `/pages/detail/detail?id=${dish.id}&category=${this.data.currentCategory}`
    })
  },

  // 清除筛选
  clearFilter() {
    const filterTags = this.data.filterTags.map(tag => {
      tag.selected = false
      return tag
    })
    this.setData({
      filterTags,
      dishes: this.data.allDishes[this.data.currentCategory]
    })
  }
})
