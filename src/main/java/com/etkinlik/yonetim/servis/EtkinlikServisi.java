package com.etkinlik.yonetim.servis;

import com.etkinlik.yonetim.dto.EtkinlikDto;
import com.etkinlik.yonetim.model.Etkinlik;
import com.etkinlik.yonetim.model.Kullanici;
import com.etkinlik.yonetim.veritabani.EtkinlikDeposu;
import com.etkinlik.yonetim.veritabani.KatilimKaydiDeposu;
import com.etkinlik.yonetim.veritabani.KullaniciDeposu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.etkinlik.yonetim.model.KatilimKaydi;

import java.util.List;

@Service
public class EtkinlikServisi {

    @Autowired
    private EtkinlikDeposu etkinlikDeposu;

    @Autowired
    private KullaniciServisi kullaniciHizmeti;

    @Autowired
    private KullaniciDeposu kullaniciDeposu;

    @Autowired
    private KatilimKaydiDeposu katilimKaydiDeposu;

    public Etkinlik etkinlikOlustur(Etkinlik etkinlik, String kullaniciAdi) {

        Kullanici olusturan = kullaniciHizmeti.kullaniciGetir(kullaniciAdi);
        etkinlik.setOlusturan(olusturan);

        // Admin oluşturursa direkt onaylı, diğer roller onay bekliyor
        if ("ADMIN".equals(olusturan.getRol())) {
            etkinlik.setDurum("ONAYLANDI");
        } else {
            etkinlik.setDurum("ONAY_BEKLIYOR");
        }

        return etkinlikDeposu.save(etkinlik);
    }

    // Tüm etkinlikler (durum fark etmeksizin)
    public List<Etkinlik> tumEtkinlikler() {
        return etkinlikDeposu.findAll();
    }

    // Belirli bir kullanıcının oluşturduğu etkinlikler
    public List<Etkinlik> kullanicininEtkinlikleri(String kullaniciAdi) {
        Kullanici kullanici = kullaniciHizmeti.kullaniciGetir(kullaniciAdi);
        return etkinlikDeposu.findByOlusturan(kullanici);
    }

    // Sadece ONAY_BEKLIYOR durumundakiler
    public List<Etkinlik> onayBekleyenEtkinlikler() {
        return etkinlikDeposu.findByDurum("ONAY_BEKLIYOR");
    }

    // Sadece ONAYLANDI durumundakiler
    public List<Etkinlik> onaylananEtkinlikler() {
        return etkinlikDeposu.findByDurum("ONAYLANDI");
    }

    // Admin paneli: toplam etkinlik sayısı
    public long adminToplamEtkinlik() {
        return etkinlikDeposu.count();
    }

    // Admin paneli: onay bekleyen etkinlik sayısı
    public long adminOnayBekleyenEtkinlikSayisi() {
        return onayBekleyenEtkinlikler().size();
    }

    // Admin paneli: onaylanan etkinlik sayısı
    public long adminOnaylananEtkinlikSayisi() {
        return onaylananEtkinlikler().size();
    }

    // Admin panelindeki "Tüm Etkinlikler" sayfası için:
    // sadece onaylanmış olanları göster
    public List<Etkinlik> adminTumuSadeceOnaylanan() {
        return onaylananEtkinlikler();
    }

    public void etkinlikOnayla(Integer id) {
        if (id == null)
            return;
        Etkinlik etkinlik = etkinlikDeposu.findById(id).orElse(null);

        if (etkinlik != null) {
            etkinlik.setDurum("ONAYLANDI");
            etkinlikDeposu.save(etkinlik);
        }
    }

    public void etkinlikReddet(Integer id) {
        if (id == null)
            return;
        Etkinlik etkinlik = etkinlikDeposu.findById(id).orElse(null);

        if (etkinlik != null) {
            etkinlik.setDurum("REDDEDILDI");
            etkinlikDeposu.save(etkinlik);
        }
    }

    public void etkinlikSil(Integer id) {
        if (id == null)
            return;
        etkinlikDeposu.deleteById(id);
    }

    public Etkinlik etkinlikGetir(Integer id) {
        if (id == null)
            return null;
        return etkinlikDeposu.findById(id).orElse(null);
    }

    public Etkinlik adminEtkinlikGuncelle(Integer id, Etkinlik yeniVeri) {
        if (id == null)
            throw new IllegalArgumentException("Etkinlik ID boş olamaz");

        Etkinlik mevcut = etkinlikDeposu.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));

        mevcut.setBaslik(yeniVeri.getBaslik());
        mevcut.setTarih(yeniVeri.getTarih());
        mevcut.setYer(yeniVeri.getYer());
        mevcut.setKontenjan(yeniVeri.getKontenjan());
        mevcut.setAciklama(yeniVeri.getAciklama());
        mevcut.setDurum(yeniVeri.getDurum());

        return etkinlikDeposu.save(mevcut);
    }

    public Etkinlik organizatorEtkinlikGuncelle(Integer id, Etkinlik yeniVeri, String kullaniciAdi) {
        if (id == null)
            throw new IllegalArgumentException("Etkinlik ID boş olamaz");

        Etkinlik mevcut = etkinlikDeposu.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));

        if (!mevcut.getOlusturan().getKullaniciAdi().equals(kullaniciAdi)) {
            throw new RuntimeException("Bu etkinliği güncelleme yetkiniz yok");
        }

        mevcut.setBaslik(yeniVeri.getBaslik());
        mevcut.setTarih(yeniVeri.getTarih());
        mevcut.setYer(yeniVeri.getYer());
        mevcut.setKontenjan(yeniVeri.getKontenjan());
        mevcut.setAciklama(yeniVeri.getAciklama());
        // Organizer updates shouldn't automatically approve/change status, or maybe
        // reset to ONAY_BEKLIYOR?
        // User requirements say: "Sadece kendi etkinliklerini düzenleyebilir".
        // Usually edits require re-approval. Let's set it to ONAY_BEKLIYOR.
        mevcut.setDurum("ONAY_BEKLIYOR");

        return etkinlikDeposu.save(mevcut);
    }

    public List<EtkinlikDto> onaylanmisEtkinlikleriKatilimDurumuIleGetir(String kullaniciAdi) {

        Kullanici kullanici = kullaniciDeposu.findByKullaniciAdi(kullaniciAdi)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + kullaniciAdi));

        List<Etkinlik> etkinlikler = etkinlikDeposu.findByDurum("ONAYLANDI");

        return etkinlikler.stream().map(e -> {
            EtkinlikDto dto = new EtkinlikDto();
            dto.id = e.getId();
            dto.baslik = e.getBaslik();
            dto.tarih = e.getTarih();
            dto.yer = e.getYer();
            dto.kontenjan = e.getKontenjan();
            dto.olusturan = e.getOlusturan();

            dto.katilimYapmis = katilimKaydiDeposu.existsByKullanici_IdAndEtkinlik_Id(
                    kullanici.getId(), e.getId());

            return dto;
        }).toList();
    }

    public List<KatilimKaydi> etkinlikKatilimlariniGetir(Integer etkinlikId) {
        if (etkinlikId == null)
            return List.of();
        Etkinlik etkinlik = etkinlikDeposu.findById(etkinlikId).orElse(null);
        if (etkinlik == null)
            return List.of();

        return katilimKaydiDeposu.findByEtkinlik(etkinlik);
    }

    public List<KatilimKaydi> organizatorEtkinlikKatilimcilari(Integer etkinlikId, String kullaniciAdi) {
        if (etkinlikId == null)
            return List.of();

        Etkinlik etkinlik = etkinlikDeposu.findById(etkinlikId)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı"));

        if (!etkinlik.getOlusturan().getKullaniciAdi().equals(kullaniciAdi)) {
            throw new RuntimeException("Bu etkinliğin katılımcılarını görme yetkiniz yok");
        }

        return katilimKaydiDeposu.findByEtkinlik(etkinlik);
    }

}
