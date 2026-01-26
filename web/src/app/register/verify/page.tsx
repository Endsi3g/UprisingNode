"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
    const router = useRouter();
    const [otp, setOtp] = useState(["4", "2", "", "", "", ""]);

    // Auto-focus logic simulation usually goes here
    const handleChange = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input would be handled here
    };

    const handleVerify = () => {
        router.push("/register/security");
    };

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-text-main overflow-x-hidden antialiased selection:bg-gray-100 selection:text-black">
            <header className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
                <div className="px-6 md:px-12 py-6 flex items-center justify-between max-w-5xl mx-auto">
                    <Link href="/" className="flex items-center gap-4 text-black decoration-0 cursor-pointer">
                        <div className="text-black opacity-80">
                            <span className="material-symbols-outlined text-2xl font-light">hub</span>
                        </div>
                        <h2 className="text-base font-medium tracking-wide font-serif text-black italic">Uprising Node</h2>
                    </Link>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/80"></div>
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">En ligne</span>
                        </div>
                        <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-[9px] font-semibold uppercase text-gray-400 tracking-widest mb-0.5">Opérateur</p>
                                <p className="text-sm font-medium leading-none text-black font-serif">K. Miller</p>
                            </div>
                            <div className="bg-center bg-no-repeat bg-cover grayscale opacity-90 size-8 rounded-full border border-gray-100 ring-2 ring-white" data-alt="User profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMflAqpGYir9XOgJftZNEspNP4YhL4rOPhdqw0jK_aScxv1hEB3L_lzTmM9Yhh7p9Bx-zR8FPI8BGHUHUllrAJDb-KhtUBsqU-ow4gz1n2Xk6fA8mW9g47-WRYmuNS0QAW_9o-jagO5g5z8bKdLzEnz2LlxLpmlbixX3D_b0WsSTorkGrwc3J7RGALpmKOBVUrUK7iA48qG0b4tWxQnQOXK_S9JVfjK6tVa4xwe4PR4q82uVCiUq2Ob5fW4_0YZ9Smp0LT32pSxHGh")' }}></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-lg mx-auto px-6 py-12 md:py-24 flex flex-col items-center justify-center gap-16 min-h-[60vh]">
                <div className="text-center space-y-6 max-w-md mx-auto">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-black border border-gray-100">
                        <span className="material-symbols-outlined font-light text-xl">mark_email_read</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-normal text-black tracking-tight">
                        Vérifiez votre Identité
                    </h1>
                    <p className="text-gray-500 font-sans text-xs md:text-sm font-light leading-relaxed">
                        Un code de sécurité a été envoyé à votre adresse email.
                    </p>
                </div>

                <div className="w-full max-w-sm mx-auto">
                    <form className="flex flex-col gap-12" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
                        <div className="flex items-center justify-center gap-3 md:gap-4 w-full">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    className={`otp-input w-10 h-14 md:w-12 md:h-16 text-center text-3xl font-serif border-x-0 border-t-0 border-b focus:ring-0 bg-transparent text-black placeholder-gray-100 transition-all duration-200 p-0 rounded-none caret-black ${digit ? 'border-black border-b-2' : 'border-gray-200'}`}
                                    inputMode="numeric"
                                    autoFocus={idx === 2} // Simulating focus on the 3rd input as seen in mockup structure potentially, or generally 1st
                                />
                            ))}
                        </div>

                        <div className="space-y-8 text-center pt-4">
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-5 px-6 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md group flex items-center justify-center gap-3"
                            >
                                <span>Valider le code</span>
                                <span className="material-symbols-outlined text-lg font-light group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                            </button>
                            <div>
                                <a href="#" className="inline-flex items-center gap-2 text-[11px] font-medium text-black hover:text-gray-500 transition-colors border-b border-transparent hover:border-gray-200 pb-0.5">
                                    <span className="material-symbols-outlined text-sm">refresh</span>
                                    Renvoyer le code (59s)
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <style jsx global>{`
                .otp-input:focus {
                    box-shadow: none;
                    outline: none;
                    border-bottom-width: 2px;
                    border-bottom-color: #000;
                }
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                    -webkit-appearance: none; 
                    margin: 0; 
                }
            `}</style>
        </div>
    );
}
