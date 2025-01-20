export const appBootstrap = `
import { Server, ServerStrategy, ServerFactory } from './app';
async function bootstrap(): Promise<void> {
	try {
		const server = Server.getInstance();
		await server.initialize();

		const app = server.getApp();
		const port = process.env.PORT || 3000;

		const serverStrategy: ServerStrategy = ServerFactory.createServer(app, port);
		serverStrategy.start();
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

bootstrap();

export default Server.getInstance().getApp;
`;