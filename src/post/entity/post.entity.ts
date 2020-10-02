import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { SubSettingEntity } from '../../sub-setting/entity/sub-setting.entity';

@Entity()
export class PostEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  postName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int' })
  voteCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Timestamp

  @ManyToOne(() => SubSettingEntity, subSetting => subSetting.posts)
  subSetting: SubSettingEntity;

}
