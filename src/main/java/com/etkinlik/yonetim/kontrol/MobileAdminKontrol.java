package com.etkinlik.yonetim.kontrol;

import com.etkinlik.yonetim.servis.EtkinlikServisi;
import com.etkinlik.yonetim.servis.KullaniciServisi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import java.util.Map;

@RestController
@RequestMapping("/mobile/admin")
public class MobileAdminKontrol {

    @GetMapping("/etkinlik/{id}/katilimcilar")
    public ResponseEntity<?> etkinlikKatilimcilari(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(etkinlikHizmeti.etkinlikKatilimlariniGetir(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }

    @Autowired
    private EtkinlikServisi etkinlikHizmeti;

    @Autowired
    private KullaniciServisi kullaniciServisi;

    @GetMapping("/panel")
    public ResponseEntity<?> panel() {
        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("toplamEtkinlik", etkinlikHizmeti.adminToplamEtkinlik());
            stats.put("toplamKullanici", kullaniciServisi.tumKullanicilar().size());
            stats.put("onayBekleyen", etkinlikHizmeti.adminOnayBekleyenEtkinlikSayisi());
            stats.put("onaylanan", etkinlikHizmeti.adminOnaylananEtkinlikSayisi());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }

    @GetMapping("/etkinlikler/onay-bekleyen")
    public ResponseEntity<?> onayBekleyenEtkinlikler() {
        try {
            return ResponseEntity.ok(etkinlikHizmeti.onayBekleyenEtkinlikler());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }

    @PostMapping("/etkinlik/onayla/{id}")
    public ResponseEntity<?> etkinlikOnayla(@PathVariable Integer id) {
        try {
            etkinlikHizmeti.etkinlikOnayla(id);
            return ResponseEntity.ok(Map.of("message", "Etkinlik onaylandı."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Hata: " + e.getMessage()));
        }
    }

    @PostMapping("/etkinlik/reddet/{id}")
    public ResponseEntity<?> etkinlikReddet(@PathVariable Integer id) {
        try {
            etkinlikHizmeti.etkinlikReddet(id);
            return ResponseEntity.ok(Map.of("message", "Etkinlik reddedildi."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Hata: " + e.getMessage()));
        }
    }

    @GetMapping("/kullanicilar")
    public ResponseEntity<?> tumKullanicilar() {
        try {
            return ResponseEntity.ok(kullaniciServisi.tumKullanicilar());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }

    @PostMapping("/kullanici/rol-degistir/{id}")
    public ResponseEntity<?> rolDegistir(@PathVariable Integer id, @RequestParam String rol) {
        try {
            kullaniciServisi.rolDegistir(id, rol);
            return ResponseEntity.ok(Map.of("message", "Kullanıcı rolü güncellendi: " + rol));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Hata: " + e.getMessage()));
        }
    }

    @GetMapping("/etkinlikler")
    public ResponseEntity<?> tumEtkinlikler() {
        try {
            return ResponseEntity.ok(etkinlikHizmeti.tumEtkinlikler());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }

    @PostMapping("/etkinlik-ekle")
    public ResponseEntity<?> etkinlikEkle(@RequestBody com.etkinlik.yonetim.model.Etkinlik etkinlik,
            java.security.Principal principal) {
        try {
            com.etkinlik.yonetim.model.Etkinlik yeni = etkinlikHizmeti.etkinlikOlustur(etkinlik, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Etkinlik oluşturuldu.", "id", yeni.getId()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Hata: " + e.getMessage()));
        }
    }

    @PostMapping("/etkinlik-guncelle/{id}")
    public ResponseEntity<?> etkinlikGuncelle(@PathVariable Integer id,
            @RequestBody com.etkinlik.yonetim.model.Etkinlik etkinlik) {
        try {
            etkinlikHizmeti.adminEtkinlikGuncelle(id, etkinlik);
            return ResponseEntity.ok(Map.of("message", "Etkinlik güncellendi."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Hata: " + e.getMessage()));
        }
    }

    @PostMapping("/etkinlik/sil/{id}")
    public ResponseEntity<?> etkinlikSil(@PathVariable Integer id) {
        try {
            etkinlikHizmeti.etkinlikSil(id);
            return ResponseEntity.ok(Map.of("message", "Etkinlik silindi."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Hata: " + e.getMessage()));
        }
    }
}
