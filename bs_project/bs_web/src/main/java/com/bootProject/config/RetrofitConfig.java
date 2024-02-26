package com.bootProject.config;

import com.bootProject.oauth2.ServerAPIs;
import okhttp3.OkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import java.util.concurrent.TimeUnit;

@Configuration
public class RetrofitConfig {

    private static final String BASE_URL = "http://localhost:30001";

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder().writeTimeout(60, TimeUnit.SECONDS)
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .build();
    }

    @Bean
    public Retrofit retrofit(OkHttpClient client) {
        String baseURL = BASE_URL + "/api/v1/";
        return new Retrofit.Builder().baseUrl(baseURL)
                .addConverterFactory(GsonConverterFactory.create())
                .client(client)
                .build();
    }

    @Bean
    public ServerAPIs serverAPIs(Retrofit retrofit) {
        return retrofit.create(ServerAPIs.class);
    }

}
