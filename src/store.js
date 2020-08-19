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
                // del:'/api/account/delete?tele={tele}',
            },
            admin: {
                usr:'api/admin/usr?tele={tele}'
            },
            resident:{
                allInfo:'api/resident/all?usr_tele={usr_tele}&name={name}',
                add:'api/resident/add',
                del:'api/resident/delete?tele={tele}',
                update: 'api/resident/update',
            },
            // student: {
            //     add: 'api/student/add',
            //     update: 'api/student/update',
            //     del: 'api/student/delete?no={no}',
            //     // allInfo: 'api/student/all?no={no}&name={name}',
            //     ownCourse: 'api/elective/find/OwnCourse/student?no={no}',
            //     enableCourse: 'api/elective/find/enableCourse/student',
            // },
            teacher: {
                add: 'api/teacher/add',
                search: '/api/teacher/search?de={de}',
                update: 'api/teacher/update',
                del: 'api/teacher/delete?no={no}',
                allInfo: 'api/teacher/all?no={no}&name={name}'
            },
            notice: {
                allInfo: 'api/notice/all?time={time}&name={name}',
                del: 'api/notice/delete?id={id}',
                add: 'api/notice/add',
                update: 'api/notice/update',
            },
            // course:{
            //     add: 'api/course/add',
            //     update: 'api/course/update',
            //     del: 'api/course/delete?no={no}',
            //     allInfo: 'api/course/all?no={no}&name={name}',
            //     allStudent: 'api/elective/find/student/course?no={no}',
            // },
            open: {
                add: 'api/open/add',
                update: 'api/open/update',
                del: 'api/open/delete?id={id}',
                allInfo: 'api/open/all?no={no}&name={name}',
                search: '/api/open/search'
            },
            department:{
                allInfo: 'api/department/all'
            },
            term:{
                allInfo: 'api/term/all'
            },
            elective: {
                choose: 'api/elective/add',
                del: 'api/elective/delete?sno={sno}&cno={cno}'
            },
            grade:{
                update: 'api/elective/update',
                studentGrade: 'api/elective/find/grade/student?no={no}&term={term}'
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
