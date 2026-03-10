import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: SearchUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get('me')
  findMe(@Query('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  update(
    @Query('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
