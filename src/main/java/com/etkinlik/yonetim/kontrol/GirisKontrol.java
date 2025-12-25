package com.etkinlik.yonetim.kontrol;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import com.etkinlik.yonetim.model.Kullanici;
import com.etkinlik.yonetim.servis.KullaniciServisi;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class GirisKontrol {

    @Autowired
    private KullaniciServisi kullaniciServisi;

    @GetMapping("/giris")
    public String girisSayfasi() {
        return "ortak/giris";
    }

    @GetMapping("/kayit")
    public String kayitSayfasi() {
        return "ortak/kayit";
    }

    @PostMapping("/kayit")
    public String kayitOl(@ModelAttribute Kullanici kullanici,
                          @RequestParam String sifreTekrar,
                          Model model) {

        // Şifreler uyuşuyor mu?
        if (!kullanici.getSifre().equals(sifreTekrar)) {
            model.addAttribute("mesaj", "Şifreler uyuşmuyor!");
            return "ortak/kayit";
        }

        try {
            kullaniciServisi.kaydet(kullanici);
            return "redirect:/giris";
        }
        catch (Exception e) {
            model.addAttribute("mesaj", "Kayıt sırasında hata oluştu: " + e.getMessage());
            return "ortak/kayit";
        }
    }
}
