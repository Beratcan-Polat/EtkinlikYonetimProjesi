package com.etkinlik.yonetim.kontrol;

import com.etkinlik.yonetim.dto.EtkinlikDto;
import com.etkinlik.yonetim.model.KatilimKaydi;
import com.etkinlik.yonetim.model.Kullanici;
import com.etkinlik.yonetim.servis.EtkinlikServisi;
import com.etkinlik.yonetim.servis.KatilimServisi;
import com.etkinlik.yonetim.servis.KullaniciServisi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/katilimci")
public class KatilimciKontrol {

    @Autowired
    private KatilimServisi katilimHizmeti;

    @Autowired
    private EtkinlikServisi etkinlikHizmeti;

    @Autowired
    private KullaniciServisi kullaniciHizmeti;

    @GetMapping("/panel")
    public String panel(Model model, Authentication auth) {
        model.addAttribute("username", auth.getName());
        return "katilimci/panel";
    }

    @GetMapping("/etkinlik/list")
    public String etkinlikListesi(Model model, Authentication auth) {
        String username = auth.getName();
        List<EtkinlikDto> liste =
                etkinlikHizmeti.onaylanmisEtkinlikleriKatilimDurumuIleGetir(username);

        model.addAttribute("liste", liste);
        model.addAttribute("username", username);
        return "katilimci/etkinlik-listesi";
    }

    @GetMapping("/etkinliklerim")
    public String katildiklarim(Model model, Authentication auth) {
        List<KatilimKaydi> liste =
                katilimHizmeti.kullanicininKatilimlari(auth.getName());

        model.addAttribute("liste", liste);
        model.addAttribute("username", auth.getName());
        return "katilimci/kaydolunan-etkinlikler";
    }

    @PostMapping("/etkinlik/katil/{id}")
    public String katil(@PathVariable Integer id, Authentication auth, Model model) {
        String mesaj =
                katilimHizmeti.etkinligeKatil(id, auth.getName());

        model.addAttribute("mesaj", mesaj);
        return "katilimci/sonuc";
    }

    @PostMapping("/etkinlik/iptal/{id}")
    public String iptal(@PathVariable Integer id, Authentication auth, Model model) {
        String mesaj =
                katilimHizmeti.katilimiIptalEt(id, auth.getName());

        model.addAttribute("mesaj", mesaj);
        return "katilimci/sonuc";
    }

    @GetMapping("/profil")
    public String profil(Model model, Authentication auth) {
        Kullanici kullanici =
                kullaniciHizmeti.kullaniciGetir(auth.getName());

        model.addAttribute("kullanici", kullanici);
        model.addAttribute("username", auth.getName());
        return "katilimci/profil";
    }

    @PostMapping("/profil/guncelle")
    public String profilGuncelle(@ModelAttribute Kullanici guncel,
                                 Authentication auth,
                                 Model model) {

        Kullanici mevcut =
                kullaniciHizmeti.kullaniciGetir(auth.getName());

        mevcut.setAdSoyad(guncel.getAdSoyad());
        mevcut.setEposta(guncel.getEposta());
        mevcut.setTelefon(guncel.getTelefon());

        kullaniciHizmeti.profilGuncelle(mevcut);

        model.addAttribute("mesaj", "Profiliniz başarıyla güncellendi.");
        return "katilimci/sonuc";
    }
}
