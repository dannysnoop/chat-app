import { PostCreateRequest, PostDto, PostRequest, PostUpdateRequest } from "../../DTO/post.dto";
import { PostEntity } from '../../entities/post.entity';
import { Response } from "../../DTO/response-base.dto";

export interface IPostService {
  createPost(params: PostCreateRequest): Promise<PostEntity>;
  updatePost(id: number, params: PostUpdateRequest): Promise<PostEntity>;
  getListPost(params: PostRequest): Promise<Response<PostDto>>;
  getDetailPost(id: number): Promise<PostEntity>;
  removePost(id: number): void;
}
