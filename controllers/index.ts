import type {Request, Response} from 'express';
import {request} from 'http';
export interface controllerAction {
    (req: Request, res: Response): void;
}
export const useController = (controllerAction: (req: Request, res: Response) => void) => controllerAction;
