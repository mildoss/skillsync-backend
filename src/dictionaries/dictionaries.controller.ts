import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DictionariesService } from './dictionaries.service';

@ApiTags('Dictionaries')
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get a list of all job categories' })
  @ApiResponse({ status: 200, description: 'List of categories retrieved successfully.' })
  getCategories() {
    return this.dictionariesService.getCategories();
  }

  @Get('skills')
  @ApiOperation({ summary: 'Get a list of all skills' })
  @ApiResponse({ status: 200, description: 'List of skills retrieved successfully.' })
  getSkills() {
    return this.dictionariesService.getSkills();
  }

  @Get('languages')
  @ApiOperation({ summary: 'Get a list of all languages' })
  @ApiResponse({ status: 200, description: 'List of languages retrieved successfully.' })
  getLanguages() {
    return this.dictionariesService.getLanguages();
  }
}