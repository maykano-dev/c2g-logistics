const fs = require('fs');
const files = [
  'apps/main/app/importers/register/actions.ts',
  'apps/main/app/dashboard/packages/actions.ts',
  'apps/main/app/dashboard/link-orders/actions.ts',
  'apps/main/app/importer-dashboard/products/actions.ts',
  'apps/main/app/dashboard/settings/actions.ts',
  'apps/main/app/auth/actions.ts',
  'apps/main/app/employee/queue/actions.ts',
  'apps/main/app/checkout/actions.ts'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const newContent = content.replace(/validation\.error\.issues\[0\]\.message/g, "validation.error.issues[0]?.message || 'Validation failed'");
  fs.writeFileSync(f, newContent);
});
console.log('Fixed TypeScript errors');
