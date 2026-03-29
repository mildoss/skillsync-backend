import {Controller, Get, Body, Patch, Param, Query, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-user.dto';
import {EventPattern, Payload} from "@nestjs/microservices";
import {Role} from "../../generated/prisma/enums";
import {RolesGuard} from "../auth/guards/roles-guard";
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Listen to user registration from Gateway (Kafka Event)' })
  @EventPattern('topic-registration')
  async createUser(@Payload() message: { userId: number, email: string, username: string, role: Role }) {
    await this.usersService.createUser(message);
  }

  @Get()
  @ApiOperation({ summary: 'Get all applicants with advanced filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of applicants retrieved successfully.' })
  findAll(@Query() query: SearchUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile details retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Missing x-user-id header.' })
  findMe(@CurrentUser() userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  update(@CurrentUser() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}