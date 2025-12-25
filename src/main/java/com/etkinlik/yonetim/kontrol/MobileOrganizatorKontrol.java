package com.etkinlik.yonetim.kontrol;

import com.etkinlik.yonetim.model.Etkinlik;
import com.etkinlik.yonetim.servis.EtkinlikServisi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mobile/organizator")
public class MobileOrganizatorKontrol {

    @Autowired
    private EtkinlikServisi etkinlikHizmeti;

    @GetMapping("/panel")
    public ResponseEntity<?> panel(Principal principal) {
        Map<String, Object> stats = new HashMap<>();
        try {
            String kullaniciAdi = principal.getName();
            List<Etkinlik> etk = etkinlikHizmeti.kullanicininEtkinlikleri(kullaniciAdi);

            long toplam = etk.size();
            long onaylanan = etk.stream().filter(e -> "ONAYLANDI".equals(e.getDurum())).count();
            long onayBekleyen = etk.stream().filter(e -> "ONAY_BEKLIYOR".equals(e.getDurum())).count();

            stats.put("toplamEtkinlik", toplam);
            stats.put("onaylananEtkinlik", onaylanan);
            stats.put("onayBekleyen", onayBekleyen);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }

    @GetMapping("/etkinliklerim")
    public ResponseEntity<?> etkinliklerim(Principal principal) {
        try {
            return ResponseEntity.ok(etkinlikHizmeti.kullanicininEtkinlikleri(principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hata: " + e.getMessage());
        }
    }

    @PostMapping("/etkinlik-ekle")
    public ResponseEntity<?> etkinlikEkle(@RequestBody Etkinlik etkinlik, Principal principal) {
        try {
            // Organizer events are pending by default (handled in logic)
            Etkinlik yeni = etkinlikHizmeti.etkinlikOlustur(etkinlik, principal.getName());
            return ResponseEntity
                    .ok(Map.of("message", "Etkinlik oluşturuldu.", "id", yeni.getId(), "durum", yeni.getDurum()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Hata: " + e.getMessage()));
        }
    }

    @PostMapping("/etkinlik-guncelle/{id}")
    public ResponseEntity<?> etkinlikGuncelle(@PathVariable Integer id, @RequestBody Etkinlik etkinlik,
            Principal principal) {
        try {
            etkinlikHizmeti.organizatorEtkinlikGuncelle(id, etkinlik, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Etkinlik güncellendi."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Hata: " + e.getMessage()));
        }
    }

    @GetMapping("/etkinlik/{id}/katilimcilar")
    public ResponseEntity<?> etkinlikKatilimcilari(@PathVariable Integer id, Principal principal) {
        try {
            return ResponseEntity.ok(etkinlikHizmeti.organizatorEtkinlikKatilimcilari(id, principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Hata: " + e.getMessage()));
        }
    }
}
