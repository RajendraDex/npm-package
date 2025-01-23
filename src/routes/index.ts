import { Router } from 'express';
import authRoutes from './users/authRoutes';
import roleRoutes from './users/rolesRoutes';
import permissionRoutes from './users/permissionRoutes'
import tenantRoutes from './tenant/tenantRoutes'
import customerRoutes from './tenant/customerRoutes'
import cuatomerSignUp from './tenant/auth'
import staffRoutes from './tenant/staffRoutes'
import servicesRoutes from './tenant/servicesRoutes';
import addressRoutes from './tenant/addressRoutes';


const router = Router();

// Combine all routes`
router.use('/users', authRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/tenants', tenantRoutes);
router.use('/tenants/customer', customerRoutes);
router.use('/tenants/customer', cuatomerSignUp);
router.use('/tenants/staff', staffRoutes);
router.use('/services', servicesRoutes);
router.use('/address', addressRoutes);
export default router;
