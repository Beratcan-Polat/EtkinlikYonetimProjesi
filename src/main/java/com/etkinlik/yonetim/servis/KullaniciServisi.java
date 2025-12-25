package com.etkinlik.yonetim.servis;

import com.etkinlik.yonetim.model.Kullanici;
import com.etkinlik.yonetim.veritabani.KullaniciDeposu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KullaniciServisi implements UserDetailsService {

    @Autowired
    private KullaniciDeposu kullaniciDeposu;

    @Autowired
    private PasswordEncoder sifreleyici;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Kullanici k = kullaniciDeposu.findByKullaniciAdi(username)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + username));

        return User.withUsername(k.getKullaniciAdi())
                .password(k.getSifre())
                .roles(k.getRol())
                .build();
    }

    public Kullanici kaydet(Kullanici kullanici) {

        kullanici.setRol("KATILIMCI");

        kullanici.setSifre(sifreleyici.encode(kullanici.getSifre()));

        return kullaniciDeposu.save(kullanici);
    }

    public Kullanici kullaniciGetir(String kullaniciAdi) {
        return kullaniciDeposu.findByKullaniciAdi(kullaniciAdi)
                .orElse(null);
    }

    public List<Kullanici> tumKullanicilar() {
        return kullaniciDeposu.findAll();
    }

    public void rolDegistir(Integer kullaniciId, String yeniRol) {
        if (kullaniciId == null) {
            throw new IllegalArgumentException("Kullanıcı ID boş olamaz");
        }
        Kullanici kullanici = kullaniciDeposu.findById(kullaniciId)
                .orElse(null);

        if (kullanici != null) {
            kullanici.setRol(yeniRol);
            kullaniciDeposu.save(kullanici);
        }
    }

    public Kullanici profilGuncelle(Kullanici k) {
        if (k == null) {
            throw new IllegalArgumentException("Kullanıcı nesnesi boş olamaz");
        }

        Integer id = k.getId();
        if (id == null) {
            throw new IllegalArgumentException("Kullanıcı ID boş olamaz");
        }

        Kullanici mevcut = kullaniciDeposu.findById(id)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        mevcut.setAdSoyad(k.getAdSoyad());
        mevcut.setEposta(k.getEposta());
        mevcut.setTelefon(k.getTelefon());

        return kullaniciDeposu.save(mevcut);
    }

}
