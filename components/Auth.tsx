

import React, { useState } from 'react';
import { User } from '../types';
import { EnvelopeIcon, LockClosedIcon, UserIcon, ArrowRightOnRectangleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { auth, googleProvider, db } from '../services/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthProps {
    onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const fetchUserData = async (email: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', email));
            if (userDoc.exists()) {
                const data = userDoc.data();
                const expiryDate = data.expiry_date;
                let isPremium = false;

                if (expiryDate) {
                    // Handle Firestore Timestamp or Date string
                    const expiry = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
                    isPremium = expiry > new Date();
                    return { expiryDate: expiry.toISOString(), isPremium };
                }
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
        return { isPremium: false };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const result = await signInWithEmailAndPassword(auth, email, password);
                const userEmail = result.user.email || '';
                const extraData = await fetchUserData(userEmail);
                
                onLogin({
                    uid: result.user.uid,
                    email: userEmail,
                    displayName: result.user.displayName || '',
                    ...extraData
                });
            } else {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(result.user, { displayName: name });
                const extraData = await fetchUserData(email);
                
                onLogin({
                    uid: result.user.uid,
                    email: email,
                    displayName: name,
                    ...extraData
                });
            }
        } catch (err: any) {
            console.error(err);
            setError('이메일 또는 비밀번호가 올바르지 않거나 이미 존재하는 계정입니다.');
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const userEmail = result.user.email || '';
            const extraData = await fetchUserData(userEmail);

            onLogin({
                uid: result.user.uid,
                email: userEmail,
                displayName: result.user.displayName || '',
                ...extraData
            });
        } catch (err: any) {
            console.error(err);
            setError('구글 로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md z-10 p-4">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg shadow-blue-500/20 mb-4">
                        <SparklesIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">EasyFlyer AI</h1>
                    <p className="text-slate-400 mt-2">부동산 마케팅의 새로운 표준</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="flex border-b border-slate-700">
                        <button 
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 text-sm font-semibold transition-all ${isLogin ? 'text-white border-b-2 border-blue-500 bg-slate-700/30' : 'text-slate-400 hover:text-slate-300'}`}
                        >
                            로그인
                        </button>
                        <button 
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 text-sm font-semibold transition-all ${!isLogin ? 'text-white border-b-2 border-blue-500 bg-slate-700/30' : 'text-slate-400 hover:text-slate-300'}`}
                        >
                            회원가입
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
                                {error}
                            </div>
                        )}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">이름</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        placeholder="홍길동"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">이메일</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <EnvelopeIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">비밀번호</label>
                                {isLogin && <button type="button" className="text-xs text-blue-400 hover:text-blue-300">비밀번호 찾기</button>}
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {isLogin ? (
                                <>
                                    로그인 <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                </>
                            ) : '계정 만들기'}
                        </button>
                    </form>

                    <div className="px-8 pb-8 pt-2">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-slate-800 text-slate-500 uppercase">또는</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleGoogleLogin}
                            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.72L20.3 3.48C18.1 1.32 15.23 0 12 0 7.31 0 3.26 2.69 1.25 6.63l3.96 3.07C6.15 7.18 8.83 5.04 12 5.04z" />
                                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.89 3c2.28-2.1 3.53-5.2 3.53-8.82z" />
                                <path fill="#FBBC05" d="M5.21 14.3C4.9 13.4 4.75 12.44 4.75 11.5s.15-1.9.46-2.8L1.25 6.63C.45 8.1 0 9.75 0 11.5s.45 3.4 1.25 4.87l3.96-3.07z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3c-1.11.75-2.53 1.19-4.04 1.19-3.17 0-5.85-2.14-6.79-5.04l-3.96 3.07C3.26 21.31 7.31 24 12 24z" />
                            </svg>
                            Google로 계속하기
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    {isLogin ? (
                        <>계정이 없으신가요? <button onClick={() => setIsLogin(false)} className="text-blue-400 font-semibold hover:underline">회원가입하기</button></>
                    ) : (
                        <>이미 계정이 있으신가요? <button onClick={() => setIsLogin(true)} className="text-blue-400 font-semibold hover:underline">로그인하기</button></>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Auth;
