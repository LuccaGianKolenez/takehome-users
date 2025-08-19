import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service'
describe('UsersService', () => {
  let service: UsersService;
  const prismaMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
  } as any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    service = module.get(UsersService);
  });

  it('create', async () => {
    prismaMock.user.create.mockResolvedValue({ id:'1', name:'a', email:'a@a' });
    await expect(service.create({ name:'a', email:'a@a' })).resolves.toMatchObject({ email:'a@a' });
  });
});
