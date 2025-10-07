import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheService } from '../cache/cache.service';
import { Cacheable } from '../cache/cache.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(
        @Inject('SOME_SERVICE') private clientSome: ClientProxy,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly cacheService: CacheService,
    ) { }

    async sampleMicroserviceCall() {
        const pattern = {
            svc: 'some',
            cmd: 'some_command'
        };
        const payload = { data: 'sample_data' };
        const datafromSome = await lastValueFrom(this.clientSome.send(pattern, payload));
        return datafromSome;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(user);

        await this.cacheService.del('users:all');

        return savedUser;
    }

    @Cacheable({ key: 'users:all', ttl: 300 }) // 300 / 60 = 5 minutes นะจ๊ะ
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        this.cacheService.set(`user:${id}`, user, 600);
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        Object.assign(user, updateUserDto);
        const updatedUser = await this.userRepository.save(user);

        await this.cacheService.del(`user:${id}`);
        await this.cacheService.del('users:all');

        return updatedUser;
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);

        await this.cacheService.del(`user:${id}`);
        await this.cacheService.del('users:all');
    }
}