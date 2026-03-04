import { Controller ,Post , Body} from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController{
    constructor(private readonly adminService : AdminService){}

@Post('login')
    login(@Body() body:any){
        return this.adminService.login(
            body.username , body.password);
    }

@Post('create')
    create(@Body() body:any){
        return this.adminService.createAdmin(body);
    }
}