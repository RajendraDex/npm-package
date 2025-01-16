import 'module-alias/register';
import { main } from '@generator/index';

main().catch((err: Error) => {
  console.error('Error:', err);
  process.exit(1);
});
