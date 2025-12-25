package com.etkinlik.yonetim.veritabani;

import com.etkinlik.yonetim.model.Etkinlik;
import com.etkinlik.yonetim.model.Kullanici;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EtkinlikDeposu extends JpaRepository<Etkinlik, Integer> {

    List<Etkinlik> findByOlusturan(Kullanici olusturan);
    
    List<Etkinlik> findByDurum(String durum);

}
