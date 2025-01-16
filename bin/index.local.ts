import 'module-alias/register';
import { main } from '../generator/index';
main(null).catch((err: Error) => {
	console.error('Error:', err);
	process.exit(1);
});
