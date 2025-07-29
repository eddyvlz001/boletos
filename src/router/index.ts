import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard.vue';
import NuevoContrato from '../components/NuevoContrato.vue';
import NuevaRifa from '../components/NuevaRifa.vue';
import OrdenTrabajo from '../components/OrdenTrabajo.vue';
import InformacionEmpresa from '../components/InformacionEmpresa.vue';
import Login from '../components/Login.vue';
import GestionUsuarios from '../components/GestionUsuarios.vue';
import Versiones from '../components/Versiones.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/nuevo-contrato',
    name: 'nuevo-contrato',
    component: NuevoContrato
  },
  {
    path: '/nueva-rifa',
    name: 'nueva-rifa',
    component: NuevaRifa
  },
  {
    path: '/orden-trabajo',
    name: 'orden-trabajo',
    component: OrdenTrabajo
  },
  {
    path: '/empresa',
    name: 'empresa',
    component: InformacionEmpresa
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: GestionUsuarios,
    meta: { requiresAdmin: true }
  },
  {
    path: '/versiones',
    name: 'versiones',
    component: Versiones,
    meta: { requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const isAdmin = usuario.rol === 'admin';
  const isPublicRoute = to.meta.public;
  const requiresAdmin = to.meta.requiresAdmin;

  if (!token && !isPublicRoute) {
    next('/login');
    return;
  }

  if (token && to.path === '/login') {
    next('/dashboard');
    return;
  }

  if (requiresAdmin && !isAdmin) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;