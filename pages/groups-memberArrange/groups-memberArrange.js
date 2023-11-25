// pages/memberArrange/memberArrage.js
wx.cloud.init()
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAddNewMemberTapped: false,
        isSearched: false,
        searchedUsers: [],
        group_id: '',
        group: '',
        originGroup: '',
        openId: ''
    },
    //获取数据
    async getData(id, collectionName) {
        let data = null
        wx.showLoading({
            title: '加载中',
        })
        await wx.cloud.callFunction({
            name: 'getData',
            data: {
                collectionName,
                id
            }
        }).then(res => {
            console.log('拉取成功', res)
            if (res.result.data instanceof Array) {
                data = res.result.data[0]
            }
            else {
                data = res.result.data
            }
            wx.hideLoading()
        })
            .catch(e => {
                console.log('拉取失败', id, collectionName)
                console.log(e)
                wx.hideLoading()
            })
        return data
    },
    //获取openid(微信自带的云函数)
    async getOpenId() {
        wx.showLoading({
            title: '加载中',
        });
        await wx.cloud.callFunction({
            name: 'getOpenId',
        }).then((resp) => {
            this.setData({
                openId: resp.result.openid
            });
            wx.hideLoading()
        }).catch((e) => {
            console.log(e)
            wx.hideLoading();
        });
    },
    //根据openId拉取用户数据
    async getUser(openId) {
        let data = null
        wx.showLoading({
            title: '加载中',
        })
        await wx.cloud.callFunction({
            name: 'getData',
            // config: {
            //     env: this.data.envId
            // },
            data: {
                collectionName: 'Users',
                id: openId
            }
        }).then(res => {
            console.log(res)
            data = res.result.data[0]
            wx.hideLoading()
        })
            .catch(e => {
                console.log(e)
                wx.hideLoading()
            })
        return data
    },
    //更新数据
    async updateData(collectionName, id, data) {
        wx.showLoading({
            title: '加载中',
        })
        await wx.cloud.callFunction({
            name: 'updateData',
            data: {
                collectionName,
                id,
                data
            }
        }).then(res => {
            console.log('更新成功')
            wx.hideLoading()
        })
            .catch(e => {
                console.log(e)
                wx.hideLoading()
            })
    },
    async onLoad(options) {
        console.log('传过来的', options._id)
        this.setData({
            group_id: options._id
        })
        await this.getOpenId()
    },
    async onShow() {
        var tem = await this.getData(this.data.group_id, 'Groups')

        for (var i = 0; i < tem.memberList.length; i++) {
            tem.memberList[i].member = await this.getUser(tem.memberList[i].memberId)
        }
        this.setData({
            group: tem
        })
        console.log('tem', tem)
    },
    goToAssignment(e) {
        wx.navigateTo({
            url: '/pages/groups-memberArrange-assignmentArrange/groups-memberArrange-assignmentArrange?userId=' + e.currentTarget.dataset.memberid + "&group_id=" + this.data.group_id,
        })
    },
    //监听 点击“添加组员”事件
    tapAddNewMember() {
        this.setData({ isAddNewMemberTapped: true })
    },
    //根据姓名学号在云数据库中模糊搜索
    async searchNewMember(e) {
        this.setData({ isSearched: true })
        var input = e.detail.value
        if (input === '') {
            this.setData({
                searchedUsers: []
            })
            return
        }
        const _ = db.command
        wx.showLoading({
            title: '加载中',
        })
        await db.collection('Users').where(_.or([{
            name: db.RegExp({
                regexp: input,
                options: 'i'
            })
        }, {
            studentNumber: db.RegExp({
                regexp: input,
                options: 'i'
            })
        }])).get()
            .then(res => {
                console.log('查询成功', res)
                var searchedUsers = []
                if (res.data.length > 0) {
                    for (var i = 0, len = res.data.length; i < len; i++) {
                        searchedUsers.push({
                            value: i.toString(),
                            name: res.data[i].name,
                            studentNumber: res.data[i].studentNumber,
                            userId: res.data[i].userId,
                            checked: false
                        })
                        if (i == 9)
                            break
                    }
                }
                this.setData({ searchedUsers })
                wx.hideLoading()
            })
            .catch(e => {
                console.log('查询失败', e)
                wx.hideLoading()
            })
    },
    selectSearchedUser(e) {
        const items = this.data.searchedUsers
        const values = e.detail.value
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            items[i].checked = false
            for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (items[i].value === values[j]) {
                    items[i].checked = true
                    break
                }
            }
        }
        console.log('searchedUsers == ', items)

        this.setData({
            searchedUsers: items
        })
    },
    // 取消 “添加组员”
    cancelAddNewMember() {
        this.setData({
            isAddNewMemberTapped: false,
            isSearched: false,
            searchedUsers: []
        })
    },
    // 添加组员 点击“提交”按钮
    async addNewMember() {
        console.log('searched ==', this.data.searchedUsers)
        var repeated = false
        for (var i = 0, lenI = this.data.searchedUsers.length; i < lenI; i++) {
            if (this.data.searchedUsers[i].checked) {
                console.log('checked userid == ', this.data.searchedUsers[i].userId)
                for (var j = 0, lenJ = this.data.group.memberList.length; j < lenJ; j++) {
                    if (this.data.searchedUsers[i].userId == this.data.group.memberList[j].memberId) {
                        repeated = true
                        break
                    }
                }
                if (repeated)
                    break
                var tmpUser = await this.getUser(this.data.searchedUsers[i].userId)
                var tmpGroup = await this.getData(this.data.group_id, 'Groups')
                tmpUser.groupIdList.push(this.data.group_id)
                for (var k = 0, lenK = tmpGroup.noticeIdList.length; k < lenK; k++) {
                    tmpUser.taskIdList.push(tmpGroup.noticeIdList[k])
                }
                await this.updateData('Users', tmpUser._id, tmpUser)
                var tmpMember = {
                    memberId: tmpUser.userId,
                    taskIdList: []
                }
                tmpGroup.memberList.push(tmpMember)
                await this.updateData('Groups', tmpGroup._id, tmpGroup)
                this.onShow()
            }
        }
        console.log('repeat ==', repeated)
        if (repeated) {
            wx.showToast({
                title: '请勿重复添加',
                icon: 'error'
            })
        }
        this.setData({
            isAddNewMemberTapped: false,
            isSearched: false,
            searchedUsers: []
        })
    },
    async deleteMember(e) {
        if (this.data.openId != this.data.group.administratorId)
            return
        console.log('delmem e', e)
        var delId = e.currentTarget.dataset.memberid
        if (delId == this.data.group.administratorId) {
            wx.showToast({
                title: '管理员不可被删除',
                icon: 'error'
            })
            return
        }
        var tmpGroup = this.data.group
        var tmpMemberList = tmpGroup.memberList
        var delMember = null
        var delTaskList = null
        for (var i = 0, lenI = tmpMemberList.length; i < lenI; i++) {
            if (tmpMemberList[i].memberId == delId) {
                delMember = tmpMemberList[i].member
                delTaskList = tmpMemberList[i].taskIdList
                break
            }
        }

        wx.showModal({
            title: '确定删除“' + delMember.name + '”吗？'
        }).then(async res => {
            if (res.confirm) {
                for (var i = 0, lenI = delMember.groupIdList.length; i < lenI; i++) {
                    if (delMember.groupIdList[i] == this.data.group_id) {
                        delMember.groupIdList.splice(i, 1)
                        break
                    }
                }
                for (var i = delMember.taskIdList.length - 1; i >= 0; i--) {
                    for (var j = 0, lenJ = delTaskList.length; j < lenJ; j++) {
                        if (delMember.taskIdList[i] == delTaskList[j]) {
                            delMember.taskIdList.splice(i, 1)
                            break
                        }
                    }
                }
                await this.updateData('Users', delMember._id, delMember)
                for (var i = 0, lenI = tmpMemberList.length; i < lenI; i++) {
                    if (tmpMemberList[i].memberId == delId) {
                        tmpMemberList.splice(i, 1)
                        break
                    }
                }
                this.setData({ group: tmpGroup })
                var toDelGroup = await this.getData(this.data.group_id, 'Groups')
                console.log('toDel = ', toDelGroup)
                for (var i = 0, lenI = toDelGroup.memberList.length; i < lenI; i++) {
                    if (toDelGroup.memberList[i].memberId == delId) {
                        toDelGroup.memberList.splice(i, 1)
                        break
                    }
                }
                await this.updateData('Groups', toDelGroup._id, toDelGroup)
            }
        })
    }

})