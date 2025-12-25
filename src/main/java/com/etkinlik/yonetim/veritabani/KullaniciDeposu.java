package com.etkinlik.yonetim.veritabani;

import com.etkinlik.yonetim.model.Kullanici;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KullaniciDeposu extends JpaRepository<Kullanici, Integer> {

    Optional<Kullanici> findByKullaniciAdi(String kullaniciAdi);

}
