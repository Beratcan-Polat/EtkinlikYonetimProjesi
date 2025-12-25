package com.etkinlik.yonetim.util;

import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordHashUret {

    public static void main(String[] args) {
        PasswordEncoder encoder =
                PasswordEncoderFactories.createDelegatingPasswordEncoder();

        System.out.println("admin  : " + encoder.encode("admin"));
        System.out.println("1234   : " + encoder.encode("1234"));
    }
}
