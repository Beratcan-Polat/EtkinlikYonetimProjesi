package com.etkinlik.yonetim.veritabani;

import com.etkinlik.yonetim.model.KatilimKaydi;
import com.etkinlik.yonetim.model.Etkinlik;
import com.etkinlik.yonetim.model.Kullanici;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KatilimKaydiDeposu extends JpaRepository<KatilimKaydi, Integer> {

    // Bir etkinliğe kayıtlı kullanıcıları listelemek için
    List<KatilimKaydi> findByEtkinlik(Etkinlik etkinlik);

    // Bir kullanıcının katıldığı etkinlikleri listelemek için
    List<KatilimKaydi> findByKullanici(Kullanici kullanici);

    // Bir kullanıcının bir etkinliğe daha önce kaydolup olmadığını kontrol etmek için
    boolean existsByEtkinlikAndKullanici(Etkinlik etkinlik, Kullanici kullanici);
    
    boolean existsByKullanici_IdAndEtkinlik_Id(Integer kullaniciId, Integer etkinlikId);
}
