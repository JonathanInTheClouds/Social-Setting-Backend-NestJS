import { Test, TestingModule } from '@nestjs/testing';
import { SubSettingService } from './sub-setting.service';

describe('SubSettingService', () => {
  let service: SubSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubSettingService],
    }).compile();

    service = module.get<SubSettingService>(SubSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
