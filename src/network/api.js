import request from './request.js'

// 获取验证码
export async function getCaptcha() {
    return await request({
        url: '/getcaptcha',
        method: 'get'
    })
}

// 登录
export async function login(form) {
    let { data: res } = await request({
        url: '/login',
        method: 'post',
        data: form
    })
    return res
}

// 注册
export async function register(form) {
    let { data: res } = await request({
        url: '/register',
        method: 'post',
        data: form
    })
    return res
}

// 获取课程列表
export async function getSubjects(id) {
    let { data: res } = await request({
        url: '/subjects/getlist',
        method: 'get',
        params: {id}
    })
    return res
}

// 增加课程
export async function addSubject(form) {
    let { data: res } = await request({
        url: '/subjects/add',
        method: 'post',
        data: form
    })
    return res
}

// 删除课程
export async function delSubject(id,rid) {
    let { data: res } = await request({
        url: '/subjects/del',
        method: 'get',
        params: {id,rid}
    })
    return res
}

// 获取服务器存储的资源管理器目录
export async function getResource(username) {
    let { data: res } = await request({
        url: '/resource/getlist',
        method: 'get',
        params: {username}
    })
    return res
}

// 上传文件
export async function upload(formData) {
    let { data: res } = await request({
        url: '/resource/upload',
        method: 'post',
        data: formData
    })
    return res
}

// 批量下载文件
export async function multipleDownload(data) {
    let { data: res } = await request({
        url: '/resource/download',
        method: 'get',
        params: data
    })
    return res
}

// 批量删除文件
export async function multipleDel(data) {
    let { data: res } = await request({
        url: '/resource/del',
        method: 'get',
        params: data
    })
    return res
}

// 重命名文件
export async function singleRename(data) {
    let { data: res } = await request({
        url: '/resource/rename',
        method: 'post',
        data
    })
    return res
}

// 获取通知列表
export async function getNotify(sub_id) {
    let { data: res } = await request({
        url: '/notify/getlist',
        method: 'get',
        params: sub_id
    })
    return res
}


// 添加通知
export async function addNotify(data) {
    let { data: res } = await request({
        url: '/notify/add',
        method: 'post',
        data
    })
    return res
}

// 删除通知
export async function delNotify(id) {
    let { data: res } = await request({
        url: '/notify/del',
        method: 'get',
        params: {id}
    })
    return res
}

// 修改通知
export async function editNotify(data) {
    let { data: res } = await request({
        url: '/notify/edit',
        method: 'post',
        data
    })
    return res
}

// 查看学生列表
export async function getStu(id) {
    let { data: res } = await request({
        url: '/stu/getlist',
        method: 'get',
        params: id
    })
    return res
}

// 搜索学生
export async function searchStu(info) {
    let { data: res } = await request({
        url: '/stu/search',
        method: 'get',
        params: info
    })
    return res
}

// 添加学生
export async function addStu(info) {
    let { data: res } = await request({
        url: '/stu/add',
        method: 'post',
        data: info
    })
    return res
}

// 删除学生
export async function delStu(info) {
    let { data: res } = await request({
        url: '/stu/del',
        method: 'get',
        params: info
    })
    return res
}

// 获取讨论列表
export async function getDiscussion(info) {
    let { data: res } = await request({
        url: '/discussion/getlist',
        method: 'get',
        params: info
    })
    return res
}

// 新建话题
export async function addDiscussion(info) {
    let { data: res } = await request({
        url: '/discussion/add',
        method: 'post',
        data: info
    })
    return res
}

// 删除话题
export async function delDiscussion(info) {
    let { data: res } = await request({
        url: '/discussion/del',
        method: 'get',
        params: info
    })
    return res
}

// 新建作业
export async function addHomework(info) {
    let { data: res } = await request({
        url: '/homework/add',
        method: 'post',
        data: info
    })
    return res
}

// 查询作业列表
export async function getHomework(info) {
    let { data: res } = await request({
        url: '/homework/getlist',
        method: 'get',
        params: info
    })
    return res
}

//  查看成绩单
export async function getTranscript(info) {
    let { data: res } = await request({
        url: '/homework/gettranscript',
        method: 'get',
        params: info
    })
    return res
}

// 删除作业
export async function delHomework(info) {
    let { data: res } = await request({
        url: '/homework/del',
        method: 'get',
        params: info
    })
    return res
}