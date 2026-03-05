import { Controller ,Post , Body , Get ,Query ,Delete, Param ,Patch} from "@nestjs/common";
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
        return this.adminService.createAdmin(
            body , body.currentAdminId);
    }
@Get()
getAll(@Query('adminId') adminId:number){
  return this.adminService.findAll(adminId);
}  

@Delete(':id')
delete(
    @Param('id') id:number,
    @Query('adminId') adminId:number
){
    return this.adminService.deleteAdmin(id,adminId)}

@Patch('password/:id')
  changePassword(
  @Param('id') id:number,
  @Body('password') password:string
){
  return this.adminService.changePassword(id,password);
}   
}