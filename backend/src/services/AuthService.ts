import { UserRepository } from '../repositories/UserRepository';
import { SignUpDto, LoginDto } from '../dtos/auth.dto';
import { hashPassword, verifyPassword } from '../utils/crypto';

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: SignUpDto) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email is already in use');
    }

    const hashed = hashPassword(data.password);
    return this.userRepository.create({
      email: data.email,
      passwordHash: hashed,
      role: data.role,
      name: data.name,
      location: data.location,
      contactNumber: data.contactNumber,
      bloodType: data.bloodType,
      dateOfBirth: data.dateOfBirth,
    });
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.role !== data.role) {
      throw new Error('Unauthorized role login access');
    }

    const isValid = verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async getProfile(id: string) {
    return this.userRepository.findById(id);
  }
}
