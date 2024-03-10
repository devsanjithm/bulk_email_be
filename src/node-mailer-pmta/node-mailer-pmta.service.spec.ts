import { Test, TestingModule } from '@nestjs/testing';
import { NodeMailerPmtaService } from './node-mailer-pmta.service';

describe('NodeMailerPmtaService', () => {
  let service: NodeMailerPmtaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodeMailerPmtaService],
    }).compile();

    service = module.get<NodeMailerPmtaService>(NodeMailerPmtaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
