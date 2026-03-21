import { Controller, Get } from '@nestjs/common';
import { DictionariesService } from './dictionaries.service';

@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @Get('categories')
  getCategories() {
    return this.dictionariesService.getCategories();
  }

  @Get('skills')
  getSkills() {
    return this.dictionariesService.getSkills();
  }

  @Get('languages')
  getLanguages() {
    return this.dictionariesService.getLanguages();
  }
}