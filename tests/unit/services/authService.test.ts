// tests/unit/services/authService.test.ts
import { AuthService } from '../../../src/services/authService';
import { User } from '../../../src/models/User';
import { OAuth2Client } from 'google-auth-library';

jest.mock('../../../src/models/User');
jest.mock('google-auth-library');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  describe('authenticateWithGoogle', () => {
    it('should authenticate user with valid Google token', async () => {
      const mockPayload = {
        email: 'test@example.com',
        sub: 'google-id',
      };

      const mockUser = {
        _id: 'user-id',
        email: mockPayload.email,
        googleId: mockPayload.sub,
      } ;

      (OAuth2Client.prototype.verifyIdToken as jest.Mock).mockResolvedValue({
        getPayload: () => mockPayload,
      });

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.authenticateWithGoogle('valid-token');

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(User.findOne).toHaveBeenCalledWith({ email: mockPayload.email });
    });

    it('should create new user if not exists', async () => {
      const mockPayload = {
        email: 'new@example.com',
        sub: 'new-google-id',
      };

      const mockUser = {
        _id: 'new-user-id',
        email: mockPayload.email,
        googleId: mockPayload.sub,
      };

      (OAuth2Client.prototype.verifyIdToken as jest.Mock).mockResolvedValue({
        getPayload: () => mockPayload,
      });

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.authenticateWithGoogle('valid-token');

      expect(result.user).toBeDefined();
      expect(User.create).toHaveBeenCalled();
    });
  });
});