import { Injectable } from '@nestjs/common';
import { IPostService } from './i.post.service';
import { PostEntity } from 'entities/post.entity';
import {
  PostCreateRequest,
  PostDto,
  PostRequest,
  PostUpdateRequest,
} from '../../DTO/post.dto';
import { PostRepository } from './post.repository';
import { plainToInstance } from 'class-transformer';
import { ILike } from 'typeorm';
import { Response } from '../../DTO/response-base.dto';

@Injectable()
export class PostService implements IPostService {
  constructor(private readonly repository: PostRepository) {}

  removePost(id: number): void {
    this.repository.delete(id);
  }
  async createPost(params: PostCreateRequest): Promise<PostEntity> {
    const data = plainToInstance(PostEntity, params);
    return this.repository.save(data);
  }
  async updatePost(id: number, params: PostUpdateRequest): Promise<PostEntity> {
    const data = await this.repository.findOneByOrFail({ id });
    const dataSave = plainToInstance(PostEntity, { ...data, ...params });
    return this.repository.save(dataSave);
  }
  async getListPost(params: PostRequest): Promise<Response<PostDto>> {
    const { title, page = 1, take = 10 } = params;
    const skip = (page - 1) * take || 0;

    const [data, total] = await this.repository.findAndCount({
      where: { title: ILike(`%${title}%`) },
      take,
      skip,
    });
    const postDtos = data.map(mapPostEntityToDto);
    return new Response<PostDto>(postDtos, page, take, total);
  }
  async getDetailPost(id: number): Promise<PostEntity> {
    const data = await this.repository.findOneByOrFail({ id });
    return data;
  }
}

const mapPostEntityToDto = (post: PostEntity): PostDto => {
  const { title, createdAt, updatedAt, id } = post;
  return {
    title,
    createdAt,
    updatedAt,
    id,
  };
};
