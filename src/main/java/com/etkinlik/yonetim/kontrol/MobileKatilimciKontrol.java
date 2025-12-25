package com.etkinlik.yonetim.kontrol;

import com.etkinlik.yonetim.model.Kullanici;
import com.etkinlik.yonetim.servis.KatilimServisi;
import com.etkinlik.yonetim.servis.KullaniciServisi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mobile/katilimci")
public class MobileKatilimciKontrol {

    @Autowired
    private KatilimServisi katilimHizmeti;

    @Autowired
    private KullaniciServisi kullaniciHizmeti;

    @Autowired
    private com.etkinlik.yonetim.servis.EtkinlikServisi etkinlikHizmeti;

    @GetMapping("/etkinlikler")
    public org.springframework.http.ResponseEntity<?> onayliEtkinlikler() {
        return org.springframework.http.ResponseEntity.ok(etkinlikHizmeti.onaylananEtkinlikler());
    }

    @GetMapping("/etkinliklerim")
    public org.springframework.http.ResponseEntity<?> mobilKatildiklarim(Authentication auth) {
        try {
            if (auth == null)
                return org.springframework.http.ResponseEntity.ok(List.of());
            return org.springframework.http.ResponseEntity.ok(katilimHizmeti.kullanicininKatilimlari(auth.getName()));
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }

    @PostMapping("/katil/{id}")
    public Map<String, String> mobilKatil(@PathVariable Integer id, Authentication auth) {
        Map<String, String> response = new HashMap<>();
        try {
            if (auth == null) {
                response.put("message", "Oturum açmanız gerekiyor.");
                return response;
            }

            String mesaj = katilimHizmeti.etkinligeKatil(id, auth.getName());
            response.put("message", mesaj);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Hata oluştu: " + e.getMessage());
        }
        return response;
    }

    @PostMapping("/iptal/{id}")
    public Map<String, String> mobilIptal(@PathVariable Integer id, Authentication auth) {
        Map<String, String> response = new HashMap<>();
        try {
            if (auth == null) {
                response.put("message", "Oturum açmanız gerekiyor.");
                return response;
            }

            String mesaj = katilimHizmeti.katilimiIptalEt(id, auth.getName());
            response.put("message", mesaj);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Hata oluştu: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/profil")
    public org.springframework.http.ResponseEntity<?> profilGetir(Authentication auth) {
        try {
            if (auth == null)
                return org.springframework.http.ResponseEntity.status(401).build();
            Kullanici k = kullaniciHizmeti.kullaniciGetir(auth.getName());
            return org.springframework.http.ResponseEntity.ok(k);
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }

    @PostMapping("/profil/guncelle")
    public Map<String, String> profilGuncelle(@RequestBody Kullanici guncel, Authentication auth) {
        Map<String, String> response = new HashMap<>();
        try {
            if (auth == null) {
                response.put("message", "Oturum açmanız gerekiyor.");
                return response;
            }

            Kullanici mevcut = kullaniciHizmeti.kullaniciGetir(auth.getName());
            // Sadece izin verilen alanları güncelle
            mevcut.setAdSoyad(guncel.getAdSoyad());
            mevcut.setEposta(guncel.getEposta());
            mevcut.setTelefon(guncel.getTelefon());
            // Kullanıcı adı değişimine izin vermiyoruz, güvenlik gerekçesiyle

            kullaniciHizmeti.profilGuncelle(mevcut);
            response.put("message", "Profil başarıyla güncellendi.");
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Hata: " + e.getMessage());
        }
        return response;
    }
}
