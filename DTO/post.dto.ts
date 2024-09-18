import { PostEntity } from '../entities/post.entity';

export class PostDto {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PostRequest {
  take = 0;
  page = 0;
  title = '';
}

export class PostCreateRequest extends PostEntity {}

export class PostUpdateRequest extends PostEntity {}
