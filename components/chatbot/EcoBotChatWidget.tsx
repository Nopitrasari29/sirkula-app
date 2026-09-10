'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Minimize2,
  Maximize2,
  ExternalLink,
  Sprout,
  ArrowRight,
  Bot,
  Flame,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  quickReplies?: string[];
  actionLink?: {
    label: string;
    href: string;
  };
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: 'Halo! Saya EcoBot 🌿 Asisten pintar SIRKULA.\nAda yang bisa dibantu seputar cara pilah sampah kos, harga daur ulang per kg, atau penjemputan armada?',
    time: 'Baru saja',
    quickReplies: [
      '🏷️ Cek harga sampah hari ini',
      '☕ Cup kopi plastik bisa disetor?',
      '🛵 Bisa jemput ke gang kos?',
      '🪙 Cara tukar poin ke E-Wallet',
      '📍 Drop-Box 24 Jam terdekat',
    ],
  },
];

// EcoBot Knowledge Base Matcher
function getBotResponse(userText: string): {
  text: string;
  actionLink?: { label: string; href: string };
  quickReplies?: string[];
} {
  const query = userText.toLowerCase().trim();

  // 1. Harga / Nilai Tukar Sampah
  if (
    query.includes('harga') ||
    query.includes('rupiah') ||
    query.includes('per kg') ||
    query.includes('nilai') ||
    query.includes('taksir')
  ) {
    return {
      text: 'Estimasi nilai setoran di Mitra Bank Sampah SIRKULA saat ini:\n\n• 🧴 Botol Plastik Bersih (PET): Rp 3.500 – Rp 4.500 / kg\n• 📦 Kardus & Box Paket: Rp 2.200 – Rp 2.800 / kg\n• 🥫 Kaleng Minuman Logam: Rp 12.000 – Rp 14.000 / kg\n• 📄 Kertas HVS / Buku Bekas: Rp 2.000 – Rp 2.500 / kg\n• 🔌 Limbah Elektronik (Kabel/Baterai): Rp 8.000 – Rp 15.000 / kg\n\n💡 Tips: Cuci bersih dan pipihkan sampah sebelum disetor agar nilai timbangannya maksimal!',
      actionLink: { label: 'Buka AI Scanner untuk Taksir Sampah', href: '/scanner' },
      quickReplies: ['🛵 Jadwal jemput hari apa?', '🪙 Poin yang didapat berapa?'],
    };
  }

  // 2. Gelas Plastik / Cup Kopi
  if (
    query.includes('kopi') ||
    query.includes('cup') ||
    query.includes('mika') ||
    query.includes('sedotan') ||
    query.includes('plastik')
  ) {
    return {
      text: 'Cup kopi kekinian (bahan PP/PET) BISA didaur ulang! Caranya mudah:\n\n1. Buang sisa cairan/es batu dan sedotan.\n2. Bilas sebentar dengan air agar tidak berbau.\n3. Lepaskan segel seal plastik penutup.\n4. Tumpuk ringkas di tempat pilah kosmu.\n\n✨ Setiap 10 cup kopi setara ~250 gram plastik dan bernilai 50 Poin Hijau!',
      actionLink: { label: 'Scan Sampahmu via AI', href: '/scanner' },
      quickReplies: ['📍 Lokasi Drop-Box 24 Jam', '📦 Harga kardus hari ini?'],
    };
  }

  // 3. Kardus Paket E-Commerce
  if (
    query.includes('kardus') ||
    query.includes('paket') ||
    query.includes('karton') ||
    query.includes('box') ||
    query.includes('bubble')
  ) {
    return {
      text: 'Kardus paket belanja online anak kos adalah komoditas daur ulang paling diminati!\n\nLangkah penanganan:\n1. Lepaskan selotip / lakban plastik.\n2. Pipihkan kardus agar hemat tempat di kamar kos.\n3. Bubble wrap bening pisahkan ke kategori plastik lentur.\n\nKardus bisa langsung disetor ke Smart Drop-Box 24 Jam atau dipesan jemput langsung ke depan kos.',
      actionLink: { label: 'Lihat Titik Drop-Box Terdekat', href: '/lokasi' },
      quickReplies: ['🛵 Cara pesan penjemputan', '🏷️ Cek harga sampah'],
    };
  }

  // 4. Penjemputan / Gang Kos / Armada
  if (
    query.includes('jemput') ||
    query.includes('gang') ||
    query.includes('armada') ||
    query.includes('booking') ||
    query.includes('motor')
  ) {
    return {
      text: 'Bisa banget! SIRKULA menggunakan armada Motor Listrik Roda Tiga yang ramah lingkungan dan sanggup masuk ke gang-gang sempit kos (seperti Keputih, Gebang, Mulyorejo, dan Semolowaru).\n\nKetentuan penjemputan:\n• Minimal estimasi 3 kg (bisa kumpulkan bareng teman kos!).\n• Bebas tentukan hari & slot jam penjemputan sesuai jadwal luang kuliahmu.',
      actionLink: { label: 'Jadwalkan Penjemputan Sekarang', href: '/booking' },
      quickReplies: ['🪙 Berapa saldo poin yang didapat?', '📍 Peta bank sampah mitra'],
    };
  }

  // 5. Poin / Saldo / Penukaran
  if (
    query.includes('poin') ||
    query.includes('tukar') ||
    query.includes('saldo') ||
    query.includes('e-wallet') ||
    query.includes('gopay') ||
    query.includes('dana') ||
    query.includes('shopee')
  ) {
    return {
      text: 'Poin Hijau SIRKULA dapat kamu konversi menjadi reward nyata anak kos:\n\n• Saldo E-Wallet (GoPay, OVO, DANA, ShopeePay)\n• Token Listrik PLN Kos & Paket Data Internet\n• Voucher Diskon Kantin Kampus & Refill Station\n\n1 Poin Hijau bernilai setara Rp 100 saldo tunai/voucher.',
      actionLink: { label: 'Cek Poin & Badge di Jejak Hijau', href: '/jejak-hijau' },
      quickReplies: ['🏷️ Cek harga daur ulang', '🛵 Buat jadwal jemput'],
    };
  }

  // 6. Lokasi / Drop-Box / Peta
  if (
    query.includes('lokasi') ||
    query.includes('drop') ||
    query.includes('peta') ||
    query.includes('maps') ||
    query.includes('alamat') ||
    query.includes('terdekat')
  ) {
    return {
      text: 'SIRKULA terhubung dengan jaringan titik hijau di sekitarmu:\n\n1. Smart Drop-Box 24 Jam (Keputih Gang 2 & Gebang Wetan) — bebas setor kapan saja tanpa antre!\n2. TPS3R Kelurahan Semolowaru\n3. Stasiun Kompos Kampus ITS Eco Campus\n4. Bank Sampah Induk Surabaya Timur (Mulyorejo)\n\nNyalakan fitur GPS di menu Lokasi untuk panduan rute dan jarak terdekat!',
      actionLink: { label: 'Buka Peta Interaktif & GPS', href: '/lokasi' },
      quickReplies: ['🏷️ Cek harga daur ulang', '☕ Cup kopi bisa disetor?'],
    };
  }

  // 7. Organik / Kompos
  if (
    query.includes('organik') ||
    query.includes('makanan') ||
    query.includes('sisa') ||
    query.includes('kompos') ||
    query.includes('kulit')
  ) {
    return {
      text: 'Sampah organik seperti sisa makanan kering, kulit buah, dan ampas kopi/teh disalurkan ke Stasiun Kompos Kampus ITS Eco Campus.\n\nSampahmu diolah menjadi pupuk kompos ramah lingkungan untuk penghijauan taman kampus, dan penyetor berhak mendapatkan pupuk tanaman gratis!',
      actionLink: { label: 'Lihat Stasiun Kompos Kampus', href: '/lokasi' },
      quickReplies: ['📍 Drop-Box 24 Jam terdekat', '🏷️ Harga daur ulang'],
    };
  }

  // 8. Limbah B3 / Elektronik
  if (
    query.includes('baterai') ||
    query.includes('kabel') ||
    query.includes('elektronik') ||
    query.includes('charger') ||
    query.includes('b3')
  ) {
    return {
      text: '⚠️ Jangan buang baterai bekas, charger rusak, atau kabel ke tong sampah umum karena mengandung logam berat berbahaya.\n\nMasukkan ke Drop-Box Khusus E-Waste di Jl. Arief Rahman Hakim No. 102. Reward poin untuk limbah elektronik 2x lebih besar!',
      actionLink: { label: 'Cek Titik Drop-off E-Waste', href: '/lokasi' },
      quickReplies: ['📍 Peta lokasi terdekat', '🪙 Nilai tukar poin'],
    };
  }

  // 9. Cara Kerja / Alur Sirkula
  if (
    query.includes('sirkula') ||
    query.includes('cara kerja') ||
    query.includes('alur') ||
    query.includes('gimana') ||
    query.includes('bantuan')
  ) {
    return {
      text: 'Alur 3 Langkah Mudah SIRKULA:\n\n1. 🔍 PILAH & SCAN: Pisahkan sampah kosmu, foto dengan AI Scanner untuk deteksi jenis & taksiran nilainya.\n2. 🛵 DROP ATAU JEMPUT: Masukkan ke Drop-Box 24 Jam terdekat atau pesan penjemputan armada motor roda tiga.\n3. 🪙 DAPATKAN REWARD: Sampah ditimbang akurat, poin & saldo langsung masuk ke akunmu!',
      actionLink: { label: 'Coba AI Scanner Sekarang', href: '/scanner' },
      quickReplies: ['🏷️ Cek harga sampah hari ini', '🛵 Pesan jemput sampah'],
    };
  }

  // Default fallback answer
  return {
    text: `Terima kasih pertanyaannya! Untuk "${userText}", kamu bisa menggunakan fitur AI Scanner untuk mengenali jenis sampah tersebut otomatis, atau mengecek titik bank sampah terdekat via peta interaktif. Ada pertanyaan lain seputar pemilahan sampah kos?`,
    actionLink: { label: 'Buka Panduan Edukasi Sampah', href: '/edukasi' },
    quickReplies: [
      '🏷️ Cek harga daur ulang',
      '🛵 Cara jemput ke gang kos',
      '📍 Drop-Box 24 Jam terdekat',
      '🪙 Tukar poin ke e-wallet',
    ],
  };
}

export default function EcoBotChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Restore chat history from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('sirkula_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {}
  }, []);

  // Persist chat history to sessionStorage on change
  useEffect(() => {
    try {
      if (messages && messages.length > 0) {
        sessionStorage.setItem('sirkula_chat_history', JSON.stringify(messages));
      }
    } catch (e) {}
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Realistic smooth delay simulation (450ms)
    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        actionLink: response.actionLink,
        quickReplies: response.quickReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    try {
      sessionStorage.removeItem('sirkula_chat_history');
    } catch (e) {}
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased print:hidden">
      {/* 🌿 Minimalist Circular Floating Launcher Button */}
      {!isOpen && (
        <div className="relative group">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-13 h-13 rounded-full bg-white/95 backdrop-blur-xl border border-[#1C4D38]/15 shadow-[0_12px_35px_rgba(28,77,56,0.18)] hover:shadow-[0_16px_45px_rgba(28,77,56,0.28)] flex items-center justify-center text-[#1C4D38] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer relative"
            aria-label="Buka Asisten EcoBot"
          >
            {/* Soft pulsing halo ring */}
            <span className="absolute -inset-1 rounded-full bg-[#1C4D38]/10 animate-ping opacity-70 pointer-events-none" />

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1C4D38] to-[#2E6B4F] text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-5 h-5 text-[#D6E6C5]" />
            </div>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#E07A5F] text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                1
              </span>
            )}
          </button>

          {/* Gentle Hover Pill Tooltip */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1C4D38] text-white text-[11px] font-extrabold rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#D6E6C5]" />
            <span>Tanya EcoBot</span>
          </div>
        </div>
      )}

      {/* 🌿 Premium Frosted Glassmorphism Chat Window */}
      {isOpen && (
        <div
          className={`bg-[#FAF7F2]/95 backdrop-blur-2xl rounded-[32px] border border-white/70 shadow-[0_30px_70px_-15px_rgba(28,77,56,0.25)] flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'w-72 h-16'
              : 'w-[92vw] sm:w-[380px] h-[520px] max-h-[82vh]'
          }`}
        >
          {/* Header Bar — Clean, Warm, & Airy */}
          <div className="bg-white/80 backdrop-blur-md px-4.5 py-3.5 border-b border-[#1C4D38]/8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#E8F2EC] text-[#1C4D38] flex items-center justify-center shadow-xs border border-[#1C4D38]/10 relative">
                <Sprout className="w-5 h-5 text-[#1C4D38]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-[#1C4D38] font-display tracking-tight">
                    EcoBot
                  </h3>
                  <span className="px-1.5 py-0.2 bg-[#E6F3E6] text-[#1C4D38] text-[9px] font-extrabold rounded-full">
                    AI Pintar
                  </span>
                </div>
                <p className="text-[10px] text-[#1C4D38]/65 font-medium">
                  {isTyping ? 'Mengetik jawaban...' : 'Asisten Pilah Sampah Kos'}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-0.5 text-[#1C4D38]/60">
              <button
                type="button"
                onClick={handleResetChat}
                title="Mulai Ulang Chat"
                className="p-1.5 rounded-xl hover:bg-[#1C4D38]/10 hover:text-[#1C4D38] transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Perbesar' : 'Kecilkan'}
                className="p-1.5 rounded-xl hover:bg-[#1C4D38]/10 hover:text-[#1C4D38] transition cursor-pointer"
              >
                {isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Tutup"
                className="p-1.5 rounded-xl hover:bg-[#1C4D38]/10 hover:text-[#1C4D38] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Messages Stream (when not minimized) */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                {/* Micro Greeting Banner */}
                <div className="bg-white/60 rounded-2xl p-2.5 border border-[#1C4D38]/6 text-center space-y-0.5">
                  <span className="text-[10px] font-bold text-[#1C4D38]/75 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E07A5F]" />
                    Pilah Sampah Kos Jadi Poin & Cuan
                  </span>
                  <p className="text-[9px] text-[#1C4D38]/50">
                    Didukung data Bank Sampah Mitra & Drop-Box 24 Jam Terdekat.
                  </p>
                </div>

                {/* Messages */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[86%] p-3.5 leading-relaxed whitespace-pre-line shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#1C4D38] text-white rounded-3xl rounded-tr-xs font-medium'
                          : 'bg-white/95 text-[#1C4D38] rounded-3xl rounded-tl-xs border border-[#1C4D38]/8 font-medium'
                      }`}
                    >
                      <p className="text-[12px]">{msg.text}</p>

                      {/* Interactive Link Action if present */}
                      {msg.actionLink && (
                        <div className="mt-2.5 pt-2 border-t border-[#1C4D38]/8">
                          <Link
                            href={msg.actionLink.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-[10px] font-black px-3 py-1.5 rounded-xl transition shadow-2xs"
                          >
                            <span>{msg.actionLink.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-gray-400 font-medium px-2 mt-1">
                      {msg.time}
                    </span>

                    {/* Quick Suggestion Pills */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                        {msg.quickReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendMessage(reply)}
                            className="text-[10px] font-extrabold text-[#1C4D38] bg-white/90 hover:bg-[#1C4D38] hover:text-white border border-[#1C4D38]/12 px-3 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer text-left"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 text-[#1C4D38]/60 bg-white/90 px-3 py-2 rounded-2xl w-fit border border-[#1C4D38]/8 shadow-2xs">
                    <Sprout className="w-3.5 h-3.5 text-[#1C4D38] animate-spin" />
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1C4D38] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1C4D38] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1C4D38] animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Dock Bar — Floating Pill Design */}
              <div className="p-3 bg-white/85 backdrop-blur-md border-t border-[#1C4D38]/8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center bg-[#F3EEE3] rounded-full px-3.5 py-1 border border-[#1C4D38]/10 focus-within:ring-2 focus-within:ring-[#1C4D38]/20 focus-within:bg-white transition-all"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Tanya harga, cara pilah, atau armada..."
                    className="flex-1 text-xs py-1.5 bg-transparent text-[#1C4D38] placeholder-[#1C4D38]/40 focus:outline-hidden font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-7 h-7 rounded-full bg-[#1C4D38] hover:bg-[#143929] disabled:opacity-25 text-white flex items-center justify-center shadow-xs transition active:scale-90 cursor-pointer shrink-0 ml-1"
                    title="Kirim Pesan"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
