import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UserSearchDocument } from '../models/user-search.document';

@Injectable()
export class UserSearchMapper {

  toDocument(user: User): UserSearchDocument {

    return {

      id: user.id,

      username: user.username,

      email: user.email,

      firstName: user.firstName,

      lastName: user.lastName,

      isActive: user.isActive,

      createdAt: user.createdAt,

    };

  }

}
