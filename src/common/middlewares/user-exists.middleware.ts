import { NestMiddleware, Logger, Injectable, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class UserExistsMiddleware implements NestMiddleware {

    private readonly logger = new Logger(UserExistsMiddleware.name)

    constructor(private readonly userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {

        this.logger.log(UserExistsMiddleware.name);

        var userId = req.params.id
        if (!userId) {
            userId = req.body.id;
        }

        const user = await this.userService.findOne(userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        next();
    }
}