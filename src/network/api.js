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