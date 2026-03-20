// pages/detail/detail.js
const hotDishes = require('../../data/hot-dishes.json')
const coldDishes = require('../../data/cold-dishes.json')
const soups = require('../../data/soups.json')
const desserts = require('../../data/desserts.json')

Page({
  data: {
    dish: null,
    currentStep: 0
  },

  onLoad(options) {
    const { id, category } = options
    let dishes

    switch (category) {
      case 'hot':
        dishes = hotDishes.dishes
        break
      case 'cold':
        dishes = coldDishes.dishes
        break
      case 'soup':
        dishes = soups.dishes
        break
      case 'dessert':
        dishes = desserts.dishes
        break
      default:
        dishes = hotDishes.dishes
    }

    const dish = dishes.find(d => d.id === id)
    if (dish) {
      wx.setNavigationBarTitle({
        title: dish.name
      })
      this.setData({ dish })
    }
  },

  // 预览图片
  previewImage() {
    wx.previewImage({
      current: this.data.dish.image,
      urls: [this.data.dish.image]
    })
  },

  // 复制食材
  copyIngredients() {
    const ingredients = this.data.dish.ingredients.join('、')
    wx.setClipboardData({
      data: ingredients,
      success: () => {
        wx.showToast({
          title: '已复制食材',
          icon: 'success'
        })
      }
    })
  },

  // 下一步
  nextStep() {
    if (this.data.currentStep < this.data.dish.steps.length - 1) {
      this.setData({
        currentStep: this.data.currentStep + 1
      })
    }
  },

  // 上一步
  prevStep() {
    if (this.data.currentStep > 0) {
      this.setData({
        currentStep: this.data.currentStep - 1
      })
    }
  },

  // 选择步骤
  selectStep(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentStep: index
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: `今天吃${this.data.dish.name}？`,
      path: `/pages/detail/detail?id=${this.data.dish.id}&category=${this.data.dish.category}`,
      imageUrl: this.data.dish.image
    }
  }
})
