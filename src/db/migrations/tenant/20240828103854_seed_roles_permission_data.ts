import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  try {
    const permissions = [
   'Manage Website content',
   'Manage digital library',
   'Manage category',
   'Manage customers',
   'Manage services',
   'Manage companies',
   'Manage providers',
   'Manage provider schedule',
   'Manage Orders',
   'Manage articles/Blogs',
   'Manage Financial/Sales History',
   'Manage commission',
   'Manage Blackout days'
    ];

    const permissionIds = await Promise.all(permissions.map(async (permission) => {
      const [id] = await knex('permission_master')
        .insert({
          permission_name: permission,
          permission_description: permission,
          permission_operations: knex.raw("ARRAY['create', 'read', 'update', 'delete']::permission_operations_enum[]"),
        })
        .returning('id');
      return id.id;
    }));

    console.log('Permissions inserted successfully:', permissionIds);

    // Insert the super admin role
    const [roleId] = await knex('roles')
      .insert({
        role_name: 'Admin',
        role_description: 'Super admin with all permissions',
        role_permissions: JSON.stringify(permissionIds.map(id => ({ permission_id: id, permission_operations: ["create", "read", "update", "delete"] }))),
      })
      .returning('id');

    console.log('Super admin role inserted successfully:', roleId);

    // Assign role to superuser
    await knex('role_link')
      .insert({
        staff_id: 1,
        role_id: roleId.id,
      });

    console.log('Role assigned to superuser successfully.');

    // Insert the /all route for the 'All' permission
    // Insert the /all route for each permission
    await Promise.all(permissionIds.map(async (permissionId) => {
      await knex('permission_routes_master')
        .insert({
          permission_id: permissionId,
          route_endpoint: '/all',
        });
    }));

    console.log('Permission routes inserted successfully.');

  } catch (error) {
    console.error('Error in migration up function:', error);
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  try {
    // Retrieve the 'All' permission ID
    const permissionIdResult = await knex('permission_master')
      .where('permission_name', 'All')
      .select('id');

    const permissionId = permissionIdResult[0]?.id;

    if (permissionId) {
      // Delete the associated route from permission_routes_master
      await knex('permission_routes_master')
        .where('permission_id', permissionId)
        .del();

      console.log('Permission routes deleted successfully.');

      // Retrieve the super admin role ID
      const roleIdResult = await knex('roles')
        .where('role_name', 'Admin')
        .select('id');

      const roleId = roleIdResult[0]?.id;

      if (roleId) {
        // Delete the role link for the superuser
        await knex('role_link')
          .where({
            staff_id: 1,
            role_id: roleId,
          })
          .del();

        console.log('Role unassigned from superuser successfully.');

        // Delete the super admin role
        await knex('roles')
          .where('id', roleId)
          .del();

        console.log('Super admin role deleted successfully.');
      }

      // Delete the 'All' permission
      await knex('permission_master')
        .where('id', permissionId)
        .del();

      console.log('Default permission deleted successfully.');
    }
  } catch (error) {
    console.error('Error in migration down function:', error);
    throw error;
  }
}
