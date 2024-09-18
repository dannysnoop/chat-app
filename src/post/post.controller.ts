import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IPostService } from './i.post.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse, ApiOperation,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";
import { COMMON_MESSAGE } from '../../helper/message';
import { PostEntity } from '../../entities/post.entity';
import {
  PostCreateRequest,
  PostRequest,
  PostUpdateRequest,
} from '../../DTO/post.dto';

@Controller('api/post')
@ApiTags('post')
@ApiBearerAuth()
export class PostController {
  constructor(
    @Inject('IPostService')
    private readonly IPostService: IPostService,
  ) {}

  @Get()
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOperation({ summary: 'get posts' })

  getAllPost(@Query() query: PostRequest) {
    return this.IPostService.getListPost(query);
  }

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @ApiOperation({ summary: 'create posts' })

  @ApiBody({ type: PostEntity })
  createPost(@Body() params: PostCreateRequest) {
    return this.IPostService.createPost(params);
  }

  @Put('/:id')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @ApiBody({ type: PostEntity })
  @ApiOperation({ summary: 'update posts' })

  updatePost(@Param('id') id: number, @Body() params: PostUpdateRequest) {
    return this.IPostService.updatePost(id, params);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'get detail posts' })
  getPostDetail(@Param('id') id: number) {
    return this.IPostService.getDetailPost(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'delete posts' })
  removePostDetail(@Param('id') id: number) {
    return this.IPostService.removePost(id);
  }
}
