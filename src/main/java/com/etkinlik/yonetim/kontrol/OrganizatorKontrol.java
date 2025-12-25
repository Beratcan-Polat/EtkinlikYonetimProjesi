package com.etkinlik.yonetim.kontrol;

import com.etkinlik.yonetim.servis.EtkinlikServisi;
import com.etkinlik.yonetim.servis.KatilimServisi;
import com.etkinlik.yonetim.servis.KullaniciServisi;
import com.etkinlik.yonetim.model.Etkinlik;
import com.etkinlik.yonetim.model.KatilimKaydi;
import com.etkinlik.yonetim.model.Kullanici;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/organizator")
public class OrganizatorKontrol {

    @Autowired
    private EtkinlikServisi etkinlikHizmeti;

    @Autowired
    private KatilimServisi katilimHizmeti;
    
    @Autowired
    private KullaniciServisi kullaniciHizmeti;


    // Organizatör Paneli
    @GetMapping("/panel")
    public String organizatorPanel(Model model,
                                   @AuthenticationPrincipal UserDetails user) {

        String kullaniciAdi = user.getUsername();
        model.addAttribute("username", kullaniciAdi);

        List<Etkinlik> etkinlikler =
                etkinlikHizmeti.kullanicininEtkinlikleri(kullaniciAdi);

        long toplam = etkinlikler.size();
        long onaylanan = etkinlikler.stream()
                .filter(e -> "ONAYLANDI".equals(e.getDurum()))
                .count();
        long bekleyen = etkinlikler.stream()
                .filter(e -> "ONAY_BEKLIYOR".equals(e.getDurum()))
                .count();

        model.addAttribute("toplamEtkinligim", toplam);
        model.addAttribute("onaylananEtkinlikler", onaylanan);
        model.addAttribute("onayBekleyen", bekleyen);

        return "organizator/panel";
    }





    // Organizatörün kendi etkinlikleri
    @GetMapping("/etkinliklerim")
    public String etkinliklerim(Model model, @AuthenticationPrincipal UserDetails user) {

        String kullaniciAdi = user.getUsername();

        List<Etkinlik> liste = etkinlikHizmeti.kullanicininEtkinlikleri(kullaniciAdi);
        model.addAttribute("liste", liste);

        return "organizator/benim-etkinliklerim";
    }


    // Etkinlik oluşturma sayfası
    @GetMapping("/etkinlik/olustur")
    public String etkinlikOlusturSayfa(Model model) {
        model.addAttribute("etkinlik", new Etkinlik());
        return "organizator/etkinlik-olustur";
    }


    // Etkinlik oluşturma işlemi
    @PostMapping("/etkinlik/olustur")
    public String etkinlikOlustur(@ModelAttribute Etkinlik etkinlik,
                                  @AuthenticationPrincipal UserDetails user) {

        String kullaniciAdi = user.getUsername();
        etkinlikHizmeti.etkinlikOlustur(etkinlik, kullaniciAdi);

        return "redirect:/organizator/etkinliklerim";
    }


    // Etkinlik düzenleme sayfası
    @GetMapping("/etkinlik/duzenle/{id}")
    public String etkinlikDuzenleSayfa(@PathVariable Integer id,
                                       @AuthenticationPrincipal UserDetails user,
                                       Model model) {

        Etkinlik etkinlik = etkinlikHizmeti.etkinlikGetir(id);

        // KENDİSİNE AİT OLMAYAN ETKİNLİĞİ GÖREMEZ
        if (etkinlik == null || !etkinlik.getOlusturan().getKullaniciAdi().equals(user.getUsername())) {
            model.addAttribute("mesaj", "Bu etkinliği düzenleme yetkiniz yok.");
            return "organizator/sonuc";
        }

        model.addAttribute("etkinlik", etkinlik);
        return "organizator/etkinlik-duzenle";
    }


    // Etkinlik düzenleme işlemi
    @PostMapping("/etkinlik/duzenle/{id}")
    public String etkinlikDuzenle(@PathVariable Integer id,
                                  @ModelAttribute Etkinlik guncelEtkinlik,
                                  @AuthenticationPrincipal UserDetails user,
                                  Model model) {

        Etkinlik mevcut = etkinlikHizmeti.etkinlikGetir(id);

        if (mevcut == null ||
                !mevcut.getOlusturan().getKullaniciAdi().equals(user.getUsername())) {
            model.addAttribute("mesaj", "Bu etkinliği düzenleme yetkiniz yok.");
            return "organizator/sonuc";
        }

        // Değerleri güncelle
        mevcut.setBaslik(guncelEtkinlik.getBaslik());
        mevcut.setAciklama(guncelEtkinlik.getAciklama());
        mevcut.setTarih(guncelEtkinlik.getTarih());
        mevcut.setYer(guncelEtkinlik.getYer());
        mevcut.setKontenjan(guncelEtkinlik.getKontenjan());

        // Güncelleme metodu
        etkinlikHizmeti.adminEtkinlikGuncelle(id, mevcut);

        return "redirect:/organizator/etkinliklerim";
    }


    // Etkinlik silme işlemi
    @PostMapping("/etkinlik/sil/{id}")
    public String etkinlikSil(@PathVariable Integer id,
                              @AuthenticationPrincipal UserDetails user,
                              Model model) {

        Etkinlik mevcut = etkinlikHizmeti.etkinlikGetir(id);

        if (mevcut == null ||
                !mevcut.getOlusturan().getKullaniciAdi().equals(user.getUsername())) {
            model.addAttribute("mesaj", "Bu etkinliği silme yetkiniz yok.");
            return "organizator/sonuc";
        }

        etkinlikHizmeti.etkinlikSil(id);

        return "redirect:/organizator/etkinliklerim";
    }


    // Etkinlik katılım listeleme
    @GetMapping("/etkinlik/katilim/{id}")
    public String etkinlikKatilimListesi(@PathVariable Integer id,
                                         @AuthenticationPrincipal UserDetails user,
                                         Model model) {

        Etkinlik etkinlik = etkinlikHizmeti.etkinlikGetir(id);

        // Güvenlik kontrolü — sadece kendi etkinliğinin katılımlarını görebilir
        if (etkinlik == null ||
                !etkinlik.getOlusturan().getKullaniciAdi().equals(user.getUsername())) {
            model.addAttribute("mesaj", "Bu etkinliğin katılımcılarını görüntüleme yetkiniz yok.");
            return "organizator/sonuc";
        }

        List<KatilimKaydi> liste = katilimHizmeti.etkinlikKatilimlari(id);
        model.addAttribute("liste", liste);

        return "organizator/katilim-listesi";
    }
    
    @GetMapping("/profil")
    public String profilSayfasi(Model model, @AuthenticationPrincipal UserDetails user) {
        var kullanici = kullaniciHizmeti.kullaniciGetir(user.getUsername());
        model.addAttribute("kullanici", kullanici);
        return "organizator/profil";
    }
    
    @PostMapping("/profil/guncelle")
    public String profilGuncelle(@ModelAttribute("kullanici") Kullanici guncel,
                                 @AuthenticationPrincipal UserDetails user,
                                 Model model) {

        Kullanici mevcut = kullaniciHizmeti.kullaniciGetir(user.getUsername());

        mevcut.setAdSoyad(guncel.getAdSoyad());
        mevcut.setEposta(guncel.getEposta());
        mevcut.setTelefon(guncel.getTelefon());

        kullaniciHizmeti.profilGuncelle(mevcut);

        model.addAttribute("mesaj", "Profil başarıyla güncellendi!");
        return "organizator/sonuc";
    }


}
