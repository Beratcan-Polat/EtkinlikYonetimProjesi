package com.etkinlik.yonetim.servis;

import com.etkinlik.yonetim.model.Etkinlik;
import com.etkinlik.yonetim.model.KatilimKaydi;
import com.etkinlik.yonetim.model.Kullanici;
import com.etkinlik.yonetim.veritabani.KatilimKaydiDeposu;
import com.etkinlik.yonetim.veritabani.EtkinlikDeposu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KatilimServisi {

    @Autowired
    private KatilimKaydiDeposu katilimKaydiDeposu;

    @Autowired
    private EtkinlikDeposu etkinlikDeposu;

    @Autowired
    private KullaniciServisi kullaniciHizmeti;

    public String etkinligeKatil(Integer etkinlikId, String kullaniciAdi) {
        if (etkinlikId == null)
            return "Etkinlik ID boş olamaz.";

        Kullanici kullanici = kullaniciHizmeti.kullaniciGetir(kullaniciAdi);
        Etkinlik etkinlik = etkinlikDeposu.findById(etkinlikId).orElse(null);

        if (etkinlik == null) {
            return "Etkinlik bulunamadı.";
        }

        // Etkinlik onaylı mı kontrolü
        if (!etkinlik.getDurum().equals("ONAYLANDI")) {
            return "Bu etkinlik henüz yayında değil.";
        }

        // Çift kayıt kontrolü
        boolean kayitVarMi = katilimKaydiDeposu.existsByEtkinlikAndKullanici(etkinlik, kullanici);
        if (kayitVarMi) {
            return "Bu etkinliğe zaten kayıt oldunuz.";
        }

        // Kontenjan kontrolü
        int kayitSayisi = katilimKaydiDeposu.findByEtkinlik(etkinlik).size();
        if (kayitSayisi >= etkinlik.getKontenjan()) {
            return "Etkinlik kontenjanı dolmuştur.";
        }

        // Yeni katılım oluştur
        KatilimKaydi kayit = new KatilimKaydi();
        kayit.setEtkinlik(etkinlik);
        kayit.setKullanici(kullanici);
        kayit.setKayitZamani(LocalDateTime.now());

        katilimKaydiDeposu.save(kayit);

        return "Etkinliğe başarıyla kayıt olundu.";
    }

    public String katilimiIptalEt(Integer etkinlikId, String kullaniciAdi) {
        if (etkinlikId == null)
            return "Etkinlik ID boş olamaz.";

        Kullanici kullanici = kullaniciHizmeti.kullaniciGetir(kullaniciAdi);
        Etkinlik etkinlik = etkinlikDeposu.findById(etkinlikId).orElse(null);

        if (etkinlik == null) {
            return "Etkinlik bulunamadı.";
        }

        List<KatilimKaydi> kayitlar = katilimKaydiDeposu.findByKullanici(kullanici);

        for (KatilimKaydi k : kayitlar) {
            if (k.getEtkinlik().getId().equals(etkinlikId)) {
                katilimKaydiDeposu.delete(k);
                return "Kayıt başarıyla iptal edildi.";
            }
        }

        return "Bu etkinliğe kayıtlı değilsiniz.";
    }

    public List<KatilimKaydi> etkinlikKatilimlari(Integer etkinlikId) {
        if (etkinlikId == null)
            return List.of();

        Etkinlik etkinlik = etkinlikDeposu.findById(etkinlikId).orElse(null);

        if (etkinlik == null) {
            return List.of();
        }

        return katilimKaydiDeposu.findByEtkinlik(etkinlik);
    }

    public List<KatilimKaydi> kullanicininKatilimlari(String kullaniciAdi) {

        Kullanici kullanici = kullaniciHizmeti.kullaniciGetir(kullaniciAdi);

        return katilimKaydiDeposu.findByKullanici(kullanici);
    }
}
