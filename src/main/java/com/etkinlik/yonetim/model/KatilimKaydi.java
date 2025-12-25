package com.etkinlik.yonetim.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "KATILIM")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class KatilimKaydi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ETKINLIK_ID", nullable = false)
    private Etkinlik etkinlik;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "KULLANICI_ID", nullable = false)
    private Kullanici kullanici;

    @Column(name = "KAYIT_ZAMANI", nullable = false)
    private LocalDateTime kayitZamani;

    public KatilimKaydi() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Etkinlik getEtkinlik() {
        return etkinlik;
    }

    public void setEtkinlik(Etkinlik etkinlik) {
        this.etkinlik = etkinlik;
    }

    public Kullanici getKullanici() {
        return kullanici;
    }

    public void setKullanici(Kullanici kullanici) {
        this.kullanici = kullanici;
    }

    public LocalDateTime getKayitZamani() {
        return kayitZamani;
    }

    public void setKayitZamani(LocalDateTime kayitZamani) {
        this.kayitZamani = kayitZamani;
    }
}
