import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class SecureCodeEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: number;

  @OneToOne(() => UserEntity, {
    eager: true,
    cascade: true
  })
  @JoinColumn()
  user: UserEntity;

  // @Column({type: 'timestamp'})
  // expiryDate: Date;
}
