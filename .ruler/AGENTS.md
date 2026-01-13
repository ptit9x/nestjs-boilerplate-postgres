# AGENTS.md

This document outlines the coding standards and conventions for the NestJS Boilerplate Postgres project. These conventions ensure consistency, maintainability, and readability across the codebase.

## Table of Contents

1. [General Guidelines](#general-guidelines)
2. [File and Directory Naming](#file-and-directory-naming)
3. [TypeScript Conventions](#typescript-conventions)
4. [NestJS Specific Conventions](#nestjs-specific-conventions)
5. [Database Conventions](#database-conventions)
6. [API Documentation](#api-documentation)
7. [Error Handling](#error-handling)
8. [Testing Conventions](#testing-conventions)
9. [Import/Export Conventions](#importexport-conventions)
10. [Code Organization](#code-organization)

## General Guidelines

### Code Style
- Use **2 spaces** for indentation (configured in ESLint)
- Use **single quotes** for strings
- Use **semicolons** at the end of statements
- Maximum line length: **120 characters**
- Use **trailing commas** in multi-line arrays and objects

### Naming Conventions
- **PascalCase**: Classes, interfaces, enums, decorators
- **camelCase**: Variables, functions, methods, properties
- **UPPER_SNAKE_CASE**: Constants
- **kebab-case**: File names and URLs
- **snake_case**: Database columns and table names

### Comments
- Use JSDoc comments for public methods and classes
- Keep comments concise and meaningful
- Avoid obvious comments that don't add value
- Use TODO comments for temporary code

## File and Directory Naming

### Directory Structure
```
src/
├── api/                    # API modules (controllers, services, DTOs)
│   ├── auth/              # Authentication module
│   ├── user/              # User management module
│   └── [module-name]/     # Feature modules
├── configs/               # Configuration files
├── share/                 # Shared utilities and common code
│   ├── common/           # Common interfaces and constants
│   ├── database/         # Base entities and services
│   ├── decorator/        # Custom decorators
│   ├── filter/           # Exception filters
│   ├── interceptors/     # Custom interceptors
│   ├── middlewares/      # Custom middlewares
│   └── utils/            # Utility functions
└── main.ts               # Application entry point
```

### File Naming
- **Controllers**: `[name].controller.ts`
- **Services**: `[name].service.ts`
- **Entities**: `[name].entity.ts`
- **DTOs**: `[name].dto.ts` or `[action]-[name].dto.ts`
- **Interfaces**: `[name].interface.ts`
- **Constants**: `[name].constant.ts`
- **Guards**: `[name].guard.ts`
- **Decorators**: `[name].decorator.ts`
- **Tests**: `[name].spec.ts` or `[name]-e2e-spec.ts`

## TypeScript Conventions

### Type Definitions
```typescript
// Prefer interfaces for object shapes
interface IUserPayload {
  id: string;
  name: string;
  email: string;
}

// Use types for unions and computed types
type UserStatus = 'active' | 'inactive' | 'blocked';

// Use enums for constants
enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  BLOCKED = 3,
}
```

### Class Definitions
```typescript
// Use explicit access modifiers
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  // Public methods first, then private
  public async getByEmail(email: string): Promise<UserEntity> {
    // Implementation
  }

  private validateUser(user: UserEntity): boolean {
    // Implementation
  }
}
```

### Generic Types
```typescript
// Use generic constraints when appropriate
interface IBaseService<T extends BaseEntity> {
  findById(id: string): Promise<T>;
  create(data: Partial<T>): Promise<T>;
}
```

## NestJS Specific Conventions

### Controllers
```typescript
@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'users',
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse(USER_SWAGGER_RESPONSE.GET_SUCCESS)
  @Get('info')
  @HttpCode(HttpStatus.OK)
  public getByEmail(@GetUser('email') email: string): Promise<UserEntity> {
    return this.userService.getByEmail(email);
  }
}
```

### Services
```typescript
@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  // Use async/await consistently
  public async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role.permissions'],
    });
    
    if (!user) {
      throw new NotFoundException(ERROR_USER.USER_NOT_FOUND.MESSAGE);
    }
    
    return user;
  }
}
```

### Modules
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## Database Conventions

### Entities
```typescript
@Entity({ name: USER_CONST.MODEL_NAME })
export class UserEntity extends BaseEntity {
  @Column({ length: 255, unique: true })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 200 })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: number;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: RoleEntity;
}
```

### Base Entity
```typescript
export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  @Exclude()
  deletedAt: Date;
}
```

### Migrations
- Use descriptive names: `YYYYMMDDHHMMSS-DescriptionOfChange.ts`
- Include both up and down migrations
- Use proper TypeScript types
- Add comments for complex migrations

## API Documentation

### DTOs
```typescript
export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '1234567890',
  })
  @IsOptional()
  @IsNumberString()
  @MinLength(8)
  @MaxLength(15)
  phone?: string;
}
```

### Swagger Responses
```typescript
export const USER_SWAGGER_RESPONSE = {
  GET_LIST_SUCCESS: swaggerSchemaExample(
    {
      data: [MOCK_USER],
      total: 1,
      page: 1,
      pageSize: 20,
      totalPage: 1,
    },
    'List users successfully',
  ),
  CREATE_SUCCESS: swaggerSchemaExample(MOCK_USER, 'User created successfully'),
  UPDATE_SUCCESS: swaggerSchemaExample('', 'User updated successfully'),
  GET_SUCCESS: swaggerSchemaExample(MOCK_USER_WITH_ROLE, 'User retrieved successfully'),
};
```

## Error Handling

### Error Constants
```typescript
export const ERROR_USER = {
  USER_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'This email does not exist in our records',
  },
  PASSWORD_INCORRECT: {
    CODE: 'us00002',
    MESSAGE: 'That's an incorrect password. Please try again.',
  },
  USER_INACTIVE: {
    CODE: 'us00003',
    MESSAGE: 'This account has been deactivated. Please contact the organization admin to reactivate your account.',
  },
};
```

### Exception Throwing
```typescript
// Use specific HTTP exceptions
throw new NotFoundException(ERROR_USER.USER_NOT_FOUND.MESSAGE);
throw new BadRequestException({
  message: ERROR_USER.USER_WRONG_OLD_PASSWORD.MESSAGE,
  code: ERROR_USER.USER_WRONG_OLD_PASSWORD.CODE,
});
```

## Testing Conventions

### Unit Tests
```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  describe('getByEmail', () => {
    it('should return user when email exists', async () => {
      // Test implementation
    });

    it('should throw NotFoundException when email does not exist', async () => {
      // Test implementation
    });
  });
});
```

### E2E Tests
```typescript
describe('UserController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Import/Export Conventions

### Import Order
1. Node.js built-in modules
2. Third-party libraries
3. Internal modules (absolute imports)
4. Relative imports

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { BaseService } from '../../share/database/base.service';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
```

### Export Patterns
```typescript
// Named exports for utilities and constants
export const USER_CONST = { MODEL_NAME: 'user' };
export enum UserStatus { ACTIVE = 1 }

// Default export for main classes
export default class UserService extends BaseService<UserEntity> {}

// Re-export for convenience
export * from './user.interface';
export * from './user.constant';
```

## Code Organization

### Constants
```typescript
// Group related constants
export const USER_CONST = {
  MODEL_NAME: 'user',
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
};

export const ERROR_USER = {
  USER_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'User not found',
  },
};
```

### Interfaces
```typescript
// Use descriptive names with 'I' prefix
export interface IUserPayload {
  id: string;
  name: string;
  email: string;
  role?: IRolePayload;
}

export interface IPaginateParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
```

### Utilities
```typescript
// Keep utilities pure and focused
export class StringUtil {
  public static mysqlRealEscapeString(str: string): string {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case '\0': return '\\0';
        case '\x08': return '\\b';
        case '\x09': return '\\t';
        case '\x1a': return '\\z';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '"':
        case "'":
        case '\\':
        case '%': return '\\' + char;
        default: return char;
      }
    });
  }
}
```

## Security Conventions

### Password Handling
```typescript
// Always hash passwords
const passwordHash = await bcrypt.hash(password, JWT_CONFIG.SALT_ROUNDS);

// Use strong salt rounds (minimum 10)
const JWT_CONFIG = {
  SALT_ROUNDS: 10,
  SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: '1h',
};
```

### Input Validation
```typescript
// Always validate input with class-validator
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;
}
```

## Performance Conventions

### Database Queries
```typescript
// Use select for specific fields when possible
const user = await this.userRepository.findOne({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true,
    // Exclude password and sensitive fields
  },
});

// Use relations sparingly and only when needed
const userWithRole = await this.userRepository.findOne({
  where: { id },
  relations: ['role'], // Only include when necessary
});
```

### Caching
```typescript
// Use caching for expensive operations
@Cacheable('user', 300) // Cache for 5 minutes
public async getByEmail(email: string): Promise<UserEntity> {
  // Implementation
}
```

## Best Practices

1. **Always extend BaseEntity** for database entities
2. **Use BaseService** for common CRUD operations
3. **Validate all inputs** with DTOs and class-validator
4. **Handle errors consistently** with proper HTTP status codes
5. **Use dependency injection** instead of direct instantiation
6. **Keep services focused** on business logic
7. **Use guards and interceptors** for cross-cutting concerns
8. **Document APIs** with Swagger decorators
9. **Write tests** for all public methods
10. **Use constants** instead of magic numbers/strings

## Tools and Scripts

### Available Scripts
- `npm run build` - Build the application
- `npm run start:dev` - Start in development mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run typeorm:run-migrations` - Run database migrations

### Pre-commit Hooks
Always run linting and formatting before committing:
```bash
npm run lint
npm run format
```

---

This document should be updated as the project evolves and new patterns emerge. All team members should follow these conventions to maintain code consistency and quality.
