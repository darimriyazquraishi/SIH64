import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AppLayout from '@/layouts/AppLayout.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ComplaintsListView from '@/views/ComplaintsListView.vue'
import ComplaintDetailView from '@/views/ComplaintDetailView.vue'
import InstitutionDirectoryView from '@/views/InstitutionDirectoryView.vue'
import InstitutionProfileView from '@/views/InstitutionProfileView.vue'
import OverlapReviewView from '@/views/OverlapReviewView.vue'
import ReportsView from '@/views/ReportsView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import ImportDataView from '@/views/ImportDataView.vue'
import AdminView from '@/views/AdminView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView,
      },
      {
        path: 'complaints',
        name: 'complaints',
        component: ComplaintsListView,
      },
      {
        path: 'complaints/:id',
        name: 'complaint-detail',
        component: ComplaintDetailView,
      },
      {
        path: 'institutions',
        name: 'institutions',
        component: InstitutionDirectoryView,
      },
      {
        path: 'institutions/:id',
        name: 'institution-profile',
        component: InstitutionProfileView,
      },
      {
        path: 'overlaps',
        name: 'overlaps',
        component: OverlapReviewView,
      },
      {
        path: 'reports',
        name: 'reports',
        component: ReportsView,
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: NotificationsView,
      },
      {
        path: 'imports',
        name: 'imports',
        component: ImportDataView,
      },
      {
        path: 'admin',
        name: 'admin',
        component: AdminView,
        meta: { requiresRole: 'admin' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  if (to.meta.requiresRole && authStore.user?.role !== to.meta.requiresRole) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
