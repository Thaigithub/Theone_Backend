export interface AuthUseCase {
    googleLogin(request:any):Promise<string>;
}

export const AuthUseCase = Symbol('AuthUseCase');
