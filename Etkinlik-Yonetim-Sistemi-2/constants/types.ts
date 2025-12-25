
export interface Etkinlik {
    id: number;
    baslik: string;
    aciklama: string;
    tarih: string; // ISO string or Array
    yer: string;
    kontenjan: number;
    durum: string;
    organizator: Kullanici;
}

export interface KatilimKaydi {
    id: number;
    etkinlik: Etkinlik;
    kayitZamani: string;
    kullanici: Kullanici;
}

export interface Kullanici {
    id: number;
    kullaniciAdi: string;
    adSoyad: string;
    eposta: string;
    telefon: string;
    rol: string;
}
