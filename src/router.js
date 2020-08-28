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
					component: () => import('./views/resident/VoteBox')

				}
			]
		},
		{
			path: '/',
			redirect: '/login',
			name: 'layout',
			component: Layout,
			children: [
				{
					path: '/student/elective',
					name: 'elective',
					component: () => import('./views/student/Elective')
				},
				// {
				// 	path: '/repair/report',
				// 	name: 'repairreport',
				// 	component: () => import('./views/resident/repairreport')
				//
				// },
				{
					path: '/student/grade',
					name: 'studentGrade',
					component: () => import('./views/student/StudentGrade')
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
					path: '/teacher/manage',
					name: 'TeacherManage',
					component: () => import('./views/admin/TeacherManage.vue')
				},
				{
					path: '/open/manage',
					name: 'OpenManage',
					component: () => import('./views/admin/OpenManage.vue')
				},
				{
					path: '/choice/manage',
					name: 'ChoiceManage',
					component: () => import('./views/admin/ChoiceManage')
				},
				{
					path: '/common/password',
					name: 'Password',
					component: () => import('./views/common/Password')
				},
				{
					path: '/teacher/open',
					name: 'OpenCourse',
					component: () => import('./views/teacher/OpenCourse')
				},
				{
					path: '/teacher/input',
					name: 'InputGrade',
					component: () => import('./views/teacher/InputGrade')
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
