package com.etkinlik.yonetim.kontrol;

import com.etkinlik.yonetim.model.Kullanici;
import com.etkinlik.yonetim.servis.KullaniciServisi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/mobile/public")
public class MobilePublicKontrol {

    @Autowired
    private KullaniciServisi kullaniciServisi;

    @PostMapping("/kayit")
    public ResponseEntity<?> kayitOl(@RequestBody Kullanici kullanici) {
        try {
            // Check if username exists (handled by service normally, but let's be safe)
            if (kullaniciServisi.kullaniciGetir(kullanici.getKullaniciAdi()) != null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Bu kullanıcı adı zaten alınmış."));
            }

            kullaniciServisi.kaydet(kullanici);
            return ResponseEntity.ok(Map.of("message", "Kayıt başarılı. Giriş yapabilirsiniz."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Kayıt hatası: " + e.getMessage()));
        }
    }
}
