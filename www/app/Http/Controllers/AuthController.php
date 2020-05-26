<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\LoginActivity;
use Exception;
use \Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        // Implement the middleware. Restrict all pages that are not login or register
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        $loginRecord = new LoginActivity();
        $loginRecord->userEmail = request('email');

        if (! $token = auth()->attempt($credentials)) {

            $loginRecord->successfulLogin = false;
            // $loginRecord->ip = request("ip"); //nginx config would need an update
            $loginRecord->save();

            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $loginRecord->userId = auth()->id();
        $loginRecord->successfulLogin = true;
        // $loginRecord->ip = request("ip"); // nginx config would need an update
        $loginRecord->save();

        return $this->respondWithToken($token);
    }

    /** 
     * Create  new user. Allow anyone to register as a user 
     * 
     * @return \Illuminate\Http\JsonResponse
     * 
     */
    public function register(Request $request)
    {
      if (!$request->name){
        return response()->json(['error' => '"name" is required'], 401);
        }
        if (!$request->email){
            return response()->json(['error' => '"email" is required'], 401);
        }
        if (!$request->password || !$request->confirmPassword || $request->password !== $request->confirmPassword){
            return response()->json(['error' => 'Password is missing or they do not match'], 401);
        }
        try{
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);
        } catch(Exception $e){
            return response()->json(['error' => 'Error occured while trying to create a new user. Make sure you do not have an account already.'], 500);
        }

        if($user){
            $token = auth()->login($user);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}