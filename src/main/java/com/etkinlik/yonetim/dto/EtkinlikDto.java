package com.etkinlik.yonetim.dto;

import com.etkinlik.yonetim.model.Kullanici;
import java.time.LocalDateTime;

public class EtkinlikDto {

    public Integer id;
    public String baslik;
    public LocalDateTime tarih;
    public String yer;
    public int kontenjan;
    public Kullanici olusturan;
    public boolean katilimYapmis;
    public int katilimSayisi;
    public boolean kontenjanDolu;

}
