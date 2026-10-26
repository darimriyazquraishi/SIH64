import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'
import LoginView from '@/views/LoginView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/landing', redirect: '/' },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  {
    path: '/', component: AppLayout, meta: { requiresAuth: true }, children: [
      { path: '', name: 'dashboard', component: WorkspaceView },
      { path: 'complaints', name: 'complaints', component: WorkspaceView },
      { path: 'complaints/:id', name: 'complaint-detail', component: WorkspaceView },
      { path: 'institutions', name: 'institutions', component: WorkspaceView },
      { path: 'institutions/:id', name: 'institution-profile', component: WorkspaceView },
      { path: 'overlaps', name: 'overlaps', component: WorkspaceView },
      { path: 'reports', name: 'reports', component: WorkspaceView },
      { path: 'notifications', name: 'notifications', component: WorkspaceView },
      { path: 'imports', name: 'imports', component: WorkspaceView },
      { path: 'admin', name: 'admin', component: WorkspaceView, meta: { requiresRole: 'admin' } },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) return '/'
  if (to.meta.requiresRole && to.meta.requiresRole !== auth.user?.role && auth.user?.role !== 'admin') {
    return '/'
  }
  return true
})

export default router
