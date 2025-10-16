import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "../services/user.service";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get(':id')
    public async getUserById(@Param("id") id: string) {
        this.userService.getUserById(id)
            .then(res => {
                return {user: res}
            })
            .catch(err => {
                return {error: err}
            })
    }
}