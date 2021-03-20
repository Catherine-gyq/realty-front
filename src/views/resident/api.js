import request from '../../utils/request'
// 获取你要的数据
export function getNoticeAllInfo(data) {
    return request({
        url: '/notice/all',//自己的接口地址
        method: 'post',//请求方法
    },data)
}
