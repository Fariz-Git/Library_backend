import { Injectable , BadRequestException , NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin }  from "./admin.entity";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(Admin)
        private adminRepo : Repository<Admin>,
    ) {}

async createDefaultAdmin(){
    const admin = await this.adminRepo.findOne({
        where:{username:'admin'}
    })

      if (!admin) {
    const newAdmin = this.adminRepo.create({
      username: 'admin',
      password: 'admin123',
      role: 'superadmin',
    });

    await this.adminRepo.save(newAdmin);
}else{
    if (admin.role !== 'superadmin') {
      admin.role = 'superadmin';
      await this.adminRepo.save(admin);
        }
    }
}

async createAdmin(data:Partial<Admin> , currentAdminId:number){
    const currentAdmin = await this.adminRepo.findOne({
        where : {id:currentAdminId}
    });
    if (currentAdmin.role !== 'superadmin' ){
        throw new BadRequestException ("Only super admin can crate admin role")
    }
    const exists = await this.adminRepo.findOne({
        where :{username:data.username}
    });
    if (exists)  {
        throw new BadRequestException("Username already exists")
    }
      const admin = this.adminRepo.create({
    username:data.username,
    password:data.password,
    role:'admin'
  });

  return this.adminRepo.save(admin);
}

async login(username: string, password: string) {

  const admin = await this.adminRepo.findOne({
    where: {username},
  });

  if (!admin) {
    throw new BadRequestException("Invalid username");
  }

  // Prevent null password crash
  if (!admin.password || admin.password !== password) {
    throw new BadRequestException("Invalid password");
  }

  return {
    message: "Login Successfully",
    adminId: admin.id,
    role: admin.role,
  };
}

  async findAll(currentAdminId:number){
    const admin = await this.adminRepo.findOne({
        where :{id:currentAdminId}
    });

    if(admin.role !== "superadmin"){
        throw new BadRequestException("Access denied")
    }
        return this.adminRepo.find();
  };

  async deleteAdmin(id:number , currentAdminId:number){
    const admin = await this.adminRepo.findOne({
        where :{id:currentAdminId}
    });
    if (admin.role !== "superadmin"){
        throw new BadRequestException("Only super admin can delete")
    }
     await this.adminRepo.delete(id);

     return {message:"Admin deleted"};
  }

  async changePassword(id:number,password:string){

  const admin = await this.adminRepo.findOne({
    where:{id}
  });

  if(!admin){
    throw new NotFoundException("Admin not found");
  }

  admin.password = password;

  return this.adminRepo.save(admin);
}
}