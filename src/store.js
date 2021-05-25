import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex);

// store数据持久化
const vuexPersist = new VuexPersist({
    key: 'ems',
    storage: localStorage
});

export default new Vuex.Store({
    state: {
        auth: {
            user: null,
            id:null,
            token: null,
            // 身份信息，用于权限控制
            identity: null
        },
        color: {
            primary: '#35CBAA',
            success: '#35CBAA',
            warning: '#F6B93D',
            danger: '#EF6372',
            error: '#EF6372',
            info: '#60BCFE'
        },
        timeout: null,
        intervals: [],
        dateFormat: 'yyyy-MM-dd HH:mm:ss',
        url: {
            auth: {
                login: 'api/account/login',
                reset: 'api/account/resetPwd?username={username}&identity={identity}',
                update: '/api/account/updatePwd',
                allInform:'/api/account/allInform',
            },
            admin: {
                usr:'api/admin/usr?tele={tele}',
                allInfo:'/api/admin/all?tele={tele}&name={name}&pageSize={pageSize}&currentPage={currentPage}',
                del:'api/admin/delete?tele={tele}',
                add:'api/admin/add',
                update:'api/admin/update',
                upload:'api/admin/upload'
            },
            resident:{
                allInfo:'api/resident/all?usr_tele={usr_tele}&name={name}&pageSize={pageSize}&currentPage={currentPage}',
                add:'api/resident/add',
                del:'api/resident/delete?tele={tele}',
                update: 'api/resident/update',
                usr:'api/resident/usr?tele={tele}',
            },
            room:{
                allInfo:'api/room/all?pageSize={pageSize}&currentPage={currentPage}',
                del:'api/room/delete?roomId={roomId}',
                add:'api/room/add',
                update:'api/room/update',
                detail:'api/room/detail?roomId={roomId}'
            },
            activity:{
                reserve:'api/activity/reserve',
                allInfo:'api/activity/allInfo?pageSize={pageSize}&currentPage={currentPage}&room_id={room_id}',
                all:'api/activity/all?pageSize={pageSize}&currentPage={currentPage}&room_id={room_id}&status={status}',
                cancel:'api/activity/cancel?activity_id={activity_id}',
                approve:'api/activity/approve?adminId={adminId}&activity_id={activity_id}&status={status}',
            },
            notice: {
                allInfo: 'api/notice/all',
                del: 'api/notice/delete?id={id}',
                add: 'api/notice/add',
                update: 'api/notice/update',
                detail:'api/notice/detail?id={id}'
            },
            vote:{
                add:'api/vote/add',
                count:'api/vote/count?vote_id={vote_id}',
                allInfo:'api/vote/all',
                check:'api/vote/check',
            },
            advise:{
                add:'api/advise/add',
                all:'api/advise/all',
                detail:'api/advise/detail?adviseId={adviseId}',
                feedback:'api/advise/feedback',
                allInfo:'api/advise/allInfo?resident_id={resident_id}&pageSize={pageSize}&currentPage={currentPage}',
                change:'api/advise/changeStatus?advise_id={advise_id}&status={status}',
            },
            repair:{
                add:'api/repair/add',
                // 用户角度
                allInfo:'api/repair/all?id={usr_id}&pageSize={pageSize}&currentPage={currentPage}',
                cancel:'api/repair/cancel?repair_id={repair_id}',
                // 管理员角度
                all: 'api/repair/allInfo',
                approve:'api/repair/approve?adminId={adminId}&repair_id={repair_id}&status={status}',
            }
        }
    },

    mutations: {
        // auth
        setToken(state, token) {
            state.auth.token = token
        },
        clearToken(state) {
            state.auth.token = null
        },
        // user
        setUser(state, user) {
            state.auth.user = user
        },
        clearUser(state) {
            state.auth.user = null
        },
        // id
        setId(state,id){
            state.auth.id = id
        },
        clearId(state){
            state.auth.id = null
        },
        // identity
        setIdentity(state, identity) {
            state.auth.identity = identity
        },
        clearIdentity(state) {
            state.auth.identity = null
        },
        // timeout
        setTimeout: (state, timeout) => {
            if (state.timeout) {
                clearTimeout(state.timeout)
            }
            state.timeout = timeout
        },
        clearTimeout: (state) => {
            clearTimeout(state.timeout)
        },
        addInterval: (state, interval) => {
            state.intervals.push(interval)
        },
        clearIntervals: (state) => {
            state.intervals.forEach(interval => {
                clearInterval(interval)
            });
            state.intervals = []
        },
    },
    getters: {
        token: state => {
            return state.auth.token
        },
        user: state => {
            return state.auth.user
        }
    },
    plugins: [vuexPersist.plugin]
})
