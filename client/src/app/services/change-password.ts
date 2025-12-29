import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { bigIntToHex, g, H, modPow, N } from '../utils/srp_utils';
import { SrpAuthService } from '../pages/login-page/srp-auth';

@Injectable({ providedIn: 'root' })
export class ChangePassword {
  private http = inject(HttpClient);
  private login = inject(SrpAuthService);

  private BASE_URL = environment.API_BASE_URL;

  async changePassword(email: string, oldPassword: string, newPassword: string) {
    try {
      // Step 1: verify old password using SRP login
      await this.login.login(email, oldPassword);

      // Step 2: generate new salt + verifier
      const newSaltBytes = crypto.getRandomValues(new Uint8Array(32));
      const newSaltHex = Array.from(newSaltBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      const innerNewHex = await H(`${email}:${newPassword}`);
      const innerNew = BigInt('0x' + innerNewHex);
      const xNew = BigInt('0x' + (await H(BigInt('0x' + newSaltHex), innerNew)));
      const vNew = modPow(g, xNew, N);
      const newVerifierHex = bigIntToHex(vNew);

      // Step 3: commit new verifier (requires auth cookies)
      const result: any = await firstValueFrom(
        this.http.post(
          `${this.BASE_URL}/srp-password-change/commit`,
          { new_salt: newSaltHex, new_verifier: newVerifierHex },
          { withCredentials: true }
        )
      );
      return true;
    } catch (err: any) {
      // If login failed because old password is wrong
      if (err?.status === 403 || err?.message === 'Invalid email or password.') {
        throw new Error('Old password is wrong.');
      }

      // Other errors (commit failure, network, etc.)
      throw new Error(err?.error?.error || err?.message || 'Password change failed.');
    }
  }
}
