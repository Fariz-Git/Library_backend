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

async login (username :string , password: string){
    const admin = await this.adminRepo.findOne ({
        where : {username : 'admin'}
    })
 if (!username || admin.password !==password ){
    throw new BadRequestException ("Invalid Cred");
 }
 return ("Login Sucessfully");
}

async updateAdmin(id: number, data: Partial<Admin>) {
  const admin = await this.adminRepo.findOne({ where: { id } });

  if (!admin) {
    throw new NotFoundException('Admin not found');
  }

  if (data.username) {
    admin.username = data.username;
  }

  if (data.password) {
    admin.password = data.password; // later we hash it
  }

  return this.adminRepo.save(admin);
}
  
}