package com.etkinlik.yonetim.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ETKINLIK")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Etkinlik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "BASLIK", nullable = false)
    private String baslik;

    @Column(name = "ACIKLAMA", length = 2000)
    private String aciklama;

    @Column(name = "TARIH", nullable = false)
    private LocalDateTime tarih;

    @Column(name = "YER")
    private String yer;

    @Column(name = "KONTENJAN", nullable = false)
    private Integer kontenjan;

    @Column(name = "DURUM", nullable = false)
    private String durum;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "OLUSTURAN_ID", nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty("organizator")
    private Kullanici olusturan;

    @OneToMany(mappedBy = "etkinlik", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<KatilimKaydi> katilimlar;

    public Etkinlik() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBaslik() {
        return baslik;
    }

    public void setBaslik(String baslik) {
        this.baslik = baslik;
    }

    public String getAciklama() {
        return aciklama;
    }

    public void setAciklama(String aciklama) {
        this.aciklama = aciklama;
    }

    public LocalDateTime getTarih() {
        return tarih;
    }

    public void setTarih(LocalDateTime tarih) {
        this.tarih = tarih;
    }

    public String getYer() {
        return yer;
    }

    public void setYer(String yer) {
        this.yer = yer;
    }

    public Integer getKontenjan() {
        return kontenjan;
    }

    public void setKontenjan(Integer kontenjan) {
        this.kontenjan = kontenjan;
    }

    public Kullanici getOlusturan() {
        return olusturan;
    }

    public void setOlusturan(Kullanici olusturan) {
        this.olusturan = olusturan;
    }

    public String getDurum() {
        return durum;
    }

    public void setDurum(String durum) {
        this.durum = durum;
    }

}
