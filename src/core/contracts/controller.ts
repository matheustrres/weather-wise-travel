import { Router, type Request, type Response } from 'express';

export abstract class Controller {
	abstract readonly prefix: string;
	readonly router: Router;

	protected constructor() {
		this.router = Router();
	}

	protected abstract handle(req: Request, res: Response): Promise<Response>;

	protected abstract initRoutes(): void;
}
