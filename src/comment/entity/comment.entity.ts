import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { PostEntity } from '../../post/entity/post.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class CommentEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  text: string;

  @ManyToOne(() => PostEntity, {
    lazy: true
  })
  posts: PostEntity;

  @ManyToOne(() => UserEntity, {
    lazy: true
  })
  user: UserEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Timestamp;

}
