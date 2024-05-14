import { Router, type Request, type Response } from 'express';

export abstract class Controller {
	abstract readonly prefix: string;
	readonly router: Router;

	constructor() {
		this.router = Router();
	}

	abstract handle(req: Request, res: Response): Promise<Response>;

	abstract initRoutes(): void;
}
