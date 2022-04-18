var searchText = ""

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isClear: false,
        inputVal: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    inputSearchText(e) { //监听搜索框输入文本
        searchText = e.detail.value
        if (searchText != "") { //如果文本框不为空，显示clear图标，反之不显示
            this.setData({
                isClear: true
            })
        } else {
            this.setData({
                isClear: false
            })
        }
    },
    clearSearchBox() { //清空搜索框文本
        console.log("点击了清空按钮")
        this.setData({
            isClear: false,
            inputVal: ""
        })
    }
})