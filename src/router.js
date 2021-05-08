import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layout/Index.vue'
import Top from "@/components/Top"
// import Left from "@/components/Left";


Vue.use(Router);

// 页面路由配置
const router = new Router({
	routes: [
		{
			path: '/login',
			name: 'login',
			component: () => import('./views/login/Login.vue'),
		},
		{
			path: '/',//根路径
			redirect: '/login',//重定向
			name: 'Top',
			component: Top,
			children: [
				{
					path: '/notice/check',
					name: 'NoticeCheck',
					component: () => import('./views/resident/NoticeCheck')
				},
				{
					path: '/notice/detail',
					name: 'NoticeDetail',
					component: () => import('./views/resident/NoticeDetail')
				},
				{
					path: '/repair/report',
					name: 'RepairReport',
					component: () => import('./views/resident/RepairReport')

				},
				{
					path: '/activity/reserve',
					name: 'ActivityReserve',
					component: () => import('./views/resident/ActivityReserve')

				},
				{
					path: '/resident/vote',
					name: 'VoteBox',
					component: () => import('./views/resident/VoteBox')

				},
				{
					path: '/resident/advise',
					name: 'AdviseBox',
					component: () => import('./views/resident/AdviseBox')

				},
				{
					path: '/resident/personalCenter',
					name: 'residentPersonalCenter',
					component: () => import('./views/resident/personalCenter')
				},
			]
		},
		{
			path: '/',
			redirect: '/login',
			name: 'layout',
			component: Layout,
			children: [
				{
					path: '/admin/manage',
					name: 'AdminManage',
					component: () => import('./views/admin/AdminManage.vue')
				},
				{
					path: '/resident/manage',
					name: 'ResidentManage',
					component: () => import('./views/admin/ResidentManage.vue')
				},
				{
					path: '/notice/manage',
					name: 'NoticeManage',
					component: () => import('./views/admin/NoticeManage.vue')
				},
				{
					path: '/notice/add',
					name: 'NoticeAdd',
					component: () => import('./views/admin/NoticeAdd.vue')
				},
				{
					path: '/repairReserve/manage',
					name: 'RepairReserve',
					component: () => import('./views/admin/RepairReserveManage.vue')
				},
				{
					path: '/advise/manage',
					name: 'AdviseManage',
					component: () => import('./views/admin/AdviseManage')
				},
				{
					path: '/advise/response',
					name: 'AdviseResponse',
					component: () => import('./views/admin/AdviseResponse')
				},
				{
					path: '/common/password',
					name: 'Password',
					component: () => import('./views/common/Password')
				},
				{
					path: '/common/personalCenter',
					name: 'adminPersonalCenter',
					component: () => import('./views/admin/personalCenter')
				},
				{
					path: '/activity/manage',
					name: 'ActivityManage',
					component: () => import('./views/admin/ActivityManage')
				},
				{
					path: '/room/manage',
					name: 'RoomManage',
					component: () => import('./views/admin/RoomManage')
				},
				{
					path: '/warn/manage',
					name: 'WarnManage',
					component: () => import('./views/admin/WarnManage')
				},
			]
		},
	]
});

// 全局路由配置,执行跳转成功后清除上个页面可能存在的定时任务
router.afterEach(() => {
	router.app.$store.commit('clearIntervals');
	router.app.$store.commit('clearTimeout');
});

export default router
