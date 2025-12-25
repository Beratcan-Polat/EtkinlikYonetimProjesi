package com.etkinlik.yonetim.kontrol;

import com.etkinlik.yonetim.servis.EtkinlikServisi;
import com.etkinlik.yonetim.model.Etkinlik;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/etkinlik")
public class EtkinlikKontrol {

    @Autowired
    private EtkinlikServisi etkinlikHizmeti;


    @GetMapping("/onayli")
    public List<Etkinlik> onayliEtkinlikler() {
        return etkinlikHizmeti.tumEtkinlikler()
                .stream()
                .filter(e -> e.getDurum().equals("ONAYLANDI"))
                .toList();
    }


    @GetMapping("/{id}")
    public Etkinlik etkinlikDetay(@PathVariable Integer id) {
        Etkinlik etkinlik = etkinlikHizmeti.etkinlikGetir(id);

        // Sadece onaylı etkinlikler görüntülenebilir
        if (etkinlik != null && etkinlik.getDurum().equals("ONAYLANDI")) {
            return etkinlik;
        }
        return null; 
    }

    
   
    

}
