import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  H,
  modPow,
  randomBigInt,
  N,
  g,
  bigIntToHex,
  bytesFromHex,
  toHex64,
} from '../../utils/srp_utils';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SrpAuthService {
  private http = inject(HttpClient);

  private BASE_URL = environment.API_BASE_URL;

  async logout() {
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${this.BASE_URL}/logout`, {}, { withCredentials: true })
      );

      if (res?.message === 'Successfully logged out') {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async login(emailRaw: string, password: string) {
    const email = emailRaw.trim().toLowerCase();

    try {
      // (1) CLIENT EPHEMERAL: generate a, A
      let a: bigint, A: bigint;
      do {
        a = randomBigInt(32);
        A = modPow(g, a, N);
      } while (A % N === 0n);
      const A_hex = bigIntToHex(A);

      console.log('[SRP] Step 1: Generated A_hex', A_hex);

      // (2) START REQUEST → server returns salt, B, session_id
      let start: any;
      try {
        start = await firstValueFrom(
          this.http.post(
            `${this.BASE_URL}/srp-login/start`,
            { email, A: A_hex },
            { withCredentials: true }
          )
        );
      } catch (err: any) {
        throw err;
      }

      const salt_hex: string = String(start.salt).toLowerCase();
      const B_hex: string = String(start.B).toLowerCase();
      const session_id: string = start.session_id;

      const s = BigInt('0x' + salt_hex);
      const B = BigInt('0x' + B_hex);
      if (B % N === 0n) throw new Error('Invalid server parameter B');

      // (3) and (4) compute k, u, x
      const k = BigInt('0x' + (await H(N, g)));
      const u = BigInt('0x' + (await H(A, B)));
      const innerHex = await H(`${email}:${password}`);
      const inner = BigInt('0x' + innerHex);
      const x = BigInt('0x' + (await H(s, inner)));

      // (5) Shared secret S
      const gx = modPow(g, x, N);
      let base = (B - ((k * gx) % N)) % N;
      if (base < 0n) base += N;
      const exp = a + u * x;
      const S = modPow(base, exp, N);
      const K = BigInt('0x' + (await H(S)));

      // (7) Client proof M1
      const M1_hex = toHex64(await H(email, bytesFromHex(salt_hex), A, B, K));

      // (8) VERIFY step
      let verify: any;
      try {
        verify = await firstValueFrom(
          this.http.post(
            `${this.BASE_URL}/srp-login/verify`,
            { email, M1: M1_hex, session_id },
            { withCredentials: true }
          )
        );
      } catch (err: any) {
        console.error('[SRP] Step 2: /srp-login/verify failed', err);
        if (err.status === 403) {
          throw new Error('Invalid email or password.');
        } else {
          throw new Error('Login failed: Unable to verify credentials.');
        }
      }

      // (9) Compare M2 for mutual authentication
      const M2_calc = toHex64(await H(A, BigInt('0x' + M1_hex), K));
      if (String(verify.M2).toLowerCase() !== M2_calc) {
        console.error('[SRP] Step 2: M2 mismatch', { expected: M2_calc, got: verify.M2 });
        throw new Error('Login failed: Server proof mismatch.');
      }

      console.log('[SRP] Login successful for', email);
      return true;
    } catch (err: any) {
      console.error('[SRP] Login error:', err);
      throw err;
    }
  }
}
