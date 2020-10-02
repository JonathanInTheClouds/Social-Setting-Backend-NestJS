import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from '../../post/entity/post.entity';

@Entity()
export class SubSettingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @OneToMany(() => PostEntity, post => post.subSetting)
  posts: PostEntity[];

}
