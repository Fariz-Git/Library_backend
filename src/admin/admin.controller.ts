import { Controller ,Post , Body , Patch  ,Param} from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController{
    constructor(private readonly adminService : AdminService){}

@Post('login')
    login(@Body() body:any){
        return this.adminService.login(
            body.username , body.password);
    }

@Patch('update/:id')
update(
  @Param('id') id: string,
  @Body() body: any,
) {
  return this.adminService.updateAdmin(+id, body);
}
}