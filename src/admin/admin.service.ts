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
    const exists = await this.adminRepo.findOne(
        {where : {username : 'admin'} } ) ;

    if(!exists) {
        const admin = this.adminRepo.create({
            username : "admin",
            password : "admin123"
        });
        await this.adminRepo.save(admin);
    }
}
async createAdmin(data:Partial<Admin>){
    const exsit = await this.adminRepo.findOne({
        where : {username :data.username}
    });
    if (exsit){
        throw new BadRequestException ("Username already Exits")
    }
    const newAdmin = this.adminRepo.create(data);
    return this.adminRepo.save(newAdmin);
}

async login(username: string, password: string) {
  const admin = await this.adminRepo.findOne({
    where: { username }
  });

  if (!admin || admin.password !== password) {
    throw new BadRequestException("Invalid Credentials");
  }

  return {
    message: "Login Successfully",
    adminId: admin.id
  }
};
}