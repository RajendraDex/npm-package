import { Knex } from 'knex';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const plainPassword = 'Default@123';

export async function up(knex: Knex): Promise<void> {
  // Hash the default password
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  // Insert the 'All' permission with all operations
  const [permissionId] = await knex('permission_master')
    .insert({
      permission_name: 'Manage Website content',
      permission_description: 'Manage Website content permissions',
      permission_operations: knex.raw("ARRAY['create', 'read', 'update', 'delete']::permission_operations_enum[]"),
    })
    .returning('id');

  // Define the permissions to be added
  const permissions = [
    'Manage digital library',
    'Manage category for digital library, e-commerce, and provider expertise',
    'Manage customers',
    'Manage services',
    'Manage companies',
    'Manage providers',
    'Manage provider schedule /Booker',
    'Book Sessions on behalf of the customer',
    'Manage Orders',
    'Manage articles/Blogs',
    'Financial/Sales History',
    'Manage commission as staff customer',
    'Manage Blackout days'
  ];

  // Insert each permission into the permission_master table
  for (const permissionName of permissions) {
    await knex('permission_master')
      .insert({
        permission_name: permissionName,
        permission_description: `${permissionName} description`,
        permission_operations: knex.raw("ARRAY['create', 'read', 'update', 'delete']::permission_operations_enum[]"),
      });
  }

  // Insert the super admin role
  const [roleId] = await knex('roles')
    .insert({
      role_name: 'Super Admin',
      role_description: 'Super admin with all permissions',
      role_permissions: JSON.stringify([
        {
          "permission_id": permissionId.id,
          "permission_operations": [
            "create",
            "read",
            "update",
            "delete"
          ]
        }
      ]),
    })
    .returning('id');

  // Link all permissions to the super admin role
  const allPermissions = await knex('permission_master').select('id');
  const rolePermissions = allPermissions.map(permission => ({
    permission_id: permission.id,
    permission_operations: ["create", "read", "update", "delete"]
  }));

  await knex('roles')
    .where('role_name', 'Super Admin')
    .update({ role_permissions: JSON.stringify(rolePermissions) });

  // Insert the super admin user
  const [adminId] = await knex('saas_admin')
    .insert({
      first_name: 'Super',
      last_name: 'Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      status: true,
    })
    .returning('id');

  // Link the super admin role to the super admin user
  await knex('role_link')
    .insert({
      admin_id: adminId.id,
      role_id: roleId.id,
    });

  // Insert the /all route for the 'All' permission
  await knex('permission_routes_master')
    .insert({
      permission_id: permissionId.id,
      route_endpoint: '/all',
    });
}

export async function down(knex: Knex): Promise<void> {
  // Remove the /all route entry for the 'All' permission
  await knex('permission_routes_master')
    .where('route_endpoint', '/all')
    .del();

  // Remove the super admin role and related entries
  await knex('role_link')
    .where('role_id', knex('roles').select('id').where('role_name', 'Super Admin'))
    .del();
  
  await knex('roles')
    .where('role_name', 'Super Admin')
    .del();
  
  await knex('permission_master')
    .where('permission_name', 'All')
    .del();
}
