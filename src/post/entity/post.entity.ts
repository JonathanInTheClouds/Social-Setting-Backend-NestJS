import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { SubSettingEntity } from '../../sub-setting/entity/sub-setting.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class PostEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  postName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int' , default: 0})
  voteCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Timestamp;

  @ManyToOne(() => SubSettingEntity, subSetting => subSetting.posts, {
      eager: true,
      cascade: true
  })
  subSetting: SubSettingEntity;

  @ManyToOne(() => UserEntity, {
    eager: true
  })
  user: UserEntity;

}
