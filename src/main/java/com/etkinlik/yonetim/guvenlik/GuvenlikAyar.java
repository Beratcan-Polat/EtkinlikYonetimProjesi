package com.etkinlik.yonetim.guvenlik;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class GuvenlikAyar {

        @Bean
        PasswordEncoder passwordEncoder() {
                return PasswordEncoderFactories.createDelegatingPasswordEncoder();
        }

        @Bean
        @org.springframework.core.annotation.Order(1)
        SecurityFilterChain mobileFilterChain(HttpSecurity http) throws Exception {
                http
                                .securityMatcher(
                                                new org.springframework.security.web.util.matcher.AntPathRequestMatcher(
                                                                "/mobile/**"))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/mobile/public/**").permitAll()
                                                .requestMatchers("/mobile/katilimci/profil",
                                                                "/mobile/katilimci/profil/guncelle")
                                                .authenticated()
                                                .requestMatchers("/mobile/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/mobile/organizator/**").hasRole("ORGANIZATOR")
                                                .requestMatchers("/mobile/katilimci/**").authenticated()
                                                .anyRequest().authenticated())
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(sess -> sess.sessionCreationPolicy(
                                                org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                                .httpBasic(Customizer.withDefaults());

                return http.build();
        }

        @Bean
        SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/giris",
                                                                "/kayit",
                                                                "/style.css",
                                                                "/images/**",
                                                                "/js/**",
                                                                "/webjars/**",
                                                                "/etkinlik/**")
                                                .permitAll()

                                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/organizator/**").hasRole("ORGANIZATOR")
                                                .requestMatchers("/katilimci/**").hasRole("KATILIMCI")

                                                .anyRequest().authenticated())

                                .formLogin(form -> form
                                                .loginPage("/giris")
                                                .loginProcessingUrl("/giris-islem")
                                                .defaultSuccessUrl("/rol-yonlendir", true)
                                                .failureUrl("/giris?hata")
                                                .permitAll())

                                .logout(l -> l
                                                .logoutUrl("/cikis")
                                                .logoutSuccessUrl("/giris?cikis")
                                                .invalidateHttpSession(true)
                                                .clearAuthentication(true)
                                                .deleteCookies("JSESSIONID")
                                                .permitAll())

                                // PROD ortamı için doğru ayar
                                .csrf(csrf -> csrf.disable())

                                .httpBasic(Customizer.withDefaults());

                return http.build();
        }
}
