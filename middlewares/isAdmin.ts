import { Request, Response, NextFunction } from 'express';

function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.userPrivileges)
        return res.json({ message: 'You are not authorized to make this request' });
    next();
}

export default isAdmin;