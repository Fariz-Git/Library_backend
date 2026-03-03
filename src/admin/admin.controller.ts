import { Controller ,Post , Body , Patch } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController{
    constructor(private readonly adminService : AdminService){}

@Post('login')
    login(@Body() body:any){
        return this.adminService.login(
            body.username , body.password);
    }

@Patch('update')
    update(@Body() body:any) {
        return this.adminService.updateCredentials(
            body.username , body.password) ;
    }
}