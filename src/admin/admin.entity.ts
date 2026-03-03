import { Entity , PrimaryGeneratedColumn , Column } from "typeorm/browser";


@Entity()
export class Admin{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique:true})
    username : string ;

    @Column()
    password : string ;
    
}