package com.etkinlik.yonetim.kontrol;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RolYonlendirmeKontrol {

    @GetMapping("/rol-yonlendir")
    public String yonlendir(Authentication auth) {

        String rol = auth.getAuthorities().iterator().next().getAuthority();

        if (rol.equals("ROLE_ADMIN")) {
            return "redirect:/admin/panel";
        }
        if (rol.equals("ROLE_ORGANIZATOR")) {
            return "redirect:/organizator/panel";
        }
        return "redirect:/katilimci/panel";
    }
}
