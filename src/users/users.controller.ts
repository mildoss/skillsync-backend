import {Controller, Get, Body, Patch, Param, Query, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-user.dto';
import {EventPattern, Payload} from "@nestjs/microservices";
import {Role} from "../../generated/prisma/enums";
import {RolesGuard} from "../auth/guards/roles-guard";
import {CurrentUser} from "../auth/decorators/current-user.decorator";

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @EventPattern('topic-registration')
  async createUser(@Payload() message: { userId: number, email: string, username: string, role: Role }) {
    await this.usersService.createUser(message);
  }

  @Get()
  findAll(@Query() query: SearchUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get('me')
  findMe(@CurrentUser() userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  update(@CurrentUser() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
