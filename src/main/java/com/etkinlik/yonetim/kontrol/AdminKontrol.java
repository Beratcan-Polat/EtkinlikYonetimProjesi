package com.etkinlik.yonetim.kontrol;

import com.etkinlik.yonetim.servis.EtkinlikServisi;
import com.etkinlik.yonetim.servis.KullaniciServisi;
import com.etkinlik.yonetim.model.Etkinlik;
import com.etkinlik.yonetim.model.Kullanici;
import com.etkinlik.yonetim.model.KatilimKaydi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminKontrol {

    @Autowired
    private EtkinlikServisi etkinlikHizmeti;

    @Autowired
    private KullaniciServisi kullaniciServisi;



    @GetMapping("/panel")
    public String panel(Model model) {

        long toplamEtkinlik = etkinlikHizmeti.adminToplamEtkinlik();
        long toplamKullanici = kullaniciServisi.tumKullanicilar().size();
        long onayBekleyen = etkinlikHizmeti.adminOnayBekleyenEtkinlikSayisi();
        long onaylanan = etkinlikHizmeti.adminOnaylananEtkinlikSayisi();

        model.addAttribute("toplamEtkinlik", toplamEtkinlik);
        model.addAttribute("toplamKullanici", toplamKullanici);
        model.addAttribute("onayBekleyen", onayBekleyen);
        model.addAttribute("onaylanan", onaylanan);

        return "admin/panel";
    }



    @GetMapping("/etkinlikler/onay-bekleyen")
    public String onayBekleyenEtkinlikler(Model model) {

        List<Etkinlik> liste = etkinlikHizmeti.onayBekleyenEtkinlikler();
        model.addAttribute("liste", liste);

        return "admin/etkinlik-onay";
    }

    @PostMapping("/etkinlik/onayla/{id}")
    public String etkinlikOnayla(@PathVariable Integer id) {
        etkinlikHizmeti.etkinlikOnayla(id);
        return "redirect:/admin/etkinlikler/onay-bekleyen";
    }

    @PostMapping("/etkinlik/reddet/{id}")
    public String etkinlikReddet(@PathVariable Integer id) {
        etkinlikHizmeti.etkinlikReddet(id);
        return "redirect:/admin/etkinlikler/onay-bekleyen";
    }



    @GetMapping("/kullanicilar")
    public String tumKullanicilar(Model model) {

        List<Kullanici> liste = kullaniciServisi.tumKullanicilar();
        model.addAttribute("liste", liste);

        return "admin/kullanici-yonetim";
    }

    @PostMapping("/kullanici/rol-degistir/{id}")
    public String rolDegistir(@PathVariable Integer id, @RequestParam String rol) {
        kullaniciServisi.rolDegistir(id, rol);
        return "redirect:/admin/kullanicilar";
    }


    @GetMapping("/etkinlik/olustur")
    public String etkinlikOlusturSayfa(Model model) {
        model.addAttribute("etkinlik", new Etkinlik());
        return "admin/etkinlik-olustur";
    }

    @PostMapping("/etkinlik/olustur")
    public String etkinlikOlustur(@ModelAttribute Etkinlik etkinlik) {
        etkinlikHizmeti.etkinlikOlustur(etkinlik, "admin");
        return "redirect:/admin/panel";
    }


    @GetMapping("/etkinlik/duzenle/{id}")
    public String duzenleForm(@PathVariable Integer id, Model model) {
        Etkinlik e = etkinlikHizmeti.etkinlikGetir(id);
        model.addAttribute("etkinlik", e);
        return "admin/etkinlik-duzenle";
    }

    @PostMapping("/etkinlik/duzenle/{id}")
    public String duzenleKaydet(@PathVariable Integer id,
                                @ModelAttribute Etkinlik etkinlik) {
        etkinlikHizmeti.adminEtkinlikGuncelle(id, etkinlik);
        return "redirect:/admin/etkinlikler/onay-bekleyen";
    }

    @PostMapping("/etkinlik/sil/{id}")
    public String etkinlikSil(@PathVariable Integer id) {
        etkinlikHizmeti.etkinlikSil(id);
        return "redirect:/admin/etkinlikler";
    }


    @GetMapping("/etkinlikler")
    public String tumEtkinlikler(Model model) {

        List<Etkinlik> liste = etkinlikHizmeti.onaylananEtkinlikler();
        model.addAttribute("liste", liste);

        return "admin/etkinlik-liste";
    }
    
    
    @GetMapping("/etkinlik/katilim/{id}")
    public String adminEtkinlikKatilimListesi(@PathVariable Integer id, Model model) {

        List<KatilimKaydi> liste = etkinlikHizmeti.etkinlikKatilimlariniGetir(id);
        model.addAttribute("liste", liste);

        return "admin/katilim-listesi";
    }



}
