import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema, resetPasswordSchema } from './authSchemas';

describe('auth schemas', () => {
  it('rejects weak passwords for registration', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'weakpass',
      displayName: 'Jane Doe',
      confirmPassword: 'weakpass',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('8-15 caracteres');
    }
  });

  it('accepts a compliant password', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'Abcdef1!',
      displayName: 'Jane Doe',
      confirmPassword: 'Abcdef1!',
    });

    expect(result.success).toBe(true);
  });

  it('rejects mismatched password confirmation for reset flow', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'Abcdef1!',
      confirmPassword: 'Different1!',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('senhas');
    }
  });

  it('rejects empty login credentials', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: '',
    });

    expect(result.success).toBe(false);
  });
});
