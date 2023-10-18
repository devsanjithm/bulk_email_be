import { Test, TestingModule } from '@nestjs/testing';
import { SpawnThreadService } from './spawn-thread.service';

describe('SpawnThreadService', () => {
  let service: SpawnThreadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpawnThreadService],
    }).compile();

    service = module.get<SpawnThreadService>(SpawnThreadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
