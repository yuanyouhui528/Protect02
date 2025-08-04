package com.leadexchange;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 招商线索流通Web应用主启动类
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
@EnableTransactionManagement
@MapperScan("com.leadexchange.modules.*.mapper")
public class LeadExchangeApplication {

    /**
     * 应用程序主入口
     * 
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        SpringApplication.run(LeadExchangeApplication.class, args);
        System.out.println("\n" +
                "=======================================================\n" +
                "  招商线索流通Web应用后端服务启动成功！\n" +
                "  Spring Boot Version: 2.7.18\n" +
                "  Java Version: " + System.getProperty("java.version") + "\n" +
                "  Application Name: lead-exchange-backend\n" +
                "  Author: 系统开发团队\n" +
                "=======================================================");
    }

}